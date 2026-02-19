import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, Linkedin, ArrowRight, Eye, EyeOff, Shield, Zap, Users } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthMode = 'login' | 'signup';

interface LoginProps {
  onLogin?: (user: { email: string; name: string; avatar?: string; provider: string }) => void;
}

// ─── Google OAuth Handler ─────────────────────────────────────────────────────
// In production: use Firebase Auth or Google Identity Services
// Setup: https://console.firebase.google.com → Authentication → Google
const handleGoogleAuth = () => {
  // Replace with: signInWithPopup(auth, googleProvider) from Firebase
  // OR: use @react-oauth/google library
  alert('Connect Firebase:\nnpm install firebase\nThen add your firebaseConfig from Firebase Console → Project Settings');
};

// ─── LinkedIn OAuth Handler ───────────────────────────────────────────────────
// Setup: https://www.linkedin.com/developers/apps → create app → get client_id
const handleLinkedInAuth = () => {
  const CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
  const REDIRECT_URI = encodeURIComponent(window.location.origin + '/auth/linkedin/callback');
  const SCOPE = encodeURIComponent('openid profile email');
  const STATE = Math.random().toString(36).substring(7);
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}`;
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { icon: Users, value: '10,000+', label: 'Students guided' },
  { icon: Zap,   value: '500+',    label: 'Career paths mapped' },
  { icon: Shield, value: '95%',    label: 'Satisfaction rate' },
];

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode]               = useState<AuthMode>('login');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    // Simulate auth — replace with Firebase:
    // import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onLogin?.({ email, name: email.split('@')[0], provider: 'email' });
  };

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)',
        }}
      >
        {/* Background orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }} />
        <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">LakshyaSetu AI</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Your career journey<br />
              <span style={{ color: '#fbbf24' }}>starts here.</span>
            </h1>
            <p className="text-indigo-200 text-base leading-relaxed mb-8">
              Personalised AI guidance for every student — whether you're aiming for IIT or finding your first job after 10th grade.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.3)' }}>
                  <stat.icon className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-none">{stat.value}</div>
                  <div className="text-indigo-300 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-indigo-400 text-xs relative z-10">
          © 2026 LakshyaSetu AI · Made with ❤️ for India
        </p>
      </motion.div>

      {/* ── Right Panel (Form) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">LakshyaSetu AI</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {mode === 'login'
                ? 'Sign in to continue your career journey'
                : 'Join thousands of students finding their path'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
            >
              {error}
            </motion.div>
          )}

          {/* Social Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-all duration-200 text-sm font-medium text-foreground group"
            >
              {/* Google SVG icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleLinkedInAuth}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium text-white group"
              style={{ background: '#0A66C2', borderColor: '#0A66C2' }}
            >
              <Linkedin className="w-5 h-5" />
              Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-input border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Please wait…</>
                : <>{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms</a> &{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
