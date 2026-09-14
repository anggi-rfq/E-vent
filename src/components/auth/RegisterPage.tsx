import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleOption {
  value: UserRole;
  label: string;
  desc: string;
  icon: string;
  color: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'MEMBER', label: 'Member', desc: 'Anggota panitia biasa, akses tugas sendiri', icon: '⚡', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { value: 'COORDINATOR', label: 'Koordinator', desc: 'Kelola divisi dan tugas tim', icon: '📋', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { value: 'EVENT_MANAGER', label: 'Event Manager', desc: 'Kelola keseluruhan event', icon: '🎯', color: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  { value: 'ADMIN', label: 'Admin', desc: 'Akses penuh ke semua fitur sistem', icon: '👑', color: 'border-rose-300 bg-rose-50 text-rose-700' },
];

const PASSWORD_RULES = [
  { label: 'Minimal 6 karakter', check: (p: string) => p.length >= 6 },
  { label: 'Mengandung huruf', check: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'Mengandung angka', check: (p: string) => /\d/.test(p) },
];

export const RegisterPage: React.FC = () => {
  const { register, setAuthPage } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MEMBER' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Nama minimal 2 karakter.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid.';
    if (form.password.length < 6) errs.password = 'Password minimal 6 karakter.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Konfirmasi password tidak cocok.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Remove the artificial delay
    const result = await register(form.name.trim(), form.email.trim(), form.password, form.role);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Registrasi gagal.');
    }
  };

  const passwordStrength = PASSWORD_RULES.filter(r => r.check(form.password)).length;
  const strengthColor = ['bg-slate-200', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-500'][passwordStrength];
  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat'][passwordStrength];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-white font-black text-lg tracking-tight">E</span>
          </div>
          <div>
            <span className="text-white font-black text-2xl tracking-tight">E-vent</span>
            <span className="block text-indigo-300 text-xs font-medium -mt-0.5">Sistem Manajemen Kepanitiaan</span>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
              Bergabung dengan <br />
              <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Komunitas Panitia
              </span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Buat akun gratis dan mulai kelola kepanitiaan Anda dengan sistem yang profesional dan terstruktur.
            </p>
          </div>

          {/* Benefit cards */}
          <div className="space-y-3">
            {[
              { icon: '🚀', title: 'Mulai Gratis, Tanpa Batas', desc: 'Akses semua fitur tanpa biaya apapun' },
              { icon: '🔐', title: 'Data Aman & Terenkripsi', desc: 'Informasi kepanitiaan terlindungi penuh' },
              { icon: '🤝', title: 'Kolaborasi Real-time', desc: 'Sinkronisasi tim secara otomatis dan instan' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{b.title}</p>
                  <p className="text-slate-400 text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-2 pt-6 border-t border-white/10">
          <Shield className="w-4 h-4 text-indigo-300" />
          <p className="text-slate-400 text-xs">
            Data Anda aman. Kami tidak pernah membagikan informasi pribadi kepada pihak ketiga.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 animate-fadeIn py-4">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="text-slate-900 font-black text-xl tracking-tight">E-vent</span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Buat akun baru ✨</h2>
            <p className="text-slate-500 text-sm">Isi data di bawah untuk mulai menggunakan E-vent.</p>
          </div>

          {/* Form */}
          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-700">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className={`clay-input w-full pl-10 pr-4 py-3 text-sm ${fieldErrors.name ? 'border-rose-400 focus:border-rose-400' : ''}`}
                />
              </div>
              {fieldErrors.name && <p className="text-rose-500 text-xs">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="nama@domain.com"
                  className={`clay-input w-full pl-10 pr-4 py-3 text-sm ${fieldErrors.email ? 'border-rose-400 focus:border-rose-400' : ''}`}
                />
              </div>
              {fieldErrors.email && <p className="text-rose-500 text-xs">{fieldErrors.email}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Peran dalam Kepanitiaan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    id={`role-option-${option.value.toLowerCase()}`}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: option.value }))}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all ${
                      form.role === option.value
                        ? option.color + ' shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{option.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800">{option.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight truncate">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="Buat password yang kuat"
                  className={`clay-input w-full pl-10 pr-11 py-3 text-sm ${fieldErrors.password ? 'border-rose-400 focus:border-rose-400' : ''}`}
                />
                <button
                  type="button"
                  id="toggle-reg-password"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColor : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      {PASSWORD_RULES.map((rule, i) => (
                        <span key={i} className={`text-[10px] flex items-center gap-1 ${rule.check(form.password) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <CheckCircle2 className="w-3 h-3" /> {rule.label}
                        </span>
                      ))}
                    </div>
                    <span className={`text-[10px] font-semibold ${passwordStrength === 3 ? 'text-emerald-600' : passwordStrength === 2 ? 'text-amber-600' : 'text-rose-500'}`}>
                      {strengthLabel}
                    </span>
                  </div>
                </div>
              )}
              {fieldErrors.password && <p className="text-rose-500 text-xs">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-confirm-password" className="block text-sm font-semibold text-slate-700">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                  placeholder="Ulangi password"
                  className={`clay-input w-full pl-10 pr-11 py-3 text-sm ${fieldErrors.confirmPassword ? 'border-rose-400 focus:border-rose-400' : form.confirmPassword && form.confirmPassword === form.password ? 'border-emerald-400' : ''}`}
                />
                <button
                  type="button"
                  id="toggle-confirm-password"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {form.confirmPassword && form.confirmPassword === form.password && (
                  <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
              </div>
              {fieldErrors.confirmPassword && <p className="text-rose-500 text-xs">{fieldErrors.confirmPassword}</p>}
            </div>

            {/* Global Error */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 animate-fadeIn">
                <span className="text-rose-500 text-sm">⚠</span>
                <p className="text-rose-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="clay-btn clay-btn-primary w-full py-3 text-sm gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Membuat akun...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun & Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <button
              id="go-to-login"
              onClick={() => setAuthPage('login')}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Masuk di sini
            </button>
          </p>
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
