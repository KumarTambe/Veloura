import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black text-white/80">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-16">
            <h1 className="text-3xl md:text-5xl font-serif text-white tracking-[0.2em] mb-4">
              TERMS OF SERVICE
            </h1>
            <div className="w-16 h-1 bg-luxury-gold mb-8"></div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Last Updated: May 2026
            </p>
          </div>

          <div className="space-y-12 text-sm leading-relaxed tracking-wide font-sans">
            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Veloura website and our services, you agree to be bound by these Terms of Service. These terms govern your acquisition of our luxury timepieces and your interaction with our digital platforms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">2. Authenticity & Guarantee</h2>
              <p>
                Every timepiece sold through Veloura is guaranteed 100% authentic. Each watch is accompanied by an official certificate of authenticity, the manufacturer's original presentation box, and a valid warranty card. We take absolute pride in our rigorous inspection process.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">3. Pricing & Availability</h2>
              <p>
                Due to the rare and exclusive nature of our inventory, all timepieces are subject to availability. Prices are listed in INR and may be subject to change based on market fluctuations. In the event of a pricing error, Veloura reserves the right to cancel any orders placed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">4. Intellectual Property</h2>
              <p>
                The elegant design, imagery, typography, and content presented on the Veloura website are the exclusive intellectual property of Veloura. Unauthorized reproduction, distribution, or use of our assets is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">5. Limitation of Liability</h2>
              <p>
                Veloura shall not be held liable for any indirect, incidental, or consequential damages arising from your use of our services or the delay/inability to fulfill an order due to circumstances beyond our control.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
