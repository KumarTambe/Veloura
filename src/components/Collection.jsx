import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCart } from '../context/CartContext';

const watches = [
  {
    id: 1,
    name: "Astronomica",
    price: "$245,000",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop",
    desc: "Rose Gold"
  },
  {
    id: 2,
    name: "Deep Sea",
    price: "$85,000",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop",
    desc: "Titanium"
  },
  {
    id: 3,
    name: "Skeleton",
    price: "$112,000",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop",
    desc: "Platinum"
  },
  {
    id: 4,
    name: "Lunar Phase",
    price: "$45,000",
    image: "https://images.unsplash.com/photo-1587836374828-cb4387df3eb7?q=80&w=800&auto=format&fit=crop",
    desc: "White Gold"
  }
];

export default function Collection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const { addToCart } = useCart();

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section id="collections" ref={targetRef} className="relative h-[250vh] bg-luxury-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        <div className="container mx-auto px-6 lg:px-12 mb-16">
          <h2 className="text-xl font-serif text-white/80 font-light tracking-wide">
            Curated <br /> <span className="text-white/40 italic">Collection.</span>
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-24 pl-6 lg:pl-12 pb-20 w-[200vw]">
          {watches.map((watch) => (
            <div 
              key={watch.id} 
              className="group flex flex-col w-[300px] md:w-[450px] shrink-0"
            >
              {/* Stark Minimal Image Container */}
              <div className="w-full aspect-[4/5] bg-luxury-charcoal overflow-hidden relative mb-6">
                <img 
                  src={watch.image} 
                  alt={watch.name} 
                  className="w-full h-full object-cover object-center opacity-70 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                />
              </div>
              
              {/* Minimalist Typography */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-serif text-white mb-1 tracking-wide">
                    {watch.name}
                  </h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">
                    {watch.desc}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-white/80 font-sans text-xs tracking-wider mb-2">{watch.price}</p>
                  <button 
                    onClick={() => addToCart(watch)}
                    className="text-[9px] uppercase tracking-[0.2em] border-b border-transparent group-hover:border-white/30 text-white/40 group-hover:text-white transition-colors pb-1"
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
