import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Eye, MousePointer, DollarSign, Calendar, TrendingUp, BarChart3, Target } from 'lucide-react';

export default function CompanyAdPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    budget: 1000,
    duration: 7,
    targetAudience: 'all'
  });
  const [submitted, setSubmitted] = useState(false);

  const stats = [
    { label: 'Görüntülenme', value: '12.450', icon: Eye, change: '+23%' },
    { label: 'Tıklama', value: '1.234', icon: MousePointer, change: '+15%' },
    { label: 'Dönüşüm', value: '89', icon: Target, change: '+8%' },
    { label: 'Harcama', value: '2.450 TL', icon: DollarSign, change: '-5%' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowPanel(false); }, 2000);
  };

  return (
    <div>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium hover:shadow-lg transition-all"
      >
        <Megaphone size={16} /> Reklam Ver
      </button>

      {showPanel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"><Megaphone size={18} className="text-purple-500" /> Reklam Paneli</h3>
            <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>

          {submitted ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 mx-auto mb-3">
                <TrendingUp size={24} />
              </div>
              <p className="font-semibold">Reklam Talebiniz Alındı!</p>
              <p className="text-sm text-gray-500 mt-1">Onay için size döneceğiz.</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 p-4">
                {stats.map(s => (
                  <div key={s.label} className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-center">
                    <s.icon size={14} className="text-purple-500 mx-auto mb-1" />
                    <p className="text-sm font-bold">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Reklam Başlığı</label>
                  <input type="text" required value={adForm.title} onChange={e => setAdForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Açıklama</label>
                  <textarea rows={2} value={adForm.description} onChange={e => setAdForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Bütçe: {adForm.budget.toLocaleString('tr-TR')} TL</label>
                  <input type="range" min="500" max="50000" step="500" value={adForm.budget} onChange={e => setAdForm(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Süre: {adForm.duration} gün</label>
                  <input type="range" min="1" max="30" value={adForm.duration} onChange={e => setAdForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full mt-1" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
                  Reklam Oluştur
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
