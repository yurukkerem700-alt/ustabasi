import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, Flag, Eye, Trash2, UserCheck } from 'lucide-react';

export default function AdminModerationPanel() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (showPanel) fetchReports();
  }, [showPanel]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'resolved' | 'dismissed') => {
    try {
      await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action })
      });
      fetchReports();
    } catch {}
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-all relative"
      >
        <Shield size={16} /> Moderasyon
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">{pendingCount}</span>
        )}
      </button>

      {showPanel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 z-50 overflow-hidden max-h-[500px] overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"><Shield size={18} className="text-amber-500" /> Moderasyon Paneli</h3>
            <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>

          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Yükleniyor...</div>
          ) : reports.length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Bekleyen şikayet yok.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {reports.map((r) => (
                <div key={r.id} className="p-3">
                  <div className="flex items-start gap-2">
                    <Flag size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.usta_posts?.title || 'Gönderi'}</p>
                      <p className="text-xs text-gray-500">{r.reason}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.ustas?.name || 'Bilinmiyor'}</p>
                    </div>
                    {r.status === 'pending' ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleAction(r.id, 'resolved')} className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200" title="Çözüldü">
                          <CheckCircle2 size={14} />
                        </button>
                        <button onClick={() => handleAction(r.id, 'dismissed')} className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200" title="Reddet">
                          <XCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {r.status === 'resolved' ? 'Çözüldü' : 'Reddedildi'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
