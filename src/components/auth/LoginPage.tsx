import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Zap, Users, BarChart3, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DemoAccount {
  email: string;
  password: string;
  role: string;
  name: string;
  color: string;
  icon: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'admin@event.id', password: 'admin123', role: 'Admin', name: 'Bima', color: 'from-rose-500 to-pink-600', icon: '👑' },
  { email: 'andi.ketua@event.id', password: 'manager123', role: 'Event Manager', name: 'Andi', color: 'from-indigo-500 to-violet-600', icon: '🎯' },
  { email: 'sarah.acara@event.id', password: 'coord123', role: 'Koordinator', name: 'Sarah', color: 'from-emerald-500 to-teal-600', icon: '📋' },
  { email: 'maya.staff@event.id', password: 'member123', role: 'Member', name: 'Maya', color: 'from-amber-500 to-orange-600', icon: '⚡' },
];

const FEATURES = [
  { icon: <Zap className="w-5 h-5" />, title: 'Manajemen Tugas Real-time', desc: 'Pantau progres setiap tugas panitia secara langsung' },
  { icon: <Users className="w-5 h-5" />, title: 'Koordinasi Multi-Divisi', desc: 'Kelola ratusan anggota dari berbagai divisi sekaligus' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Laporan & Analitik', desc: 'Dashboard insight mendalam untuk pengambilan keputusan' },
];

export const LoginPage: React.FC = () => {
  const { login, setAuthPage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email wajib diisi.'); return; }
    if (!password) { setError('Password wajib diisi.'); return; }

    setIsLoading(true);
    // Simulate async
    await new Promise(r => setTimeout(r, 600));
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Login gagal.');
    }
  };

  const handleDemoLogin = async (account: DemoAccount) => {
    setError('');
    setEmail(account.email);
    setPassword(account.password);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await login(account.email, account.password);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Login gagal.');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-violet-500/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        </div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-white font-black text-lg tracking-tight">E</span>
          </div>
          <div>
            <span className="text-white font-black text-2xl tracking-tight">E-vent</span>
            <span className="block text-indigo-300 text-xs font-medium -mt-0.5">Sistem Manajemen Kepanitiaan</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-indigo-200 text-xs font-semibold tracking-wide uppercase">Platform #1 Kepanitiaan</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] tracking-tight">
              Koordinasi Event <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                Lebih Cerdas.
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              Kelola seluruh kepanitiaan—tugas, divisi, timeline, hingga laporan—dalam satu platform yang mulus dan modern.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map((feat, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-indigo-300 group-hover:bg-white/15 transition-colors">
                  {feat.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{feat.title}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex items-center gap-8 pt-6 border-t border-white/10">
          {[
            { val: '500+', label: 'Panitia Aktif' },
            { val: '120+', label: 'Event Terkelola' },
            { val: '98%', label: 'Kepuasan Tim' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-white font-black text-2xl">{stat.val}</p>
              <p className="text-slate-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="text-slate-900 font-black text-xl tracking-tight">E-vent</span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Selamat datang kembali 👋</h2>
            <p className="text-slate-500 text-sm">Masuk untuk melanjutkan ke dashboard kepanitiaan Anda.</p>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>Akun Demo — Klik untuk masuk langsung</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  id={`demo-login-${acc.role.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => handleDemoLogin(acc)}
                  disabled={isLoading}
                  className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-sm flex-shrink-0 shadow-sm`}>
                    {acc.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{acc.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{acc.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">atau masuk manual</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Login Form */}
          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="nama@event.id"
                  className="clay-input w-full pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Masukkan password"
                  className="clay-input w-full pl-10 pr-11 py-3 text-sm"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 animate-fadeIn">
                <span className="text-rose-500 text-sm">⚠</span>
                <p className="text-rose-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="clay-btn clay-btn-primary w-full py-3 text-sm gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Masuk...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <button
              id="go-to-register"
              onClick={() => setAuthPage('register')}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Daftar sekarang
            </button>
          </p>

          {/* Demo Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1">
            <p className="text-amber-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Password Demo
            </p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Admin: <code className="bg-amber-100 px-1 rounded">admin123</code> · Manager: <code className="bg-amber-100 px-1 rounded">manager123</code> · Koordinator: <code className="bg-amber-100 px-1 rounded">coord123</code> · Member: <code className="bg-amber-100 px-1 rounded">member123</code>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
};
