import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Ustabaşı" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-lg font-bold gradient-text">Ustabaşı</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Türkiye'nin en güvenilir ve en hızlı usta eşleştirme platformu. Dakikalar içinde en yakın ustayı bulun.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:text-amber-600 transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/ustalar" className="hover:text-amber-600 transition-colors">Ustalar</Link></li>
              <li><Link to="/is-talebi" className="hover:text-amber-600 transition-colors">İş Talebi Oluştur</Link></li>
              <li><Link to="/ustagram" className="hover:text-amber-600 transition-colors">Ustagram</Link></li>
              <li><Link to="/blog" className="hover:text-amber-600 transition-colors">Blog</Link></li>
              <li><Link to="/abonelik" className="hover:text-amber-600 transition-colors">Abonelikler</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kategoriler</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {['Elektrik', 'Su Tesisatı', 'Boya', 'Temizlik', 'Nakliyat', 'Klima'].map(cat => (
                <li key={cat}><Link to={`/ustalar?category=${cat}`} className="hover:text-amber-600 transition-colors">{cat}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2"><Phone size={14} className="text-amber-600" /> 0850 123 45 67</li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-amber-600" /> info@ustabasi.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-600" /> İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500">
          <p>© 2025 Ustabaşı. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link to="/kvkk" className="hover:text-amber-600 transition-colors">Gizlilik Politikası</Link>
            <Link to="/kvkk" className="hover:text-amber-600 transition-colors">Kullanım Koşulları</Link>
            <Link to="/kvkk" className="hover:text-amber-600 transition-colors">KVKK / Aydınlatma Metni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
