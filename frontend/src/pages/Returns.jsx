import { motion } from 'framer-motion';

export default function Returns() {
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
              RETURNS & EXCHANGES
            </h1>
            <div className="w-16 h-1 bg-luxury-gold mb-8"></div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              The Veloura Guarantee
            </p>
          </div>

          <div className="space-y-12 text-sm leading-relaxed tracking-wide font-sans">
            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">1. 14-Day Return Policy</h2>
              <p>
                We stand behind the exceptional quality of our timepieces. If you are not entirely satisfied with your purchase, Veloura offers a 14-day return or exchange policy from the date of delivery. The watch must be returned in its exact original condition, unworn, with all protective stickers intact, and accompanied by the original box, papers, and accessories.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">2. Conditions for Return</h2>
              <ul className="list-disc list-inside space-y-2 text-white/60 ml-4">
                <li>The timepiece must exhibit no signs of wear, scratches, or sizing alterations.</li>
                <li>All original documentation, including the certificate of authenticity, must be present and unblemished.</li>
                <li>Special order or customized timepieces are strictly non-refundable and non-exchangeable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">3. Initiation Process</h2>
              <p>
                To initiate a return, please contact your dedicated Veloura concierge or email <span className="text-luxury-gold">returns@veloura.com</span>. We will arrange for a secure, insured courier to collect the timepiece from your location. We strongly advise against returning the item via standard postal services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">4. Inspection & Refunds</h2>
              <p>
                Upon receipt, our master watchmakers will conduct a rigorous inspection to ensure the timepiece meets our return conditions. Once approved, refunds will be processed to the original method of payment within 5-7 business days. Please note that return shipping and insurance costs may be deducted from the final refund amount.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
