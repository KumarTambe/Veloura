import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Saved address from profile
  const [savedAddress, setSavedAddress] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Fetch saved address on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.token) return;
      try {
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok && data.address && data.address.street) {
          setSavedAddress({
            ...data.address,
            fullName: data.username || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [user]);

  // When user toggles to saved address, pre-fill the form
  useEffect(() => {
    if (useSavedAddress && savedAddress) {
      const nameParts = (savedAddress.fullName || '').split(' ');
      setShipping({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        street: savedAddress.street || '',
        city: savedAddress.city || '',
        state: savedAddress.state || '',
        zipCode: savedAddress.zipCode || '',
        country: savedAddress.country || '',
      });
    } else if (!useSavedAddress) {
      setShipping({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      });
    }
  }, [useSavedAddress, savedAddress]);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 2) {
      if (!user || !user.token) {
        alert('Please log in to place an order.');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        // 1. Get Razorpay key
        const keyRes = await fetch('/api/payment/key', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const { keyId } = await keyRes.json();

        if (!keyId) {
           alert('Payment gateway configuration missing. Please ensure RAZORPAY_KEY_ID is set in the backend .env file.');
           setLoading(false);
           return;
        }

        // 2. Create Order on our backend
        const createRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ amount: cartTotal }),
        });
        
        const orderData = await createRes.json();
        if (!createRes.ok) throw new Error(orderData.message || 'Could not create order');

        // 3. Open Razorpay Checkout Modal
        const options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Veloura Premium',
          description: 'Luxury Watch Purchase',
          order_id: orderData.id,
          handler: async function (response) {
            try {
              setLoading(true);
              // 4. Verify payment on our backend
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.message || 'Payment verification failed');

              // 5. Create final order in DB
              const finalOrderData = {
                orderItems: cartItems.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  product: item._id,
                })),
                shippingAddress: {
                  street: shipping.street,
                  city: shipping.city,
                  state: shipping.state,
                  zipCode: shipping.zipCode,
                  country: shipping.country,
                },
                paymentMethod: 'Razorpay',
                totalPrice: cartTotal,
                paymentResult: {
                  id: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                }
              };

              const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(finalOrderData),
              });

              const dbOrderData = await res.json();

              if (res.ok) {
                await clearCart();
                navigate(`/order/${dbOrderData._id}`);
              } else {
                alert(dbOrderData.message || 'Failed to record order');
              }
            } catch (error) {
              console.error('Verification error:', error);
              alert(error.message || 'An error occurred during verification.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: `${shipping.firstName} ${shipping.lastName}`,
            email: user.email,
            contact: '9999999999',
          },
          theme: {
            color: '#C5A059', // Veloura Gold
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp.open();
      } catch (error) {
        console.error('Order error:', error);
        alert(error.message || 'An error occurred while initiating payment.');
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <p className="text-sm tracking-widest uppercase mb-6">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="border-b border-white pb-1 text-xs uppercase">Return Home</button>
      </div>
    );
  }

  const inputClass = "w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors";

  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        
        <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h1 className="text-2xl font-serif tracking-[0.3em] text-white">SECURE CHECKOUT</h1>
          <div className="flex space-x-4 text-[10px] uppercase tracking-[0.2em] font-mono">
            <span className={step === 1 ? 'text-white' : 'text-white/30'}>1. Shipping</span>
            <span className="text-white/30">/</span>
            <span className={step === 2 ? 'text-white' : 'text-white/30'}>2. Confirm & Pay</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <form onSubmit={handleNext}>
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Shipping Information</h2>

                  {/* Address Selection Toggle */}
                  {savedAddress && (
                    <div className="space-y-4 mb-8">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setUseSavedAddress(true)}
                          className={`flex-1 p-4 border text-left transition-all duration-300 ${
                            useSavedAddress
                              ? 'border-luxury-gold/50 bg-luxury-gold/5'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              useSavedAddress ? 'border-luxury-gold' : 'border-white/30'
                            }`}>
                              {useSavedAddress && <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>}
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Saved Address</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed pl-7">
                            {savedAddress.street}<br />
                            {savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}<br />
                            {savedAddress.country}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUseSavedAddress(false)}
                          className={`flex-1 p-4 border text-left transition-all duration-300 ${
                            !useSavedAddress
                              ? 'border-luxury-gold/50 bg-luxury-gold/5'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              !useSavedAddress ? 'border-luxury-gold' : 'border-white/30'
                            }`}>
                              {!useSavedAddress && <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>}
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">New Address</span>
                          </div>
                          <p className="text-xs text-white/30 pl-7 mt-3">
                            Enter a different shipping address
                          </p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Shipping Form — shown when no saved address, or when "New Address" is selected */}
                  {(!savedAddress || !useSavedAddress) && (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 sm:col-span-1">
                        <input type="text" name="firstName" placeholder="First Name" required value={shipping.firstName} onChange={handleShippingChange} className={inputClass} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input type="text" name="lastName" placeholder="Last Name" required value={shipping.lastName} onChange={handleShippingChange} className={inputClass} />
                      </div>
                      <div className="col-span-2">
                        <input type="text" name="street" placeholder="Address" required value={shipping.street} onChange={handleShippingChange} className={inputClass} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input type="text" name="city" placeholder="City" required value={shipping.city} onChange={handleShippingChange} className={inputClass} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input type="text" name="state" placeholder="State" required value={shipping.state} onChange={handleShippingChange} className={inputClass} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input type="text" name="zipCode" placeholder="Zip Code" required value={shipping.zipCode} onChange={handleShippingChange} className={inputClass} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input type="text" name="country" placeholder="Country" required value={shipping.country} onChange={handleShippingChange} className={inputClass} />
                      </div>
                    </div>
                  )}

                  {/* Summary when using saved address */}
                  {useSavedAddress && savedAddress && (
                    <div className="p-6 border border-white/10 bg-white/[0.02]">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">Delivering To</p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {savedAddress.fullName}<br />
                        {savedAddress.street}<br />
                        {savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}<br />
                        {savedAddress.country}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Confirm & Pay</h2>
                  
                  <div className="space-y-4 border-b border-white/10 pb-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Shipping To</p>
                    <p className="text-sm text-white/80">
                      {shipping.firstName} {shipping.lastName}<br />
                      {shipping.street}<br />
                      {shipping.city}, {shipping.state} {shipping.zipCode}<br />
                      {shipping.country}
                    </p>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">
                    By proceeding, you will be securely redirected to Razorpay to complete your payment. 
                    Your item will be shipped securely via armored courier within 2-3 business days upon payment confirmation.
                  </p>
                  
                  <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/20 rounded">
                    <p className="text-[10px] uppercase tracking-widest text-luxury-gold mb-1">Test Mode Notice</p>
                    <p className="text-[10px] text-white/50 leading-relaxed">
                      Razorpay limits test transactions significantly. If your cart exceeds this, the payment popup will show ₹100 to allow the test to succeed, but your actual order will be recorded correctly. Please use an <strong>Indian</strong> test card or Netbanking.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="mt-12 flex justify-between items-center">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors border-b border-transparent hover:border-white">
                    Back
                  </button>
                ) : <div></div>}
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`px-12 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 ${
                    loading 
                      ? 'bg-white/30 text-white/50 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-luxury-gold hover:text-white'
                  }`}
                >
                  {loading ? 'Processing...' : step === 2 ? 'Pay with Razorpay' : 'Continue'}
                </button>
              </div>
            </form>
          </div>

          <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
            <h3 className="text-[10px] uppercase tracking-widest text-white/50 mb-8">Order Summary</h3>
            <div className="space-y-6 mb-8">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-serif">{item.name}</p>
                    <p className="text-[8px] uppercase tracking-widest text-white/40">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-mono">₹{item.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest">Total</span>
                <span className="text-sm font-mono tracking-wider">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
