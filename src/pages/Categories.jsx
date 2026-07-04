import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  Star, 
  Tag, 
  Check, 
  AlertCircle,
  Inbox,
  Sparkles,
  Search
} from 'lucide-react';
import { CATEGORIES } from '../productsData';
import ProductCard from '../components/ProductCard';

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCatId = searchParams.get('selected') || 'all';
  const searchParamQuery = searchParams.get('search') || '';

  const { products, loading, fetchProducts, searchQuery, setSearchQuery, filter, setFilter, resetFilters } = useProductStore();

  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('ai-score');
  const [displayLimit, setDisplayLimit] = useState(12);

  // Trigger loading products on query parameters
  useEffect(() => {
    const activeFilters = {};
    if (selectedCatId !== 'all') {
      activeFilters.category = selectedCatId;
    }
    if (maxPrice < 2000) {
      activeFilters.maxPrice = maxPrice;
    }
    if (minRating > 0) {
      activeFilters.rating = minRating;
    }
    if (selectedBrand !== 'all') {
      activeFilters.brand = selectedBrand;
    }

    if (searchParamQuery && !searchQuery) {
      setSearchQuery(searchParamQuery);
    } else {
      fetchProducts(activeFilters);
    }
  }, [selectedCatId, maxPrice, minRating, selectedBrand, searchParamQuery]);

  // Reset display limit when any filter parameters change
  useEffect(() => {
    setDisplayLimit(12);
  }, [selectedCatId, maxPrice, minRating, selectedBrand, searchQuery, selectedAvailability, sortBy]);

  const handleCategorySelect = (id) => {
    setSearchParams({ selected: id });
  };

  const handleReset = () => {
    setMaxPrice(2000);
    setMinRating(0);
    setSelectedBrand('all');
    setSelectedAvailability('all');
    setSortBy('ai-score');
    resetFilters();
    setSearchParams({ selected: 'all' });
  };

  // Extract unique brands from active products catalog for filtering dropdown list
  const allBrands = ['all', ...Array.from(new Set(products.map(p => p.brand)))];

  // Client-side availability filter and sorting
  const processedProducts = products
    .filter((p) => {
      if (selectedAvailability === 'all') return true;
      return p.availability === selectedAvailability;
    })
    .sort((a, b) => {
      const priceA = a.discount > 0 ? Math.round(a.price * (1 - a.discount / 100)) : a.price;
      const priceB = b.discount > 0 ? Math.round(b.price * (1 - b.discount / 100)) : b.price;

      if (sortBy === 'ai-score') {
        return (b.aiScore || 0) - (a.aiScore || 0);
      }
      if (sortBy === 'price-asc') {
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      return 0;
    });

  const displayedProducts = processedProducts.slice(0, displayLimit);

  return (
    <div className="min-h-screen bg-[#060608] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative">
      {/* HEADER HERO */}
      <section className="text-center space-y-3 pb-4">
        <h1 className="font-sans font-extrabold text-3xl tracking-tight text-white">
          Explore Curated Products
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Audit our catalog of premium smart devices, luxury furniture, and athletic recovery gears curated for AI review.
        </p>
      </section>

      {/* QUICK CATEGORY CHIP LIST SLIDER */}
      <section className="flex flex-wrap justify-center items-center gap-2 pb-2">
        <button
          onClick={() => handleCategorySelect('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
            selectedCatId === 'all'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold border-transparent'
              : 'bg-[#0C0C0F] text-slate-300 hover:text-[#E2B53E] border border-[#1E1E24] hover:bg-[#121216]/60'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
              selectedCatId === cat.id
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold border-transparent'
                : 'bg-[#0C0C0F] text-slate-300 hover:text-[#E2B53E] border border-[#1E1E24] hover:bg-[#121216]/60'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </section>

      {/* FILTER PANEL AND GRID CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT FILTERS CARD */}
        <div className="bg-[#0C0C0F]/60 border border-[#1E1E24] rounded-2xl p-5 space-y-6 shadow-xl lg:sticky lg:top-24">
          <div className="flex justify-between items-center border-b border-[#1E1E24] pb-3">
            <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#E2B53E]" />
              Filters
            </h3>
            <button
              onClick={handleReset}
              className="text-[10px] font-bold text-[#E2B53E] hover:text-[#AA7C11] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* SEARCH BOX */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Keyword search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2B53E]" />
              <input
                type="text"
                placeholder="Type brand, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050507]/80 border border-[#1E1E24] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E2B53E]"
              />
            </div>
          </div>

          {/* PRICE FILTER */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Max Price</span>
              <span className="text-amber-500 font-bold">${maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#050507] rounded-lg appearance-none cursor-pointer accent-[#E2B53E]"
            />
          </div>

          {/* BRAND FILTER */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Brand Preference</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E2B53E] capitalize"
            >
              {allBrands.map((b) => (
                <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>
              ))}
            </select>
          </div>

          {/* AVAILABILITY FILTER */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Stock Status</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E2B53E] capitalize"
            >
              <option value="all">All Availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* RATING FILTER */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Minimum Rating</label>
            <div className="flex gap-1.5">
              {[4.5, 4.6, 4.7, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    minRating === rating
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-[#050507] border-[#1E1E24] text-slate-400 hover:text-white hover:border-[#AA7C11]/40'
                  }`}
                >
                  <span className="flex items-center justify-center gap-0.5">
                    {rating}<Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI ADVICE BUTTON */}
          <div className="pt-2">
            <button
              onClick={() => navigate(`/chat?prompt=Please recommend some products in ${selectedCatId !== 'all' ? selectedCatId : 'general'}`)}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold hover:opacity-90 rounded-xl py-3 text-xs transition-all shadow-md flex items-center justify-center gap-1.5 shadow-amber-500/5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Speak with AI Companion
            </button>
          </div>
        </div>

        {/* RIGHT PRODUCTS LIST GRID */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#0C0C0F]/40 px-4 py-3 border border-[#1E1E24] rounded-xl text-xs gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span>Showing <span className="font-extrabold text-[#E2B53E]">{processedProducts.length}</span> luxury matches</span>
              {selectedCatId !== 'all' && (
                <span className="bg-[#E2B53E]/10 text-[#E2B53E] border border-[#E2B53E]/20 font-semibold font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
                  {CATEGORIES.find(c => c.id === selectedCatId)?.name || selectedCatId}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#050507] border border-[#1E1E24] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E2B53E] cursor-pointer"
              >
                <option value="ai-score">AI Match Score</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Popularity</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-[#0C0C0F] border border-[#1E1E24] h-[380px] rounded-2xl animate-pulse space-y-4 p-4">
                  <div className="bg-[#050507] aspect-square rounded-xl" />
                  <div className="h-4 bg-[#050507] rounded w-3/4" />
                  <div className="h-4 bg-[#050507] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {processedProducts.length > displayLimit && (
                <div className="flex justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDisplayLimit(prev => prev + 12)}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    Load More Products ({processedProducts.length - displayLimit} remaining)
                  </motion.button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-[#1E1E24] rounded-2xl space-y-4">
              <Inbox className="w-12 h-12 text-slate-500 mx-auto" />
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-300">No matching products found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some filter preferences, adjusting max budget bounds, or speaking with our AI expert.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="bg-[#0C0C0F] text-slate-300 hover:text-white border border-[#1E1E24] rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
