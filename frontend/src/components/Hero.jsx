import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 1000], [0, 130]);
  const yImage = useTransform(scrollY, [0, 1000], [0, 70]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-luxury-black flex items-center pt-24 pb-16 lg:pt-20 lg:pb-0">
      <motion.div
        className="absolute -inset-x-4 inset-y-0 scale-[1.02]"
        style={{ y: yImage }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1.02 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <img 
          src="/watches/tourbillon.png" 
          alt="Veloura Signature Timepiece" 
          className="h-full w-full object-cover object-[76%_center] opacity-80"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute right-[7%] top-[18%] hidden h-52 w-52 rounded-full border border-luxury-gold/20 lg:block"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-luxury-gold shadow-[0_0_26px_rgba(179,144,80,0.75)]" />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(179,144,80,0.22),transparent_28%),radial-gradient(circle_at_64%_56%,rgba(255,255,255,0.09),transparent_24%),linear-gradient(90deg,#030303_0%,rgba(3,3,3,0.92)_34%,rgba(3,3,3,0.44)_67%,rgba(3,3,3,0.82)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-luxury-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-luxury-black via-luxury-black/54 to-transparent" />

      <div className="container relative z-10 mx-auto grid min-h-[calc(100svh-10rem)] grid-cols-1 items-center gap-12 px-6 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-12 lg:px-12">
        <motion.div 
          className="max-w-2xl lg:col-span-6"
          style={{ y: yText, opacity }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <motion.span
            className="mb-8 inline-flex items-center gap-3 text-[10px] font-light uppercase tracking-[0.34em] text-luxury-gold"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <span className="h-px w-10 bg-luxury-gold/50" />
            The New Standard
          </motion.span>
          <h1 className="mb-8 text-5xl font-light leading-[1.02] tracking-wide text-white sm:text-6xl lg:text-8xl">
            Time, <br />
            <span className="italic text-white/72">Made Cinematic.</span>
          </h1>
          <p className="mb-12 max-w-md text-sm font-light leading-relaxed tracking-wide text-white/58">
            Sculpted mechanics, sapphire clarity, and a presence that catches the room before it catches the light.
          </p>
          
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <button 
              onClick={() => document.getElementById('masterpieces')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-4 border-b border-luxury-gold/50 pb-2 transition-colors hover:border-white"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-white">Explore Collection</span>
              <ArrowUpRight size={15} strokeWidth={1.4} className="text-luxury-gold transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </button>
            <a
              href="/shop"
              className="border-b border-transparent pb-2 text-[11px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:border-white/30 hover:text-white"
            >
              View Boutique
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="hidden self-end lg:col-span-6 lg:block"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.65 }}
        >
          <motion.div
            className="ml-auto grid w-full max-w-sm grid-cols-2 border border-white/10 bg-black/18 text-white/55 backdrop-blur-md"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <div className="border-r border-white/10 px-6 py-5">
              <p className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/32">Calibre</p>
              <p className="font-serif text-2xl text-white/84">V-01</p>
            </div>
            <div className="px-6 py-5">
              <p className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/32">Reserve</p>
              <p className="font-serif text-2xl text-white/84">72H</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-6 z-10 flex items-center gap-4 lg:left-12"
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
