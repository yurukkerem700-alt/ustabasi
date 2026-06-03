import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, AlertTriangle, MessageSquare, Briefcase, Star, Clock } from 'lucide-react';

const typeIcons: Record<string, any> = {
  offer: Briefcase,
  job: Check,
  message: MessageSquare,
  emergency: AlertTriangle,
  review: Star,
};

const typeColors: Record<string, string> = {
  offer: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  job: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  message: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  emergency: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  review: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?user_id=demo-user');
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: number) => {
    try {
      await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (id: number) => {
    try {
      await fetch('/api/notifications', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = () => {
    notifications.filter(n => !n.read).forEach(n => markRead(n.id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bildirimler</h1>
            <p className="text-sm text-gray-500">{unreadCount} okunmamış bildirim</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="glass-card rounded-xl h-20 animate-pulse" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz bildirim yok.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => {
              const Icon = typeIcons[n.type] || Bell;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-xl p-4 flex items-start gap-3 ${!n.read ? 'border-l-4 border-amber-500' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[n.type] || 'bg-gray-100'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} /> {new Date(n.created_at).toLocaleString('tr-TR')}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400" title="Okundu">
                        <Check size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteNotif(n.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500" title="Sil">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
