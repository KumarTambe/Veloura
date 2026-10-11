import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function Collection() {
  const [watches, setWatches] = useState([]);
  const targetRef = useRef(null);
  const trackRef = useRef(null);
  // How far the card track must slide so the last card ends on screen
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  const { addToCart } = useCart();

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setWatches(data.products || data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section
      id="collections"
      ref={targetRef}
      className="relative bg-luxury-black"
      // Vertical scroll maps 1:1 onto the horizontal slide
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        <div className="container mx-auto px-6 lg:px-12 mb-16">
          <h2 className="text-xl font-serif text-white/80 font-light tracking-wide">
            Curated <br /> <span className="text-white/50 italic">Collection.</span>
          </h2>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-16 lg:gap-24 px-6 lg:px-12 pb-20 will-change-transform">
          {watches.map((watch) => (
            <div 
              key={watch._id} 
              className="group flex flex-col w-[300px] md:w-[450px] shrink-0"
            >
              {/* Stark Minimal Image Container */}
              <Link to={`/product/${watch._id}`}>
                <div className="w-full aspect-[4/5] bg-luxury-charcoal overflow-hidden relative mb-6">
                  <img 
                    src={watch.images && watch.images.length > 0 ? watch.images[0] : ''} 
                    alt={watch.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center opacity-70 group-hover:opacity-100 transition-[opacity,transform] duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>
              
              {/* Minimalist Typography */}
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/product/${watch._id}`}>
                    <h3 className="text-lg font-serif text-white mb-1 tracking-wide hover:text-white/70 transition-colors">
                      {watch.name}
                    </h3>
                  </Link>
                  <p className="text-white/50 text-xs uppercase tracking-[0.2em] w-[200px] truncate">
                    {watch.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-white/80 font-sans text-[13px] tracking-wider mb-2">
                    ₹{watch.price?.toLocaleString()}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(watch);
                    }}
                    className="relative z-10 text-[11px] uppercase tracking-[0.2em] border-b border-transparent group-hover:border-white/30 text-white/50 group-hover:text-white transition-colors pb-1 cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
