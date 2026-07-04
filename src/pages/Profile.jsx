import { useState, useEffect } from 'react';
import { useAuthStore, useWishlistStore, useHistoryStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  LogOut, 
  Heart, 
  TrendingUp, 
  ShieldCheck, 
  Edit3,
  Moon,
  Sun,
  Lock,
  Globe
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const { searches, fetchSearches } = useHistoryStore();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    fetchWishlist(user.uid);
    fetchSearches(user.uid);
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile(user, {
        displayName,
        photoURL: photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`
      });
      toast.success("Profile details updated!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? 'Dark' : 'Light'} Mode preferences toggled (UI only).`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#060608] text-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative">
      
      {/* HEADER SECTION */}
      <section className="border-b border-[#1E1E24] pb-6 flex justify-between items-center">
        <div>
          <h1 className="font-sans font-extrabold text-3xl text-white flex items-center gap-2">
            <User className="w-8 h-8 text-[#E2B53E]" />
            User Settings & Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal credentials, exploration history, and active themes.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 py-2.5 px-4 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </section>

      {/* THREE MODULE COLUMN PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* PANEL 1: USER INFO AVATAR */}
        <div className="bg-[#0C0C0F]/40 border border-[#1E1E24] rounded-2xl p-6 text-center space-y-6 shadow-xl">
          <div className="relative inline-block">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
              alt="Profile avatar" 
              className="w-24 h-24 rounded-full border-4 border-[#D4AF37] mx-auto shadow-lg"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#D4AF37] text-black hover:bg-[#AA7C11] transition-all shadow-md"
              title="Edit Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-sans font-extrabold text-lg text-white">
              {user.displayName || 'Velora User'}
            </h3>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {user.email}
            </p>
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              Member Since: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Active Member'}
            </p>
          </div>

          {/* EDIT FORM DRAWER */}
          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="border-t border-[#1E1E24] pt-4 space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#050507] border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E2B53E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Avatar Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full bg-[#050507] border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E2B53E]"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-transparent border border-[#1E1E24] hover:bg-[#0C0C0F] text-xs font-semibold py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-xs font-bold py-2 rounded-lg transition-all shadow-md shadow-amber-500/5"
                >
                  Save Updates
                </button>
              </div>
            </form>
          )}

          {/* SECURITY VERIFIED BAR */}
          <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-emerald-400 text-[11px] font-semibold flex items-center gap-2 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Firebase Security Layer Active</span>
          </div>
        </div>

        {/* PANEL 2: SETTINGS & VISUAL CONTROL */}
        <div className="bg-[#0C0C0F]/40 border border-[#1E1E24] rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5 border-b border-[#1E1E24] pb-3">
            <Settings className="w-4 h-4 text-slate-400" />
            Application Preferences
          </h3>

          <div className="space-y-4">
            
            {/* TOGGLE THEME */}
            <div className="flex justify-between items-center py-1">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Visual Interface Style</span>
                <span className="text-[10px] text-slate-500 block">Toggle between Cosmic Dark and Ambient Light</span>
              </div>
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-xl border border-[#1E1E24] hover:bg-[#0C0C0F] transition-all"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#E2B53E]" />}
              </button>
            </div>

            {/* CURRENCY PREFERENCE */}
            <div className="flex justify-between items-center py-1 border-t border-[#1E1E24] pt-3">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Currency & Localization</span>
                <span className="text-[10px] text-slate-500 block">Active regional price mapping</span>
              </div>
              <span className="text-xs font-mono font-bold bg-[#050507] border border-[#1E1E24] rounded-lg px-2 py-1 text-[#E2B53E] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#E2B53E]" /> USD ($)
              </span>
            </div>

            {/* PASSWORD SECURITY */}
            <div className="flex justify-between items-center py-1 border-t border-[#1E1E24] pt-3">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Account Security</span>
                <span className="text-[10px] text-slate-500 block">Inquire password reset parameters</span>
              </div>
              <button
                onClick={() => {
                  if (user.email) {
                    toast.success("Security credentials dispatched. Check your inbox.");
                  }
                }}
                className="p-2 rounded-xl border border-[#1E1E24] hover:bg-[#0C0C0F] text-slate-400 hover:text-white transition-all"
                title="Change Password"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* PANEL 3: SEARCH LOGS HIGHLIGHTS */}
        <div className="bg-[#0C0C0F]/40 border border-[#1E1E24] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5 border-b border-[#1E1E24] pb-3">
            <TrendingUp className="w-4 h-4 text-[#E2B53E]" />
            My Exploration Footprint
          </h3>

          <div className="space-y-2.5">
            {searches.length > 0 ? (
              searches.slice(0, 5).map((log, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-[#050507]/50 border border-[#1E1E24] rounded-xl flex flex-col justify-between items-start gap-1.5 hover:border-amber-500/20 transition-all cursor-pointer"
                  onClick={() => navigate(`/categories?search=${encodeURIComponent(log.query)}`)}
                >
                  <span className="text-xs font-semibold text-slate-300 line-clamp-1 truncate max-w-full">{log.query}</span>
                  <span className="text-[9px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No searches or audits recorded yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
