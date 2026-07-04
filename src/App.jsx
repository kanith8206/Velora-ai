import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { Toaster } from 'react-hot-toast';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import Comparison from './pages/Comparison';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

export default function App() {
  const { initialize, loading, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] text-white flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#E2B53E] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-amber-500/75 font-medium font-mono uppercase tracking-widest animate-pulse">
          Booting Velora AI core
        </span>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#060608] flex flex-col text-slate-100 selection:bg-[#E2B53E]/30 selection:text-white">
        
        {/* TOAST NOTIFICATIONS */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0C0C0F',
              color: '#F8FAFC',
              border: '1px solid #1E1E24',
              fontSize: '13px',
              borderRadius: '12px'
            }
          }}
        />

        {/* TOP HEADER NAVIGATION */}
        <Navbar />

        {/* MAIN BODY PAGES ROW */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/compare" element={<Comparison />} />
            
            {/* PROTECTED AUTH-ONLY ROUTES */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/chat" 
              element={user ? <Chat /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/wishlist" 
              element={user ? <Wishlist /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile /> : <Navigate to="/auth" replace />} 
            />

            {/* FALLBACK REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* ROOT FOOTER SYSTEM */}
        <Footer />

      </div>
    </Router>
  );
}
