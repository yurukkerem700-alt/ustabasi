import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, SlidersHorizontal, Clock, Shield, Award } from 'lucide-react';

export default function Ustalar() {
  const [searchParams] = useSearchParams();
  const [ustas, setUstas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchUstas();
  }, [categoryFilter, statusFilter]);

  const fetchUstas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/ustas?${params.toString()}`);
      const data = await res.json();
      setUstas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = ustas
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || (u.specialties || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'jobs') return b.completed_jobs - a.completed_jobs;
      if (sortBy === 'distance') return (a.distance_km || 999) - (b.distance_km || 999);
      return 0;
    });

  const categories = ['Elektrik', 'Su Tesisatı', 'Boya', 'Temizlik', 'Nakliyat', 'Klima', 'Mobilya', 'Çatı', 'İnşaat', 'Bahçe'];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Ustalar</h1>
          <p className="text-gray-600 dark:text-gray-400">En güvenilir ustaları keşfet ve karşılaştır.</p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Usta ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Çevrimiçi</option>
                <option value="available">Müsait</option>
                <option value="busy">Meşgul</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="rating">Puana Göre</option>
                <option value="jobs">İş Sayısına Göre</option>
                <option value="distance">Mesafeye Göre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} usta bulundu</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((usta, i) => (
                <motion.div
                  key={usta.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/usta/${usta.id}`} className="glass-card rounded-2xl p-5 block hover:shadow-xl transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={usta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usta.name}`}
                          alt={usta.name}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                          usta.status === 'active' ? 'bg-green-500' : usta.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{usta.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500 text-sm">
                          <Star size={14} fill="currentColor" />
                          <span className="font-medium">{usta.rating}</span>
                          <span className="text-gray-400">({usta.completed_jobs} iş)</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(usta.specialties || []).slice(0, 3).map((s: string) => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={14} /> {usta.location}
                        {usta.distance_km && <span className="text-amber-600">({usta.distance_km} km)</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock size={14} /> {usta.experience} yıl deneyim
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 flex-wrap">
                      {usta.identity_verified && <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"><Shield size={12} /> Kimlik</span>}
                      {usta.phone_verified && <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400"><Award size={12} /> Telefon</span>}
                      {usta.certified && <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"><Award size={12} /> Sertifika</span>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
