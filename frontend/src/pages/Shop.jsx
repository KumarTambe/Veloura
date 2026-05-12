import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter / search state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹50,000', value: '0-50000' },
    { label: '₹50,000 – ₹100,000', value: '50000-100000' },
    { label: '₹100,000 – ₹200,000', value: '100000-200000' },
    { label: 'Over ₹200,000', value: '200000-' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedBrand) params.append('brand', selectedBrand);
        if (sort) params.append('sort', sort);
        if (priceRange) {
          const [min, max] = priceRange.split('-');
          if (min) params.append('minPrice', min);
          if (max) params.append('maxPrice', max);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
        if (data.categories) setCategories(data.categories);
        if (data.brands) setBrands(data.brands);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedCategory, selectedBrand, sort, priceRange]);

  const activeFiltersCount = [selectedCategory, selectedBrand, priceRange].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange('');
    setSearch('');
    setSort('newest');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-serif tracking-[0.3em] text-white mb-3">SHOP</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Explore the full Veloura collection</p>
        </motion.div>

        {/* Search + Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-b border-white/15 pb-3 pl-7 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-white/25"
            />
          </div>

          {/* Sort + Filter Toggle */}
          <div className="flex gap-4 items-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-b border-white/15 pb-3 text-[10px] uppercase tracking-[0.15em] text-white/60 outline-none cursor-pointer focus:border-white/40 transition-colors appearance-none pr-6"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}
            >
              <option value="newest" className="bg-black">Newest</option>
              <option value="price_asc" className="bg-black">Price: Low to High</option>
              <option value="price_desc" className="bg-black">Price: High to Low</option>
              <option value="name_asc" className="bg-black">Name: A to Z</option>
              <option value="name_desc" className="bg-black">Name: Z to A</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`text-[10px] uppercase tracking-[0.15em] pb-3 border-b transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'text-luxury-gold border-luxury-gold/30'
                  : 'text-white/50 border-white/15 hover:text-white hover:border-white/40'
              }`}
            >
              Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-10"
            >
              <div className="border border-white/10 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-4">Category</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border transition-all ${
                        !selectedCategory ? 'border-luxury-gold/50 text-luxury-gold bg-luxury-gold/5' : 'border-white/10 text-white/40 hover:border-white/20'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                        className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border transition-all ${
                          selectedCategory === cat ? 'border-luxury-gold/50 text-luxury-gold bg-luxury-gold/5' : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-4">Brand</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedBrand('')}
                      className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border transition-all ${
                        !selectedBrand ? 'border-luxury-gold/50 text-luxury-gold bg-luxury-gold/5' : 'border-white/10 text-white/40 hover:border-white/20'
                      }`}
                    >
                      All
                    </button>
                    {brands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                        className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border transition-all ${
                          selectedBrand === b ? 'border-luxury-gold/50 text-luxury-gold bg-luxury-gold/5' : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-4">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setPriceRange(priceRange === range.value ? '' : range.value)}
                        className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border transition-all ${
                          priceRange === range.value ? 'border-luxury-gold/50 text-luxury-gold bg-luxury-gold/5' : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="sm:col-span-3 pt-2">
                    <button onClick={clearFilters} className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white border-b border-transparent hover:border-white/30 transition-colors">
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            {loading ? 'Loading...' : `${products.length} timepiece${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Loading collection...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-32 gap-6">
            <p className="text-sm text-white/40 font-serif italic">No watches match your criteria.</p>
            <button onClick={clearFilters} className="text-[10px] uppercase tracking-[0.3em] text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="w-full aspect-[3/4] bg-luxury-charcoal overflow-hidden mb-5 relative">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : ''}
                      alt={product.name}
                      className="w-full h-full object-cover object-center opacity-75 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    />
                    {/* Category badge */}
                    <span className="absolute top-4 left-4 text-[8px] uppercase tracking-[0.2em] text-white/50 bg-black/40 backdrop-blur-sm px-2 py-1">
                      {product.category}
                    </span>
                  </div>
                </Link>

                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 mr-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-sm font-serif text-white mb-1 tracking-wide hover:text-white/70 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-white/30">{product.brand}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <p className="text-xs text-white/70 font-mono tracking-wider mb-2">
                      ₹{product.price?.toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="text-[8px] uppercase tracking-[0.2em] text-white/30 hover:text-white border-b border-transparent hover:border-white/30 transition-colors pb-0.5 cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
