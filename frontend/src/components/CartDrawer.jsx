import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-charcoal border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-sm font-serif uppercase tracking-[0.3em] text-white">Your Selection</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <p className="text-xs uppercase tracking-[0.2em] font-sans">Your collection is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-6 border-b border-white/5">
                    <div className="w-20 h-24 bg-luxury-black overflow-hidden flex-shrink-0">
                      <img 
                        src={item.images && item.images.length > 0 ? item.images[0] : ''} 
                        alt={item.name} 
                        className="w-full h-full object-cover opacity-80" 
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-sm font-serif text-white tracking-wider">{item.name}</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">
                          {item.category || item.brand}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-colors"
                          >
                            -
                          </button>
                          <span className="text-[10px] text-white/80 w-3 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.stockQuantity}
                            className={`w-5 h-5 rounded-full border border-white/30 flex items-center justify-center transition-colors ${item.quantity >= item.stockQuantity ? 'opacity-30 cursor-not-allowed' : 'text-white/50 hover:text-white hover:border-white'}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-xs font-mono text-white/80">
                          ₹{item.price?.toLocaleString()}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors border-b border-transparent hover:border-white/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-luxury-black border-t border-white/10">
                <div className="flex justify-between mb-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Subtotal</span>
                  <span className="text-sm font-mono tracking-wider">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
