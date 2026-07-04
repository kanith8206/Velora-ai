import { useAuthStore, useWishlistStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ArrowLeft, 
  Share2, 
  ShoppingBag,
  Gift,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { user } = useAuthStore();
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    if (user) {
      removeFromWishlist(user.uid, id);
    }
  };

  const handleShare = () => {
    // Generate a unique URL or copy a sharing payload to clipboard
    const shareUrl = `${window.location.origin}/#/wishlist?sharedBy=${user?.uid || 'anonymous'}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Wishlist sharing URL copied to clipboard!");
  };

  const handleMoveToCart = () => {
    toast.success("Moving all items to checkout... (UI action placeholder)");
  };

  const totalValue = wishlist.reduce((acc, p) => {
    const discountedPrice = p.discount > 0 
      ? Math.round(p.price * (1 - p.discount / 100))
      : p.price;
    return acc + discountedPrice;
  }, 0);

  return (
    <div className="min-h-screen bg-[#060608] text-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative">
      
      {/* HEADER ROW */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1E1E24] pb-6">
        <div>
          <h1 className="font-sans font-extrabold text-3xl text-white flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#E2B53E] fill-[#E2B53E]/10" />
            My Wishlist Collection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and organize lists of your favorite devices. Synchronized directly to your profile.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white py-2.5 px-4 bg-[#0C0C0F] border border-[#1E1E24] rounded-xl transition-all"
            >
              <Share2 className="w-4 h-4 text-[#E2B53E]" /> Share Collection
            </button>
            <button
              onClick={handleMoveToCart}
              className="flex items-center gap-1.5 text-xs font-bold text-black py-2.5 px-5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:opacity-90 rounded-xl transition-all shadow-lg shadow-amber-500/5"
            >
              <ShoppingBag className="w-4 h-4" /> Move all to cart
            </button>
          </div>
        )}
      </section>

      {/* WISHLIST GRID OR EMPTY SCREEN */}
      {user ? (
        <div>
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* SAVED ITEMS GRID */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlist.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* ESTIMATED CHECKOUT TOTAL PANEL */}
              <div className="bg-[#0C0C0F]/40 border border-[#1E1E24] rounded-2xl p-6 space-y-5 shadow-xl md:sticky md:top-24">
                <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5 border-b border-[#1E1E24] pb-3">
                  <Gift className="w-4 h-4 text-[#E2B53E]" />
                  Estimated Order Summary
                </h3>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Total saved items:</span>
                    <span className="font-bold text-white">{wishlist.length} products</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Average product score:</span>
                    <span className="font-bold text-amber-400 flex items-center gap-0.5">
                      4.7 ★
                    </span>
                  </div>
                  <div className="border-t border-[#1E1E24] my-3 pt-3 flex justify-between items-center text-sm">
                    <span className="font-bold text-white">Estimated Subtotal:</span>
                    <span className="text-[#E2B53E] font-black text-lg">
                      ${totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleMoveToCart}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black rounded-xl py-3 text-xs font-bold transition-all shadow-md shadow-amber-500/5"
                  >
                    Proceed with Checkout Loop
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#1E1E24] rounded-2xl max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0C0C0F] border border-[#1E1E24] flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-[#E2B53E] animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-sans font-bold text-lg text-slate-300">Your wishlist is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Start auditing devices using our search interface or conversational shopping assistant, and click the heart icon on cards to save options.
                </p>
              </div>
              <Link
                to="/categories"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/5"
              >
                Browse Catalog
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* PROMPT SIGN IN */
        <div className="text-center py-24 border border-dashed border-[#1E1E24] bg-[#0C0C0F]/20 rounded-2xl max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0C0C0F] border border-[#1E1E24] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-slate-600" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-sans font-bold text-lg text-slate-300">Sign in to save wishlist items</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Create a secure Velora account to synchronize, share, and backup your product wishlist selections.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/5"
          >
            Get Started
          </Link>
        </div>
      )}

    </div>
  );
}
