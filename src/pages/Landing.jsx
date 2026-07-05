import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  Layers, 
  Cpu, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  BadgeCheck, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES } from '../productsData';

export default function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: 'Contextual Dialogue',
      desc: 'Instead of dry search input, tell Velora your country, purpose, brand goals, and specific budget parameters.',
      icon: BrainCircuit,
      color: '#4F46E5'
    },
    {
      title: 'Deep Matrix Comparisons',
      desc: 'Ask to compare side-by-side. Get structured specifications, battery duration, and performance reviews in clear tables.',
      icon: Layers,
      color: '#7C3AED'
    },
    {
      title: 'Dynamic Product Seeding',
      desc: 'If a requested device is outside our catalog, our generative core constructs verified real-world specs dynamically.',
      icon: Cpu,
      color: '#06B6D4'
    }
  ];

  const faqs = [
    {
      q: 'How does Velora AI choose recommendations?',
      a: 'Velora uses advanced semantic logic powered by Google Gemini to analyze your budget, preferred brands, country, and specific usage requirements, mapping them onto detailed, verified specification tables.'
    },
    {
      q: 'Can I compare products that are not currently in stock?',
      a: 'Yes! Velora is capable of generating real-time comparison metrics for any consumer hardware or catalog item available globally, highlighting specifications, price points, and active pros/cons.'
    },
    {
      q: 'Is Supabase Authentication safe and secure?',
      a: 'Absolutely. All logins, accounts, and integrations are secured by Supabase Auth servers, meaning we never store or see your passwords directly.'
    },
    {
      q: 'Does it cost anything to use Velora?',
      a: 'No, Velora AI is completely free to explore, evaluate products, generate custom comparison matrices, and build wishlists.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-white relative overflow-hidden">
      {/* BACKGROUND DECORATIVE BLOBS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#AA7C11]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-[#E2B53E]/30 rounded-full blur-[150px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C0C0F] border border-[#1E1E24] text-xs font-semibold text-[#E2B53E] mb-6 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative AI-Powered Shopping Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight leading-tight mb-6"
        >
          Shop Smarter with{' '}
          <span className="bg-gradient-to-r from-white via-[#E2B53E] to-[#AA7C11] bg-clip-text text-transparent">
            Velora AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Get personalized product recommendations powered by Artificial Intelligence. Specify your budget, goals, and brands, and let Velora handle the audit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/chat"
            className="flex items-center gap-2 text-sm font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E2B53E] hover:to-[#B58916] px-8 py-4 rounded-xl shadow-lg shadow-amber-500/5 transition-all w-full sm:w-auto justify-center group font-bold"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/categories"
            className="flex items-center justify-center text-sm font-semibold text-slate-300 hover:text-white bg-[#0C0C0F] hover:bg-[#121216] border border-[#1E1E24] px-8 py-4 rounded-xl transition-all w-full sm:w-auto"
          >
            Explore Products
          </Link>
        </motion.div>
      </section>

      {/* CHAT PREVIEW CONTAINER */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto mb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-[#1E1E24] bg-[#0C0C0F]/60 backdrop-blur-sm p-4 sm:p-6 shadow-2xl relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
            Interactive Agent Preview
          </div>
          
          {/* HEADER WINDOW ACTIONS */}
          <div className="flex gap-1.5 mb-4">
            <span className="w-3 h-3 rounded-full bg-rose-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 justify-end">
              <div className="bg-[#121216] border border-[#AA7C11]/20 text-[#E2B53E] p-3.5 rounded-2xl rounded-tr-none text-xs sm:text-sm max-w-sm font-sans shadow-md">
                "Recommend the absolute best noise-canceling headphones for traveling. My budget is $400."
              </div>
              <img src="https://api.dicebear.com/7.x/initials/svg?seed=user" className="w-7 h-7 rounded-full border border-[#E2B53E]/20" alt="User avatar" />
            </div>

            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-black animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="bg-[#0C0C0F] border border-[#1E1E24] p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-md text-slate-300 shadow-md space-y-3">
                <p className="font-semibold text-white">Velora AI recommends:</p>
                <div className="p-3 bg-[#050507] border border-[#1E1E24] rounded-xl flex gap-3 items-center">
                  <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&q=80" className="w-12 h-12 object-cover rounded-lg border border-[#1E1E24]" alt="Sony WH-1000XM5" />
                  <div>
                    <h5 className="font-semibold text-white text-xs sm:text-sm">Sony WH-1000XM5 ANC</h5>
                    <p className="text-[11px] text-amber-500 font-semibold">$398 (Save 15%) &bull; Rating: 4.7 &bull; In Stock</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">"Why it matches: Fits exactly under your $400 limit, possesses the worlds most advanced travel frequency cancellation, and has 30 hours of battery duration."</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CORE FEATURES */}
      <section className="bg-[#040406] py-24 border-y border-[#1E1E24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white mb-4">
              Designed For Sophisticated Commerce
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
              Skip endless pages of sponsored reviews and misleading filters. Speak with an expert advisor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-[#0C0C0F]/60 border border-[#1E1E24] hover:border-[#AA7C11]/30 transition-all hover:translate-y-[-4px]"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feat.color}10` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: '#E2B53E' }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK EXPLORE CATEGORIES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-sans font-bold text-3xl text-white">Curated Verticals</h2>
            <p className="text-slate-400 text-sm mt-2">Explore our custom catalogs optimized for AI comparison.</p>
          </div>
          <Link to="/categories" className="flex items-center gap-1.5 text-xs font-semibold text-[#E2B53E] hover:underline">
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Link 
              key={cat.id} 
              to={`/categories?selected=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#1E1E24]"
            >
              <img 
                src={cat.image} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent flex flex-col justify-end p-4" />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="font-semibold text-white block text-sm sm:text-base">{cat.name}</span>
                <span className="text-[10px] text-slate-400 font-medium block max-w-[150px] truncate">{cat.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#040406]/60 py-24 border-t border-[#1E1E24]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-sans font-bold text-3xl text-white mb-16">The Discovery Loop</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* STEPS LOOP */}
            {[
              { num: '01', title: 'State Needs', desc: 'Detail your budget, preferred brands, country, and purpose in plain language.' },
              { num: '02', title: 'AI Analysis', desc: 'Velora scans catalogs and cross-references detailed technical specs.' },
              { num: '03', title: 'Top 5 Curated', desc: 'We deliver exactly 5 matching products, with detailed pros, cons, and winner tags.' },
              { num: '04', title: 'Decision Made', desc: 'Perform final specifications compare and add to your active Wishlist.' }
            ].map((step, idx) => (
              <div key={idx} className="space-y-4 relative">
                <div className="text-4xl font-extrabold bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent mb-2">
                  {step.num}
                </div>
                <h4 className="font-bold text-white text-base">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <HelpCircle className="w-10 h-10 text-[#E2B53E] mx-auto mb-4" />
          <h2 className="font-sans font-bold text-3xl text-white">Questions & Specifications</h2>
          <p className="text-slate-400 text-sm mt-2">Clear insights about our algorithms and integrations.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const open = activeFaq === i;
            return (
              <div 
                key={i} 
                className="rounded-xl border border-[#1E1E24] bg-[#0C0C0F]/30 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="flex items-center justify-between w-full p-5 text-left text-sm font-semibold text-white focus:outline-none hover:bg-[#121216]/40"
                >
                  <span>{faq.q}</span>
                  {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {open && (
                  <div className="p-5 border-t border-[#1E1E24] text-xs leading-relaxed text-slate-400 bg-[#050507]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-br from-[#D4AF37]/5 to-[#AA7C11]/5 border-t border-[#1E1E24] py-20 px-4 text-center font-sans">
        <div className="max-w-2xl mx-auto space-y-6">
          <BadgeCheck className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white">
            Ready to find your perfect product?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Create a secure account, explore our curated verticals, or open a live chat session to evaluate your purchasing goals now.
          </p>
          <div className="pt-4">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 text-sm font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:opacity-90 px-8 py-4 rounded-xl shadow-lg transition-all font-bold"
            >
              Launch Velora AI
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
