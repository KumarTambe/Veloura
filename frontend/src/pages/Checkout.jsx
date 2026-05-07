import { useState } from 'react';
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

  // Form state
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 3) {
      // Submit order
      if (!user || !user.token) {
        alert('Please log in to place an order.');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const orderData = {
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
          paymentMethod: 'Credit Card',
          totalPrice: cartTotal,
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (res.ok) {
          await clearCart();
          navigate(`/order/${data._id}`);
        } else {
          alert(data.message || 'Failed to place order');
        }
      } catch (error) {
        console.error('Order error:', error);
        alert('An error occurred while placing your order.');
      } finally {
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
            <span className={step === 2 ? 'text-white' : 'text-white/30'}>2. Payment</span>
            <span className="text-white/30">/</span>
            <span className={step === 3 ? 'text-white' : 'text-white/30'}>3. Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <form onSubmit={handleNext}>
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Shipping Information</h2>
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
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Payment Details</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <input type="text" name="cardNumber" placeholder="Card Number" required value={payment.cardNumber} onChange={handlePaymentChange} className={`${inputClass} font-mono tracking-widest`} />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input type="text" name="expiry" placeholder="MM/YY" required value={payment.expiry} onChange={handlePaymentChange} className={`${inputClass} font-mono`} />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input type="text" name="cvc" placeholder="CVC" required value={payment.cvc} onChange={handlePaymentChange} className={`${inputClass} font-mono`} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Confirm Order</h2>
                  
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
                    By confirming this order, you agree to Veloura's Terms of Service. Your item will be shipped securely via armored courier within 2-3 business days.
                  </p>
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
                  {loading ? 'Processing...' : step === 3 ? 'Complete Purchase' : 'Continue'}
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
                  <p className="text-xs font-mono">${item.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest">Total</span>
                <span className="text-sm font-mono tracking-wider">${cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
