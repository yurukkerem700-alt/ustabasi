import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Star, Shield, Clock, ChevronRight,
  Zap, Droplets, Paintbrush, Sparkles, Truck, Wind,
  Sofa, Home as HomeIcon, TreePine, Grid3X3, LayoutGrid, Heater,
  HardHat, Hammer, Wrench, Users, CheckCircle, Award
} from 'lucide-react';

const stats = [
  { label: 'Aktif Usta', value: '12.500+', icon: Users },
  { label: 'Tamamlanan İş', value: '85.000+', icon: CheckCircle },
  { label: 'Ortalama Puan', value: '4.8', icon: Star },
  { label: 'Hizmet Verilen Şehir', value: '81', icon: MapPin },
];

const steps = [
  { icon: Search, title: 'Hizmet Seç', desc: 'İhtiyacın olan kategoriyi seç.' },
  { icon: MapPin, title: 'Konum Belirle', desc: 'Bulunduğun konumu gir.' },
  { icon: Star, title: 'Teklif Al', desc: 'En iyi ustalar teklif versin.' },
  { icon: Shield, title: 'Ustayı Seç', desc: 'Puan ve yorumlara göre karar ver.' },
  { icon: CheckCircle, title: 'Hizmeti Tamamla', desc: 'Güvenle işini bitir.' },
];

const categories = [
  { name: 'Elektrik', icon: Zap, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { name: 'Su Tesisatı', icon: Droplets, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { name: 'Boya', icon: Paintbrush, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { name: 'Temizlik', icon: Sparkles, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { name: 'Nakliyat', icon: Truck, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { name: 'Klima', icon: Wind, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  { name: 'Mobilya', icon: Sofa, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { name: 'Çatı', icon: HomeIcon, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { name: 'İnşaat', icon: HardHat, color: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400' },
  { name: 'Bahçe', icon: TreePine, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { name: 'Cam Balkon', icon: Grid3X3, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { name: 'Fayans', icon: LayoutGrid, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  { name: 'Parke', icon: Hammer, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { name: 'Alçıpan', icon: Wrench, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  { name: 'Kombi', icon: Heater, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
];

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/ustas?status=active')
      .then(r => r.json())
      .then(data => setFeatured(data.slice(0, 6)))
      .catch(() => setFeatured([]));
  }, []);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-6">
                <Award size={14} />
                Türkiye'nin #1 Usta Platformu
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Usta İşi,{' '}
                <span className="gradient-text">Güvenilir Hizmet</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                Bulunduğun bölgedeki en iyi ustalara dakikalar içinde ulaş. Binlerce güvenilir usta seni bekliyor.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/ustalar"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all"
                >
                  Usta Bul
                </Link>
                <Link
                  to="/giris"
                  className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Usta Ol
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10">
                <img
                  src="/site_kapak.png"
                  alt="Ustabaşı Hero"
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Anlık Eşleşme</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3 dakika içinde teklif al</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nasl Çalışır?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              5 basit adımda işinizi güvenle tamamlayın.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 text-center h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-amber-500/20">
                    <step.icon size={24} />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="text-amber-400" size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Kategoriler</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Aradığın hizmeti seç, en yakın ustalara anında ulaş.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Kategori ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/ustalar?category=${cat.name}`}
                  className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-105 hover:shadow-xl transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.icon size={22} />
                  </div>
                  <span className="text-sm font-medium text-center">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ustas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Öne Çıkan Ustalar</h2>
              <p className="text-gray-600 dark:text-gray-400">En yüksek puanlı ve güvenilir ustalarımız.</p>
            </div>
            <Link to="/ustalar" className="hidden sm:flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium">
              Tümünü Gör <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((usta, i) => (
              <motion.div
                key={usta.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/usta/${usta.id}`} className="glass-card rounded-2xl p-5 block hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4">
                    <img
                      src={usta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usta.name}`}
                      alt={usta.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{usta.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 text-sm">
                        <Star size={14} fill="currentColor" />
                        <span className="font-medium">{usta.rating}</span>
                        <span className="text-gray-400">({usta.completed_jobs} iş)</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(usta.specialties || []).slice(0, 2).map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={14} /> {usta.location}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      usta.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      usta.status === 'busy' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {usta.status === 'active' ? 'Çevrimiçi' : usta.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Hemen İşine Başla</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
                Ücretsiz üye ol, iş talebini oluştur ve dakikalar içinde teklifler almaya başla.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/is-talebi" className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-105 transition-all">
                  İş Talebi Oluştur
                </Link>
                <Link to="/abonelik" className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Abonelikleri İncele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
