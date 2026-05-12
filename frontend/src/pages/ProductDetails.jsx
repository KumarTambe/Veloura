import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center flex-col gap-6">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Product Not Found</div>
        <Link to="/" className="text-white text-[10px] uppercase tracking-[0.3em] border-b border-white/30 pb-1 hover:border-white transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12">
        <Link to="/" className="inline-block text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors mb-12">
          ← Back to Collection
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 aspect-[4/5] bg-luxury-charcoal relative overflow-hidden"
          >
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : ''} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">{product.brand} | {product.category}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide mb-6">{product.name}</h1>
            <p className="text-2xl font-sans text-white/80 tracking-wider mb-10">₹{product.price?.toLocaleString()}</p>
            
            <div className="border-t border-white/10 pt-8 mb-12">
              <p className="text-sm text-white/60 leading-relaxed font-serif italic">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-4">
                <span>Availability</span>
                <span className={product.stockQuantity > 0 ? 'text-luxury-gold' : 'text-red-500'}>
                  {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {(() => {
                const cartItem = cartItems.find(item => item._id === product._id);
                const maxReached = cartItem && cartItem.quantity >= product.stockQuantity;
                return (
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity === 0 || maxReached}
                    className={`w-full py-5 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 ${
                      product.stockQuantity > 0 && !maxReached
                        ? 'bg-white text-black hover:bg-luxury-gold hover:text-white' 
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {maxReached ? 'Max Stock in Cart' : 'Add to Cart'}
                  </button>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
