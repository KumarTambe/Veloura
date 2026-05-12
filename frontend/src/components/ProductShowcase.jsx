import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gem, Gauge, ShieldCheck, Sparkles, Timer, Watch } from 'lucide-react';

const stats = [
  { label: 'Hand assembly', value: '142', unit: 'hrs', icon: Timer },
  { label: 'Reserve', value: '72', unit: 'hrs', icon: Gauge },
  { label: 'Water sealed', value: '100', unit: 'm', icon: ShieldCheck },
];

const craftNotes = [
  {
    title: 'Open-work calibre',
    body: 'Layered bridges reveal the movement architecture without losing restraint.',
    icon: Watch,
  },
  {
    title: 'Rose-gold indexes',
    body: 'Warm polished accents catch light across the dial with quiet precision.',
    icon: Sparkles,
  },
  {
    title: 'Sapphire depth',
    body: 'A crystal-clear surface adds shadow, reflection, and visual tension.',
    icon: Gem,
  },
];

const materials = ['Black ceramic', 'Sapphire glass', 'Rose gold', 'Alligator leather'];

const hotspots = [
  { label: 'Skeleton dial', className: 'left-[46%] top-[43%]' },
  { label: 'Signed crown', className: 'right-[18%] top-[50%]' },
  { label: 'Tourbillon window', className: 'left-[48%] bottom-[30%]' },
];

export default function ProductShowcase() {
  const [activeMaterial, setActiveMaterial] = useState(materials[0]);
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0.05, 0.45], [40, -40]);
  const glowScale = useTransform(scrollYProgress, [0.05, 0.45], [0.9, 1.14]);

  return (
    <section
      id="masterpieces"
      className="luxury-container relative isolate overflow-hidden bg-luxury-black px-6 py-24 text-white sm:py-28 lg:px-12 lg:py-36"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(179,144,80,0.16),transparent_30%),radial-gradient(circle_at_82%_62%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,#030303_0%,#090806_48%,#030303_100%)]" />
      <motion.div
        aria-hidden="true"
        style={{ scale: glowScale }}
        className="absolute left-1/2 top-[42%] -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-luxury-gold/10 blur-3xl"
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
      <div className="absolute inset-x-8 top-28 -z-10 hidden h-[38rem] rounded-full border border-white/5 lg:block" />

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr_0.8fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="space-y-8 lg:pr-4"
        >
          <div>
            <span className="mb-5 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-luxury-gold">
              <span className="h-px w-10 bg-luxury-gold/60" />
              Inside the Atelier
            </span>
            <h2 className="max-w-xl text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
              Mechanical theatre, built for the wrist.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/56">
            A darker, sharper expression of modern watchmaking. Every surface is composed to hold light, shadow, and attention.
          </p>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: index * 0.12 }}
                  className="group border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-luxury-gold/40 hover:bg-luxury-gold/[0.06] hover:shadow-[0_20px_60px_rgba(179,144,80,0.12)]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <Icon size={18} strokeWidth={1.4} className="text-luxury-gold" />
                    <span className="h-px w-12 bg-gradient-to-r from-luxury-gold/60 to-transparent" />
                  </div>
                  <div className="flex items-end gap-2">
                    <motion.span
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: 0.25 + index * 0.12 }}
                      className="font-serif text-4xl text-white"
                    >
                      {item.value}
                    </motion.span>
                    <span className="pb-2 text-[10px] uppercase tracking-[0.24em] text-white/38">{item.unit}</span>
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-white/42">{item.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="group relative mx-auto flex w-full max-w-[38rem] items-center justify-center py-8"
        >
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 34, ease: 'linear' }}
            className="absolute h-[78%] w-[78%] rounded-full border border-luxury-gold/20"
          />
          <motion.div
            aria-hidden="true"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 46, ease: 'linear' }}
            className="absolute h-[95%] w-[95%] rounded-full border border-white/10"
          />
          <div className="absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(179,144,80,0.22),transparent_62%)] blur-2xl" />
          <div className="relative aspect-square w-full max-w-[34rem] overflow-hidden rounded-full border border-white/10 bg-black/35 shadow-[0_50px_140px_rgba(0,0,0,0.72)] backdrop-blur">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.14)_44%,transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <img
              src="/watches/tourbillon.png"
              alt="Veloura tourbillon watch"
              className="h-full w-full object-cover object-center opacity-95 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-[2deg]"
            />
          </div>

          {hotspots.map((spot, index) => (
            <motion.div
              key={spot.label}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.6 + index * 0.16 }}
              className={`absolute ${spot.className} hidden md:block`}
            >
              <div className="group/hotspot relative">
                <span className="block h-3 w-3 rounded-full bg-luxury-gold shadow-[0_0_22px_rgba(179,144,80,0.9)]" />
                <span className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-luxury-gold/50" />
                <span className="pointer-events-none absolute left-5 top-1/2 min-w-36 -translate-y-1/2 border border-white/10 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white/70 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/hotspot:opacity-100">
                  {spot.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-5 lg:pl-4">
          {craftNotes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.75, delay: index * 0.13 }}
                className="group relative overflow-hidden border border-white/10 bg-white/[0.035] p-6 backdrop-blur-md transition-all duration-500 hover:border-luxury-gold/40 hover:bg-white/[0.055]"
              >
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-luxury-gold/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mb-8 flex items-center justify-between">
                  <Icon size={19} strokeWidth={1.35} className="text-luxury-gold" />
                  <span className="text-[10px] text-white/22">0{index + 1}</span>
                </div>
                <h3 className="mb-3 font-serif text-2xl text-white/88">{item.title}</h3>
                <p className="max-w-sm text-sm leading-6 text-white/48">{item.body}</p>
              </motion.article>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="border border-luxury-gold/20 bg-luxury-gold/[0.045] p-5 backdrop-blur-md"
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-luxury-gold">Material study</p>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <button
                  key={material}
                  onMouseEnter={() => setActiveMaterial(material)}
                  onFocus={() => setActiveMaterial(material)}
                  className={`border px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                    activeMaterial === material
                      ? 'border-luxury-gold/60 bg-luxury-gold/15 text-white'
                      : 'border-white/10 text-white/42 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
            <div className="mt-5 h-1 overflow-hidden bg-white/10">
              <motion.div
                key={activeMaterial}
                initial={{ width: '18%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-luxury-gold via-white/70 to-luxury-gold"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
