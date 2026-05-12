import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
              PRIVACY POLICY
            </h1>
            <div className="w-16 h-1 bg-luxury-gold mb-8"></div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Last Updated: May 2026
            </p>
          </div>

          <div className="space-y-12 text-sm leading-relaxed tracking-wide font-sans">
            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">1. Introduction</h2>
              <p>
                At Veloura, we hold your privacy in the highest regard. This Privacy Policy details the meticulous care with which we handle your personal information when you interact with our boutique, visit our website, or purchase our horological masterpieces.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">2. Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-2 text-white/60 ml-4">
                <li>Contact information (Name, Email, Phone number)</li>
                <li>Shipping and Billing addresses</li>
                <li>Payment details (Processed securely via Razorpay)</li>
                <li>Purchase history and timepiece preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">3. Use of Information</h2>
              <p>
                The information curated is strictly utilized to elevate your Veloura experience. We use your data to process transactions, deliver your timepieces securely, provide personalized concierge support, and inform you of exclusive boutique events or limited-edition releases.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">4. Data Security</h2>
              <p>
                We employ state-of-the-art encryption protocols and rigid physical security measures to protect your data. Just as our watch vaults secure physical masterpieces, our digital infrastructure is designed to safeguard your personal identity against unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">5. Contact Us</h2>
              <p>
                For any inquiries regarding our privacy practices, please contact our dedicated privacy concierge at <a href="mailto:privacy@veloura.com" className="text-luxury-gold hover:underline">privacy@veloura.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
