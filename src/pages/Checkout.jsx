import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 3) {
      alert("Payment successful. Thank you for your purchase.");
      navigate('/');
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
                      <input type="text" placeholder="First Name" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input type="text" placeholder="Last Name" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors" />
                    </div>
                    <div className="col-span-2">
                      <input type="text" placeholder="Address" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input type="text" placeholder="City" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input type="text" placeholder="Zip Code" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Payment Details</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <input type="text" placeholder="Card Number" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors font-mono tracking-widest" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input type="text" placeholder="MM/YY" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors font-mono" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input type="text" placeholder="CVC" required className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-white transition-colors font-mono" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Confirm Order</h2>
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
                <button type="submit" className="px-12 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-300">
                  {step === 3 ? 'Complete Purchase' : 'Continue'}
                </button>
              </div>
            </form>
          </div>

          <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
            <h3 className="text-[10px] uppercase tracking-widest text-white/50 mb-8">Order Summary</h3>
            <div className="space-y-6 mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-serif">{item.name}</p>
                    <p className="text-[8px] uppercase tracking-widest text-white/40">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-mono">{item.price}</p>
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
