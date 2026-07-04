import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useProductStore, useWishlistStore } from '../store';
import { 
  Sparkles, 
  Heart, 
  GitCompare, 
  User, 
  Menu, 
  X, 
  LogOut, 
  MessageSquare, 
  Compass,
  Grid
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { comparisonList } = useProductStore();
  const { wishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Discover', path: '/categories', icon: Grid },
    { name: 'AI Expert Chat', path: '/chat', icon: MessageSquare },
    { name: 'Compare', path: '/compare', icon: GitCompare, badge: comparisonList.length },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlist.length },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#070709]/90 backdrop-blur-md border-b border-[#1E1E24] px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-black animate-pulse" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white via-[#E2B53E] to-[#AA7C11] bg-clip-text text-transparent">
              Velora AI
            </span>
            <span className="hidden sm:block text-[10px] text-amber-500/75 font-mono tracking-widest uppercase">
              Shopping Assistant
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 text-sm font-medium transition-all py-2 px-3 rounded-lg border ${
                  active 
                    ? 'text-[#E2B53E] bg-[#121216] border-[#AA7C11]/30 shadow-inner' 
                    : 'text-slate-300 border-transparent hover:text-[#E2B53E] hover:bg-[#121216]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#E2B53E]' : ''}`} />
                <span>{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#E2B53E] text-[10px] font-bold text-black shadow-md animate-bounce">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* PROFILE / AUTHENTICATION */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/profile" 
                className={`flex items-center gap-2 py-1.5 px-3 rounded-lg border transition-all ${
                  isActive('/profile') 
                    ? 'bg-[#121216] border-[#AA7C11]/40 text-[#E2B53E]' 
                    : 'border-[#1E1E24] hover:bg-[#121216] hover:border-[#AA7C11]/20 text-slate-200'
                }`}
              >
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-full border border-[#E2B53E]/50"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-medium max-w-[100px] truncate">
                  {user.displayName || 'Profile'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#1E1E24] transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 text-sm font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E2B53E] hover:to-[#B58916] px-5 py-2 rounded-xl shadow-lg shadow-amber-500/10 transition-all"
            >
              <User className="w-4 h-4" />
              Get Started
            </Link>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-[#E2B53E] hover:bg-[#1E1E24] transition-all"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#1E1E24] flex flex-col gap-2 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium ${
                  active 
                    ? 'text-[#E2B53E] bg-[#121216] border border-[#AA7C11]/20' 
                    : 'text-slate-300 hover:text-[#E2B53E] hover:bg-[#121216]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E2B53E] text-[10px] font-bold text-black">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="border-t border-[#1E1E24] my-2 pt-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 px-3 text-slate-300 hover:text-[#E2B53E]"
                >
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-[#E2B53E]/50"
                    referrerPolicy="no-referrer"
                  />
                  <span>{user.displayName || 'My Profile'}</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 py-2 px-3 text-rose-400 hover:text-rose-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold rounded-xl text-sm text-center"
              >
                <User className="w-4 h-4" />
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
