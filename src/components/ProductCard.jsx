import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useWishlistStore, useProductStore } from '../store';
import { Heart, GitCompare, Eye, Star, CheckCircle, AlertTriangle, XCircle, Sparkles, Flame, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

// Category fallback images — always-working Unsplash URLs
const CATEGORY_FALLBACKS = {
  phones:           'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
  laptops:          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
  tablets:          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
  headphones:       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  gaming:           'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&auto=format&fit=crop&q=80',
  'home-appliances':'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
  books:            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
  fashion:          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  beauty:           'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
  furniture:        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  kitchen:          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
  sports:           'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
  travel:           'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&auto=format&fit=crop&q=80',
  default:          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
};

function ProductImage({ src, alt, category }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef(null);

  const fallback = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;
  const imgSrc = errored ? fallback : (src || fallback);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [imgSrc]);

  return (
    <div className="relative w-full h-full bg-[#050507] overflow-hidden">
      {/* Skeleton loader overlay */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0F] via-[#1a1a20] to-[#0C0C0F] animate-pulse z-10" />
      )}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setErrored(true); setLoaded(true); }}
        className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 relative z-0"
      />
    </div>
  );
}

export default function ProductCard({ product }) {
  const { user } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { comparisonList, addToComparison, removeFromComparison } = useProductStore();
  const navigate = useNavigate();

  const isSaved = isInWishlist(product.id);
  const isComparing = comparisonList.some(p => p.id === product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to save products.'); navigate('/auth'); return; }
    isSaved ? removeFromWishlist(user.uid, product.id) : addToWishlist(user.uid, product);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isComparing ? removeFromComparison(product.id) : addToComparison(product);
  };

  const renderAvailability = () => {
    if (product.availability === 'In Stock')
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"><CheckCircle className="w-2.5 h-2.5" /> In Stock</span>;
    if (product.availability === 'Low Stock')
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full"><AlertTriangle className="w-2.5 h-2.5" /> Low Stock</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full"><XCircle className="w-2.5 h-2.5" /> Out of Stock</span>;
  };

  const discountedPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', isolation: 'isolate' }}
      className="relative flex flex-col bg-[#0C0C0F] border border-[#1E1E24] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 hover:border-[#AA7C11]/30 group h-full transition-all duration-300"
    >
      {/* IMAGE AREA — fixed consistent size */}
      <div className="relative overflow-hidden bg-[#050507]"
        style={{ height: '220px' }}
      >
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none z-10">
            {product.discount > 0 && (
              <span className="bg-amber-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
                -{product.discount}% OFF
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5" /> Best Seller
              </span>
            )}
            {product.trending && (
              <span className="bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 fill-current" /> Trending
              </span>
            )}
            {product.newArrival && (
              <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> New
              </span>
            )}
          </div>

          {/* AI SCORE */}
          {product.aiScore && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#0C0C0F]/95 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg z-10">
              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400/20" />
              <span>AI Match: {product.aiScore}%</span>
            </div>
          )}
        </Link>

        {/* ACTION BUTTONS */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button
            onClick={handleWishlistClick}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border backdrop-blur-md transition-all shadow-md ${
              isSaved ? 'bg-amber-500 border-amber-500 text-black scale-110' : 'bg-[#050507]/80 border-[#1E1E24] text-slate-300 hover:text-amber-400 hover:bg-[#121216]'
            }`}
            title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
          </button>
          <button
            onClick={handleCompareClick}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border backdrop-blur-md transition-all shadow-md ${
              isComparing ? 'bg-amber-400 border-amber-400 text-black scale-110' : 'bg-[#050507]/80 border-[#1E1E24] text-slate-300 hover:text-amber-400 hover:bg-[#121216]'
            }`}
            title={isComparing ? 'Remove from Comparison' : 'Add to Comparison'}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow space-y-2.5">
        {/* BRAND & AVAILABILITY */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono text-[#E2B53E] uppercase tracking-widest font-semibold truncate max-w-[60%]">
            {product.brand}
          </span>
          {renderAvailability()}
        </div>

        {/* NAME */}
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h4 className="font-sans font-bold text-sm text-slate-100 group-hover:text-[#E2B53E] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h4>
        </Link>

        {/* RATING */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold text-slate-200 ml-1">{product.rating}</span>
          </div>
          <span className="text-slate-500">&bull;</span>
          <span>({product.reviewCount} reviews)</span>
        </div>

        {/* KEY FEATURES */}
        <div className="flex flex-wrap gap-1">
          {product.keyFeatures.slice(0, 2).map((feature, idx) => (
            <span key={idx} className="text-[10px] bg-[#121216] border border-[#1E1E24] text-slate-400 px-2 py-0.5 rounded-md truncate max-w-full">
              {feature}
            </span>
          ))}
        </div>

        {/* PRICE & CTA */}
        <div className="border-t border-[#1E1E24] pt-3 mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-xs text-slate-500 line-through">${product.price}</span>
            )}
            <span className="text-base font-extrabold text-white">
              ${discountedPrice.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-[10px] text-emerald-400 font-semibold">Save {product.discount}%</span>
            )}
          </div>
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#1E1E24] hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#AA7C11] hover:text-black hover:border-transparent px-3.5 py-2 rounded-xl transition-all border border-[#27272a]"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
