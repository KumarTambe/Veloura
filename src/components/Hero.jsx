import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 1000], [0, 200]);
  const yImage = useTransform(scrollY, [0, 1000], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  return (
    <section className="relative h-screen w-full bg-luxury-black flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
        
        {/* Editorial Text (Left) */}
        <motion.div 
          className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 z-10"
          style={{ y: yText, opacity }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <span className="text-luxury-gold uppercase tracking-[0.4em] text-[10px] mb-8 font-light block">
            The New Standard
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif leading-tight tracking-wide mb-8 text-white font-light">
            Elegance <br />
            <span className="italic text-white/70">Redefined.</span>
          </h1>
          <p className="text-sm text-white/40 font-light max-w-sm mb-12 leading-relaxed tracking-wide">
            A meticulous exploration of form and function. Crafted from high-grade titanium and finished with profound attention to detail.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <button 
              onClick={() => document.getElementById('masterpieces')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-4 pb-2 border-b border-white/20 hover:border-white transition-colors"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-white">Explore Collection</span>
            </button>
          </div>
        </motion.div>

        {/* Hero Image (Right) */}
        <motion.div 
          className="lg:col-span-7 h-[60vh] lg:h-[80vh] w-full order-1 lg:order-2 relative"
          style={{ y: yImage }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="w-full h-full relative overflow-hidden bg-luxury-charcoal">
            {/* High-end unplash watch image */}
            <img 
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop" 
              alt="Veloura Signature Timepiece" 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
            />
            {/* Subtle overlay gradient to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-luxury-black opacity-80 lg:opacity-100" />
          </div>
        </motion.div>
      </div>

      {/* Minimalist Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-6 lg:left-12 flex items-center gap-4"
      >
        <span className="text-white/30 text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-12 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
