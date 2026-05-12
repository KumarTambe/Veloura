import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';

export default function SmartSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut to open search (CMD/CTRL + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    // Global listener for search trigger
    const handleOpenSearch = () => setIsOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openSearch', handleOpenSearch);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openSearch', handleOpenSearch);
    };
  }, []);

  // Fetch results when query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${query}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const suggestions = ['Deep Sea', 'Tourbillon', 'Rose Gold', 'Astronomica', 'Chronograph'];

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

              {query.length < 2 ? (
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 font-sans">Results for "{query}"</h3>
                    {loading && <div className="w-4 h-4 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>}
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {!loading && results.length === 0 ? (
                      <p className="text-white/30 text-sm italic py-4 text-center font-serif">No timepieces found matching your search.</p>
                    ) : (
                      results.map((product) => (
                        <Link 
                          key={product._id} 
                          to={`/product/${product._id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-luxury-charcoal rounded-md overflow-hidden">
                              <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                              <h4 className="font-serif text-white group-hover:text-luxury-gold transition-colors">{product.name}</h4>
                              <p className="text-[10px] uppercase tracking-widest text-white/40">{product.brand} • ₹{product.price?.toLocaleString()}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))
                    )}
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
