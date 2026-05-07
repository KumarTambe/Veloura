import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingBag, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled ? 'py-4 bg-luxury-black/95 backdrop-blur-sm border-white/10' : 'py-8 bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Desktop Links (Left) */}
          <div className="hidden md:flex items-center space-x-12 w-1/3">
            {['Collections', 'Masterpieces'].map((item) => (
              <a
                key={item}
                href={`/#${item.toLowerCase()}`}
                className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Logo (Center) */}
          <div className="flex justify-center w-1/3">
            <Link to="/" className="text-xl font-serif tracking-[0.3em] text-white">
              VELOURA
            </Link>
          </div>

          {/* Icons/Links (Right) */}
          <div className="flex items-center justify-end space-x-8 w-1/3">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/50">
                  <User size={16} strokeWidth={1.5} />
                  <span className="text-[10px] uppercase tracking-widest">{user.username}</span>
                </div>
                <Link to="/orders" className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                  Orders
                </Link>
                <button onClick={logout} className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <User size={16} strokeWidth={1.5} />
              </Link>
            )}
            <button className="text-white/50 hover:text-white transition-colors">
              <Search size={16} strokeWidth={1.5} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="text-white/50 hover:text-white transition-colors relative">
              <ShoppingBag size={16} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 text-[8px] text-luxury-gold tracking-tighter">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden text-white/50 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-luxury-black flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-8 right-6 text-white/50 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} strokeWidth={1.5} />
            </button>
            
            <div className="flex flex-col items-center space-y-10">
              {['Collections', 'Masterpieces', 'Heritage', 'Boutiques'].map((item, i) => (
                <motion.a
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
