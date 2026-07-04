import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('You\'re subscribed! Welcome to Velora AI. 🎉');
    setEmail('');
  };

  return (
    <footer className="bg-[#040406] border-t border-[#1E1E24] text-slate-400 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* BRAND & LOGO */}
        <div className="md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-white bg-gradient-to-r from-white to-[#E2B53E] bg-clip-text text-transparent">
              Velora AI
            </span>
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            Intelligent Shopping. Personalized Choices. Powered by state-of-the-art Generative AI, guiding your product purchases.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#E2B53E] transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#E2B53E] transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#E2B53E] transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold text-white text-sm mb-4">Discover</h4>
          <ul className="space-y-3 text-xs">
            <li>
              <Link to="/categories?selected=all" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/chat" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                AI Shopping Assistant
              </Link>
            </li>
            <li>
              <Link to="/compare" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Product Comparison
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Wishlist Storage
              </Link>
            </li>
          </ul>
        </div>

        {/* CATEGORY DEEP LINKS */}
        <div>
          <h4 className="font-semibold text-white text-sm mb-4">Popular Spheres</h4>
          <ul className="space-y-3 text-xs">
            <li>
              <Link to="/categories?selected=phones" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Smartphones
              </Link>
            </li>
            <li>
              <Link to="/categories?selected=laptops" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Premium Laptops
              </Link>
            </li>
            <li>
              <Link to="/categories?selected=headphones" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Audio Equipment
              </Link>
            </li>
            <li>
              <Link to="/categories?selected=home-appliances" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Smart Home Appliances
              </Link>
            </li>
            <li>
              <Link to="/categories?selected=gaming" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Gaming
              </Link>
            </li>
            <li>
              <Link to="/categories?selected=fashion" className="hover:text-[#E2B53E] transition-colors block py-0.5">
                Fashion
              </Link>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white text-sm mb-4">Join Velora</h4>
          <p className="text-xs text-slate-500">
            Subscribe to receive insights about cutting edge tech releases, deal reductions, and AI recommendations.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-1">
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#121216] text-white border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E2B53E] w-full"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs rounded-lg px-3 py-2 hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-[#1E1E24] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-600">
        <p>&copy; {new Date().getFullYear()} Velora AI. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for intelligent commerce.
        </p>
      </div>
    </footer>
  );
}
