'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '../common/ThemeToggle';
import { Logo } from '../common/Logo';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call check for route testing
      setTimeout(() => {
        setLoading(false);
        router.push('/admin/dashboard');
      }, 1000);
    } catch (err) {
      setError('Invalid institutional credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      
      {/* Left Column - Institutional Branding & Imagery */}
      <div className="lg:col-span-6 hidden lg:flex flex-col justify-between p-12 bg-emerald-900/10 dark:bg-emerald-950/30 border-r border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="z-10">
          <Logo />
        </div>

        <div className="z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Secure Institutional Gateway
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
            Connected Academic & Student Operations.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Access your department workspace, faculty records, student management metrics, and smart attendance control securely.
          </p>
        </div>

        <div className="z-10 text-xs text-slate-500 dark:text-slate-400">
          © {year || 2026} CoreSight SIS. Authorized institutional personnel only.
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-20">
        <div className="flex justify-between items-center w-full">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8 my-auto py-12">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight">Institutional Sign-In</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your institutional credentials assigned by your campus administrator.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Institutional Email / ID
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <Link href="#" className="text-xs text-[#176B52] dark:text-[#81D3AD] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#176B52] hover:bg-[#125440] text-white font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need access? Contact your university IT or campus system administrator.
            </p>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <Link href="/" className="text-xs font-medium text-slate-500 hover:text-[#176B52] dark:hover:text-[#81D3AD] transition-colors">
            ← Back to CoreSight Home
          </Link>
        </div>
      </div>

    </div>
  );
}