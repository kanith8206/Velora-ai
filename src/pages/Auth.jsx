import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function Auth() {
  const { user, login, register, loginWithGoogle, loginAsGuest, resetPassword, error, loading } = useAuthStore();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState(null);

  // If user is already authenticated, redirect to /chat
  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Email address is required.");
      return;
    }

    try {
      if (mode === 'login') {
        if (!password) {
          setFormError("Password is required.");
          return;
        }
        await login(email, password);
      } else if (mode === 'register') {
        if (!name) {
          setFormError("Your full name is required.");
          return;
        }
        if (password.length < 6) {
          setFormError("Password must be at least 6 characters.");
          return;
        }
        await register(email, password, name);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMode('login');
      }
    } catch (err) {
      // Handled by store and toast
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      // Handled
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden bg-[#060608]">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#AA7C11]/3 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* LOGO TITLE */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] items-center justify-center shadow-lg shadow-amber-500/10 mb-4">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h2 className="font-sans font-extrabold text-2xl tracking-tight text-white">
            {mode === 'login' && "Welcome back to Velora"}
            {mode === 'register' && "Create your Velora ID"}
            {mode === 'forgot' && "Reset your password"}
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            {mode === 'login' && "Sign in to access your chat history and wishlist"}
            {mode === 'register' && "Begin your personal intelligence-driven shopping loop"}
            {mode === 'forgot' && "Enter your email, and we will send a password reset link"}
          </p>
        </div>

        {/* GLASSMORPHIC CONTAINER */}
        <div className="bg-[#0C0C0F]/40 backdrop-blur-md border border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ERRORS */}
            <AnimatePresence mode="wait">
              {(formError || error) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex gap-2 items-center"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{formError || error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NAME FIELD (REGISTER ONLY) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#050507]/80 border border-[#1E1E24] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E2B53E] transition-all"
                  />
                </div>
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050507]/80 border border-[#1E1E24] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E2B53E] transition-all"
                />
              </div>
            </div>

            {/* PASSWORD FIELD (NOT FOR FORGOT PASSWORD) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-semibold text-[#E2B53E] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#050507]/80 border border-[#1E1E24] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E2B53E] transition-all"
                  />
                </div>
              </div>
            )}

            {/* REMEMBER ME (LOGIN ONLY) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#E2B53E] rounded border-[#1E1E24]"
                  />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            {/* CTA BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:opacity-95 text-black rounded-xl py-3 text-xs font-extrabold shadow-lg shadow-amber-500/5 transition-all flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' && "Sign In"}
                  {mode === 'register' && "Create Account"}
                  {mode === 'forgot' && "Send Reset Link"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          {mode !== 'forgot' && (
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#1E1E24]" />
              <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase">Or continue with</span>
              <div className="flex-grow border-t border-[#1E1E24]" />
            </div>
          )}

          {/* SOCIAL LOGIN */}
          {mode !== 'forgot' && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full border border-[#1E1E24] bg-[#050507]/40 hover:bg-[#0C0C0F] text-slate-200 hover:text-white rounded-xl py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.76 14.93 1 12 1 7.37 1 3.42 3.66 1.5 7.56l3.77 2.92C6.18 7.39 8.87 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.46c-.28 1.46-1.1 2.69-2.34 3.52l3.64 2.82c2.13-1.97 3.73-4.87 3.73-8.44z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.52a6.931 6.931 0 0 1 0-4.04L1.5 7.56a11.956 11.956 0 0 0 0 8.88l3.77-2.92z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.64-2.82c-1.11.74-2.53 1.18-4.32 1.18-3.13 0-5.82-2.35-6.73-5.44L1.5 16.36C3.42 20.34 7.37 23 12 23z"
                  />
                </svg>
                <span>Google authentication</span>
              </button>

              <button
                type="button"
                onClick={() => loginAsGuest()}
                disabled={loading}
                className="w-full border border-dashed border-[#D4AF37]/30 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 text-[#E2B53E] hover:text-white rounded-xl py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span>Continue as Guest (Instant Access)</span>
              </button>
            </div>
          )}

          {/* SWITCH CONTROLLER */}
          <div className="text-center text-xs text-slate-400">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-[#E2B53E] hover:underline"
                >
                  Register
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p>
                Already have a Velora ID?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#E2B53E] hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-[#E2B53E] hover:underline"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
