import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProductShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section id="masterpieces" ref={containerRef} className="relative py-32 bg-luxury-black border-y border-white/5">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Minimal Image */}
          <motion.div 
            style={{ y: yText }}
            className="w-full aspect-[3/4] lg:aspect-square bg-luxury-charcoal relative overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop" 
              alt="Veloura Precision Core" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity"
            />
          </motion.div>

          {/* Minimal Specs */}
          <div className="flex flex-col justify-center">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">Specifications</h3>
            <h4 className="text-3xl font-serif text-white mb-16 font-light tracking-wide">
              The Architecture <br />
              <span className="text-white/50 italic">of Time.</span>
            </h4>
            
            <div className="space-y-0 border-t border-white/10">
              {[
                { num: "01", title: "Material", desc: "Grade 5 Titanium & Platinum" },
                { num: "02", title: "Movement", desc: "Calibre V-01 Automatic" },
                { num: "03", title: "Reserve", desc: "72 Hours Power Reserve" },
                { num: "04", title: "Crystal", desc: "Domed Sapphire Anti-Reflective" }
              ].map((spec) => (
                <div key={spec.num} className="flex flex-col py-6 border-b border-white/10 group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-mono">{spec.num}</span>
                    <span className="text-white/80 text-xs uppercase tracking-[0.2em]">{spec.title}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-white/40 text-sm font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {spec.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
