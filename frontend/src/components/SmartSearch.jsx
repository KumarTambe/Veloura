import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';

export default function SmartSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Keyboard shortcut to open search (CMD/CTRL + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const suggestions = ['Royal Oak', 'Tourbillon', 'Rose Gold', 'Skeleton Dial', 'Chronograph'];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-luxury-black/80 backdrop-blur-xl flex justify-center items-start pt-32 px-4"
          >
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-luxury-obsidian border border-white/10 rounded-2xl p-6 shadow-2xl shadow-luxury-gold/5"
            >
              <div className="flex items-center border-b border-white/10 pb-4 relative">
                <Search className="text-white/50 w-6 h-6 mr-4" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search timepieces, collections, materials..."
                  className="bg-transparent border-none outline-none w-full text-xl text-white placeholder-white/30 font-sans"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-md text-xs tracking-widest uppercase font-semibold"
                >
                  ESC
                </button>
              </div>

              {query.length === 0 ? (
                <div className="pt-6">
                  <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-sans">Trending Suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button 
                        key={item}
                        className="px-4 py-2 bg-white/5 hover:bg-luxury-gold hover:text-black border border-white/5 rounded-full text-sm transition-all duration-300"
                        onClick={() => setQuery(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-6">
                  <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-sans">Results for "{query}"</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/10 rounded-md"></div>
                          <div>
                            <h4 className="font-serif text-white group-hover:text-luxury-gold transition-colors">Veloura Model X{i+1}</h4>
                            <p className="text-sm text-white/50">Titanium • 42mm</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Trigger Button - Fixed to bottom right for easy access */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-luxury-gold text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_40px_rgba(197,160,89,0.5)] transition-shadow group"
      >
        <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.button>
    </>
  );
}
