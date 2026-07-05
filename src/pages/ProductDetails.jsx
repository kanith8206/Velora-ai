import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useProductStore, useWishlistStore } from '../store';
import { 
  Heart, 
  GitCompare, 
  Star, 
  ArrowLeft, 
  Check, 
  X, 
  Tag, 
  Cpu, 
  Bookmark, 
  ShieldAlert, 
  Package, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { PRODUCTS } from '../productsData';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user } = useAuthStore();
  const { selectedProduct, fetchProductById, addToComparison, comparisonList, removeFromComparison } = useProductStore();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      fetchProductById(id).then(res => {
        if (res) {
          setProduct(res);
        } else {
          // If not found, try search in local constants
          const found = PRODUCTS.find(p => p.id === id);
          if (found) setProduct(found);
        }
      });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4 text-white bg-[#060608]">
        <div className="w-8 h-8 border-2 border-[#E2B53E] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading comprehensive hardware specs...</p>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const isComparing = comparisonList.some(p => p.id === product.id);

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (isSaved) {
      removeFromWishlist(user.uid, product.id);
    } else {
      addToWishlist(user.uid, product);
    }
  };

  const handleCompareToggle = () => {
    if (isComparing) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const discountedPrice = product.discount > 0 
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  // Curate related products from the same category
  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#060608] text-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to explore
      </button>

      {/* CORE INFO SUMMARY GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* PRODUCT GALLERY */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#1E1E24] bg-[#0C0C0F] shadow-xl">
            <img 
              src={product.image || 'https://wsrv.nl/?url=https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'} 
              alt={product.name} 
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                e.target.src = 'https://wsrv.nl/?url=https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
              }}
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-[11px] font-bold px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                -{product.discount}% Discount Active
              </span>
            )}
          </div>
        </div>

        {/* DETAILS BLOCK */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#E2B53E] uppercase tracking-widest">{product.brand}</span>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white leading-tight">
              {product.name}
            </h1>
            
            {/* RATINGS HEADER */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-slate-200 ml-1">{product.rating}</span>
              </div>
              <span className="text-slate-500">&bull;</span>
              <span>({product.reviewCount} customer evaluations)</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-emerald-400 font-semibold">{product.availability}</span>
            </div>
          </div>

          {/* PRICING BLOCK */}
          <div className="p-4 bg-[#0C0C0F]/40 border border-[#1E1E24] rounded-2xl flex items-center justify-between">
            <div>
              {product.discount > 0 && (
                <span className="text-xs text-slate-500 line-through block mb-0.5">
                  Regular Price: ${product.price}
                </span>
              )}
              <span className="text-2xl font-black text-white">
                ${discountedPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-xl border transition-all ${
                  isSaved
                    ? 'bg-rose-500 border-rose-500 text-white scale-105'
                    : 'bg-[#050507] border-[#1E1E24] text-slate-300 hover:text-rose-400 hover:bg-[#0C0C0F]'
                }`}
                title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={handleCompareToggle}
                className={`p-3 rounded-xl border transition-all ${
                  isComparing
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black border-transparent scale-105 font-bold'
                    : 'bg-[#050507] border-[#1E1E24] text-slate-300 hover:text-[#E2B53E] hover:bg-[#0C0C0F]'
                }`}
                title={isComparing ? "Remove from comparison" : "Compare this product"}
              >
                <GitCompare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {product.description}
          </p>

          {/* KEY FEATURES BULLETS */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Top Selling Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex gap-2 items-center text-xs text-slate-300">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DIRECT ACTION TRIGGERS */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/chat?prompt=Please analyze ${product.name} and explain how it compares to others in its budget category.`)}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black py-4 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/5 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 animate-spin text-black" style={{ animationDuration: '3s' }} />
              Audit specifications with AI
            </button>
            <button
              onClick={() => toast.success("Feature under construction! Add to Cart functionality is UI only.")}
              className="border border-[#1E1E24] bg-[#0C0C0F] hover:bg-[#121216]/80 text-[#E2B53E] py-4 px-6 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" /> Move to Cart
            </button>
          </div>
        </div>
      </section>

      {/* DETAILED TABS SECTION */}
      <section className="border-t border-[#1E1E24] pt-8 space-y-6">
        <div className="flex border-b border-[#1E1E24] gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-all ${
              activeTab === 'specs' 
                ? 'text-[#E2B53E] border-b-2 border-[#E2B53E]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('proscons')}
            className={`pb-3 transition-all ${
              activeTab === 'proscons' 
                ? 'text-[#E2B53E] border-b-2 border-[#E2B53E]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pros & Cons Audit
          </button>
          <button
            onClick={() => setActiveTab('accessories')}
            className={`pb-3 transition-all ${
              activeTab === 'accessories' 
                ? 'text-[#E2B53E] border-b-2 border-[#E2B53E]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seeded Accessories
          </button>
        </div>

        {/* TAB 1: TECHNICAL SPECS TABLE */}
        {activeTab === 'specs' && (
          <div className="bg-[#0C0C0F]/20 border border-[#1E1E24] rounded-2xl overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {Object.entries(product.specs).map(([specName, specVal], idx) => (
                    <tr key={idx} className="border-b border-[#1E1E24]/60 hover:bg-[#0C0C0F]/20">
                      <td className="py-3 px-4 font-bold text-slate-400 w-1/3">{specName}</td>
                      <td className="py-3 px-4 text-slate-200">{specVal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PROS & CONS */}
        {activeTab === 'proscons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
              <h3 className="font-sans font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                <Check className="w-5 h-5 text-emerald-400" />
                Key Advantages
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {product.pros.map((p, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 space-y-4">
              <h3 className="font-sans font-bold text-sm text-rose-400 flex items-center gap-1.5">
                <X className="w-5 h-5 text-rose-400" />
                Considerable Disadvantages
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {product.cons.map((c, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: SEEDED ACCESSORIES */}
        {activeTab === 'accessories' && (
          <div className="bg-[#0C0C0F]/20 border border-[#1E1E24] rounded-2xl p-6 space-y-4">
            <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
              <Package className="w-5 h-5 text-amber-500" />
              Compatible Ecosystem Accessories
            </h3>
            <p className="text-xs text-slate-400">Our shopping algorithms suggest pairing {product.name} with these essential companion products:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {product.accessories.map((acc, idx) => (
                <div key={idx} className="p-4 bg-[#0C0C0F] border border-[#1E1E24] rounded-xl flex flex-col justify-between items-start gap-3">
                  <span className="text-xs font-bold text-slate-200">{acc}</span>
                  <button 
                    onClick={() => navigate(`/chat?prompt=Tell me more about ${acc} as an accessory for ${product.name}`)}
                    className="text-[10px] font-bold text-[#E2B53E] hover:underline flex items-center gap-1"
                  >
                    AI description <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#1E1E24] pt-12 space-y-6">
          <h2 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            Related Curated Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
