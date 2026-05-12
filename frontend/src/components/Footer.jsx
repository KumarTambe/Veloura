import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-luxury-black pt-32 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-serif tracking-[0.3em] text-white mb-6">VELOURA.</h2>
            <p className="text-xs text-white/40 max-w-sm tracking-widest leading-relaxed">
              The architecture of time. Engineered with perfection, designed with minimal elegance.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 font-semibold">Boutique</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/shop" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Collections</Link>
              </li>
              <li>
                <Link to="/shop" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Masterpieces</Link>
              </li>
              <li>
                <Link to="/community" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Heritage</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Services</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 font-semibold">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/privacy" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Terms of Service</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Shipping Info</Link>
              </li>
              <li>
                <Link to="/returns" className="text-xs text-white/60 hover:text-white transition-colors tracking-widest">Returns</Link>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
            © {new Date().getFullYear()} Veloura. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {['Instagram', 'Twitter', 'Journal'].map((social) => (
              <a key={social} href="#" className="text-[9px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
