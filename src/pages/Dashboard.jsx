import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useProductStore, useWishlistStore, useHistoryStore } from '../store';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  Heart, 
  Grid, 
  MessageSquare, 
  Compass, 
  GitCompare, 
  User,
  ArrowRight,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../productsData';
import ProductCard from '../components/ProductCard';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const { searches, fetchSearches } = useHistoryStore();
  const { products, fetchProducts } = useProductStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [greeting, setGreeting] = useState('Hello');

  // Load history and wishlist post auth
  useEffect(() => {
    if (user) {
      fetchWishlist(user.uid);
      fetchSearches(user.uid);
    }
    fetchProducts(); // Load general product lists
  }, [user]);

  // Set greeting based on time
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning');
    else if (hrs < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/categories?search=${encodeURIComponent(query)}`);
    }
  };

  // Curate trending & recommended from catalog
  const trendingProducts = PRODUCTS.slice(0, 3);
  const recommendedProducts = PRODUCTS.slice(3, 6);

  return (
    <div className="min-h-screen bg-[#060608] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative">
      {/* GLOW ATMOSPHERE */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#AA7C11]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER GREETING & CONTEXT */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E24] pb-6">
        <div>
          <h1 className="font-sans font-extrabold text-3xl tracking-tight text-white flex items-center gap-2">
            <span>{greeting}</span>
            {user && (
              <span className="bg-gradient-to-r from-white via-[#E2B53E] to-[#AA7C11] bg-clip-text text-transparent">
                , {user.displayName?.split(' ')[0]}
              </span>
            )}
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome to your intelligent commerce dashboard. What shall we explore today?
          </p>
        </div>

        {/* AI ACTION BANNER LINK */}
        <Link
          to="/chat"
          className="flex items-center gap-2 text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:opacity-90 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/5 transition-all self-start"
        >
          <Sparkles className="w-4 h-4 animate-spin text-black" style={{ animationDuration: '3s' }} />
          <span>Open AI Shopping Consultant</span>
        </Link>
      </section>

      {/* INSTANT QUICK SEARCH & RECENT QUERIES */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E2B53E]" />
            <input
              type="text"
              placeholder="Search phones, premium laptops, carbon chairs, books, styles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#0C0C0F] border border-[#1E1E24] rounded-2xl pl-12 pr-28 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E2B53E] transition-all shadow-lg shadow-black/10 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E2B53E] hover:to-[#B58916] text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              Analyze
            </button>
          </form>

          {/* QUICK CHAT SUGGESTION LINKS */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Suggested queries:</span>
            {[
              'Compare iPhone 15 vs S24 Ultra',
              'Back support chairs under $1500',
              'Best vacuum with laser detection',
              'Espresso machines for latte art'
            ].map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/chat?prompt=${encodeURIComponent(s)}`)}
                className="text-slate-300 hover:text-[#E2B53E] bg-[#0C0C0F]/60 hover:bg-[#121216] border border-[#1E1E24] rounded-lg px-2.5 py-1 text-[11px] transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* RECENT SEARCHES */}
        <div className="bg-[#0C0C0F]/40 border border-[#1E1E24] rounded-2xl p-4 space-y-3 shadow-md">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            Recent Searches
          </h3>
          {user ? (
            <div className="space-y-1.5">
              {searches.length > 0 ? (
                searches.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(`/categories?search=${encodeURIComponent(item.query)}`)}
                    className="flex justify-between items-center w-full text-left text-xs font-medium text-slate-300 hover:text-[#E2B53E] hover:bg-[#121216] px-3 py-2 rounded-lg transition-all"
                  >
                    <span className="truncate max-w-[180px]">{item.query}</span>
                    <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No recent searches recorded.</p>
              )}
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-xs text-slate-500">Sign in to sync search history.</p>
              <Link to="/auth" className="inline-block text-[10px] font-bold text-black bg-[#D4AF37] px-3 py-1.5 rounded-lg">
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* RECENT WISHLIST PREVIEW */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-500 fill-amber-500/10" />
            Your Saved Wishlist
          </h3>
          <Link to="/wishlist" className="text-xs text-[#E2B53E] hover:underline font-semibold">
            View full wishlist
          </Link>
        </div>

        {user ? (
          <div>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#1E1E24] rounded-2xl p-8 text-center space-y-4">
                <p className="text-sm text-slate-400">Your wishlist is currently empty.</p>
                <Link to="/categories" className="inline-flex items-center gap-1.5 bg-[#0C0C0F] border border-[#1E1E24] text-[#E2B53E] hover:text-white px-4 py-2 rounded-xl text-xs font-semibold">
                  Browse Catalog <ShoppingBag className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-[#1E1E24] bg-[#0C0C0F]/20 rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">Log in to build and persist your wishlist across devices.</p>
            <Link to="/auth" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-amber-500/5">
              Get Started <User className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="space-y-4">
        <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          Trending Products Right Now
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CATEGORIES GRID LINK SEEDS */}
      <section className="space-y-4 bg-[#040406] border border-[#1E1E24] p-6 sm:p-8 rounded-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2">
              <Grid className="w-5 h-5 text-amber-500" />
              Product Categories
            </h3>
            <p className="text-xs text-slate-400 mt-1">Explore specialized verticals designed for direct AI auditing.</p>
          </div>
          <Link to="/categories" className="text-xs text-[#E2B53E] hover:underline font-semibold flex items-center gap-1">
            See All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/categories?selected=${cat.id}`}
              className="p-4 rounded-xl bg-[#0C0C0F]/40 hover:bg-[#121216] border border-[#1E1E24] hover:border-[#AA7C11]/30 transition-all flex flex-col items-center text-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#AA7C11]/10 group-hover:bg-[#AA7C11] flex items-center justify-center transition-all">
                <Sparkles className="w-5 h-5 text-[#E2B53E] group-hover:text-black" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">{cat.name}</span>
                <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{cat.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS SECTION */}
      <section className="space-y-4">
        <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Recommended Picks for You
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
