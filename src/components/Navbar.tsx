import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, Sun, Moon, Bell, PlusCircle } from 'lucide-react';
import { fetchList } from '../lib/api';

const links = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/ustalar', label: 'Ustalar' },
  { to: '/firmalar', label: 'Firmalar' },
  { to: '/harita', label: 'Harita' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/acil-durum', label: 'Acil Durum', highlight: true },
  { to: '/sohbet', label: 'Sohbet' },
  { to: '/blog', label: 'Blog' },
  { to: '/iletisim', label: 'İletişim' },
];

// Mobil menüde ek olarak gösterilen sayfalar
const moreLinks = [
  { to: '/teklifler', label: 'Tekliflerim' },
  { to: '/mesajlar', label: 'Mesajlarım' },
  { to: '/takip', label: 'Ustam Nerede?' },
  { to: '/abonelik', label: 'Abonelikler' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Okunmamış bildirim sayısı (sayfa değişince ve düzenli aralıkla yenilenir)
  useEffect(() => {
    let alive = true;
    const load = () => fetchList('/api/notifications?user_id=demo-user').then(list => {
      if (alive) setUnread(list.filter((n: any) => !n.read).length);
    });
    load();
    const t = setInterval(load, 8000);
    return () => { alive = false; clearInterval(t); };
  }, [location.pathname]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const bell = (
    <Link to="/bildirimler" aria-label={`Bildirimler${unread ? ` (${unread} okunmamış)` : ''}`} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 relative">
      <Bell size={18} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );

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
              aria-label="Temayı değiştir"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {bell}
            <Link
              to="/is-talebi"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              <PlusCircle size={16} /> İş Talebi
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} aria-label="Menüyü aç/kapat" aria-expanded={open} className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {[...links, ...moreLinks].map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  'highlight' in link && link.highlight
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
              {bell}
              <Link to="/is-talebi" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium">
                İş Talebi
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
