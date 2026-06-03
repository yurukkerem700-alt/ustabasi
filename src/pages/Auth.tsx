import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Wrench, Eye, EyeOff, Building2, UserCircle } from 'lucide-react';
import supabase from '../lib/supabase';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'usta' | 'company'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (role === 'company' && name) {
          await fetch('/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone: '', location: '', employee_count: 0 })
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-4">
              <Wrench size={24} />
            </div>
            <h1 className="text-2xl font-bold">{isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}</h1>
            <p className="text-sm text-gray-500 mt-1">Ustabaşı'na hoş geldiniz</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">İsim / Firma Adı</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder={role === 'company' ? 'Firma adınız' : 'Adınız'}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="******"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">Hesap Türü</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                      role === 'customer'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <UserCircle size={16} /> Müşteri
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('usta')}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                      role === 'usta'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <Wrench size={16} /> Usta
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                      role === 'company'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <Building2 size={16} /> Firma
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Yükleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              {isSignUp ? 'Zaten hesabın var mı? Giriş yap' : 'Hesabın yok mu? Kayıt ol'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
