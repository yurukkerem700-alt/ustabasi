import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Sun, Moon, User, LogOut, Bell, AlertTriangle, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/ustalar', label: 'Ustalar' },
    { to: '/firmalar', label: 'Firmalar' },
    { to: '/harita', label: 'Harita' },
    { to: '/acil-durum', label: 'Acil Durum', highlight: true },
    { to: '/sohbet', label: 'Sohbet' },
    { to: '/ustagram', label: 'Ustagram' },
    { to: '/blog', label: 'Blog' },
    { to: '/iletisim', label: 'İletişim' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Ustabaşı" className="w-9 h-9 rounded-xl object-cover" />
            <span className="text-xl font-bold gradient-text">Ustabaşı</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  link.highlight
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : isActive(link.to)
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/bildirimler" className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5">
                  <User size={16} className="text-amber-600" />
                  <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                </div>
                <button onClick={signOut} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/giris"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                Giriş Yap
              </Link>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  link.highlight
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    : isActive(link.to)
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
              <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema'}
              </button>
              <Link to="/bildirimler" onClick={() => setOpen(false)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
              {!user && (
                <Link to="/giris" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium">
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
