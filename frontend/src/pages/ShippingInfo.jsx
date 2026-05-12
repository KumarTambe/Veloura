import { motion } from 'framer-motion';

export default function ShippingInfo() {
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
              SHIPPING INFORMATION
            </h1>
            <div className="w-16 h-1 bg-luxury-gold mb-8"></div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Secure Global Delivery
            </p>
          </div>

          <div className="space-y-12 text-sm leading-relaxed tracking-wide font-sans">
            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">1. White-Glove Delivery</h2>
              <p>
                A luxury timepiece demands luxury handling. Veloura partners exclusively with specialized secure logistics providers (such as Brinks and Malca-Amit) to ensure your watch arrives safely. All shipments are fully insured for their total value until they reach your hands.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">2. Processing Times</h2>
              <p className="mb-4">Our dispatch protocol ensures thorough final inspections before shipping:</p>
              <ul className="list-disc list-inside space-y-2 text-white/60 ml-4">
                <li><strong>In-Stock Timepieces:</strong> Dispatched within 1-2 business days.</li>
                <li><strong>Sourced Timepieces:</strong> May require 7-14 business days. You will be notified of the precise timeline upon inquiry.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">3. Shipping Rates</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4">
                <div className="flex justify-between border-b border-white/10 pb-4 mb-4">
                  <span className="font-serif text-white tracking-wider">Domestic (India)</span>
                  <span className="text-luxury-gold">Complimentary</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4 mb-4">
                  <span className="font-serif text-white tracking-wider">International Priority</span>
                  <span className="text-luxury-gold">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-serif text-white tracking-wider">White-Glove Hand Delivery</span>
                  <span className="text-luxury-gold">Available Upon Request</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-serif text-white tracking-widest mb-4">4. Customs & Duties</h2>
              <p>
                For international orders, please be advised that customs duties, taxes, and import fees are the sole responsibility of the client. Veloura complies with all international trade laws and accurately declares the value of the timepiece on all export documentation.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
