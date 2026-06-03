import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, MapPin, Clock, Phone, Navigation, Send,
  CheckCircle2, Shield, Zap, Droplets, Wind, Wrench, Flame,
  Star, ChevronRight
} from 'lucide-react';

const urgencyColors: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
};

const categories = [
  { name: 'Elektrik', icon: Zap, desc: 'Elektrik kesintisi, kısa devre, sigorta' },
  { name: 'Su Tesisatı', icon: Droplets, desc: 'Boru patlağı, tıkanıklık, sızıntı' },
  { name: 'Klima', icon: Wind, desc: 'Klima arızası, gaz kaçağı' },
  { name: 'Doğalgaz', icon: Flame, desc: 'Gaz kaçağı, kombi arızası' },
  { name: 'Diğer', icon: Wrench, desc: 'Diğer acil durumlar' },
];

export default function Emergency() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: '', title: '', description: '', location: '', urgency: 'high' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/emergency');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: 'demo-user', status: 'pending' })
      });
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setShowForm(false); setForm({ category: '', title: '', description: '', location: '', urgency: 'high' }); }, 2000);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Acil Durum</h1>
          <p className="text-gray-600 dark:text-gray-400">Acil durumunuzda en yakın ve en uygun ustayı anında bulun.</p>
        </motion.div>

        {!showForm ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => { setForm(prev => ({ ...prev, category: cat.name })); setShowForm(true); }}
                className="glass-card rounded-2xl p-6 text-left hover:shadow-xl hover:scale-[1.02] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <cat.icon size={22} />
                </div>
                <h3 className="font-bold mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.desc}</p>
              </motion.button>
            ))}
          </div>
        ) : submitted ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card rounded-2xl p-8 text-center mb-10">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Talebiniz Alındı!</h2>
            <p className="text-gray-600 dark:text-gray-400">En kısa sürede size döneceğiz.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 sm:p-8 mb-10 max-w-lg mx-auto">
            <button onClick={() => setShowForm(false)} className="text-sm text-gray-500 mb-4 hover:text-amber-600">← Geri Dön</button>
            <h2 className="text-xl font-bold mb-4">Acil Durum Bildir</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select required value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="">Seçin</option>
                  {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <input required type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Konum</label>
                <input required type="text" value={form.location} onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Aciliyet</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{v:'critical',l:'Kritik'},{v:'high',l:'Yüksek'},{v:'medium',l:'Orta'}].map(u => (
                    <button key={u.v} type="button" onClick={() => setForm(prev => ({ ...prev, urgency: u.v }))}
                      className={`py-2 rounded-xl text-sm font-medium border transition-all ${form.urgency === u.v ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                      {u.l}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <Send size={18} /> Acil Talep Gönder
              </button>
            </form>
          </motion.div>
        )}

        {/* Active Emergencies */}
        <h2 className="text-xl font-bold mb-4">Aktif Acil Durumlar</h2>
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="glass-card rounded-xl h-24 animate-pulse" />)}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-sm">Aktif acil durum yok.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req, i) => (
              <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${urgencyColors[req.urgency] || 'bg-gray-400'}`} />
                    <h3 className="font-semibold">{req.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    req.status === 'assigned' ? 'bg-green-100 text-green-700 dark:bg-green-900/20' :
                    req.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {req.status === 'assigned' ? 'Atandı' : req.status === 'pending' ? 'Bekliyor' : req.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{req.description}</p>
                {req.ustas && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 mb-3">
                    <div className="flex items-center gap-3">
                      <img src={req.ustas.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.ustas.name}`} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{req.ustas.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-500" fill="currentColor" /> {req.ustas.rating}</span>
                          <span className="flex items-center gap-0.5"><Phone size={10} /> {req.ustas.phone || '0850 123 45 67'}</span>
                        </div>
                      </div>
                      <Link to={`/takip?usta=${req.assigned_usta_id}`} className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-1 hover:bg-amber-100 transition-colors">
                        <Navigation size={12} /> Takip Et
                      </Link>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {req.location}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(req.created_at).toLocaleString('tr-TR')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
