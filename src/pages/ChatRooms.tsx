import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MessageCircle, ChevronRight, Zap, Droplets, Paintbrush, HardHat, Truck } from 'lucide-react';

const iconMap: Record<string, any> = {
  Zap, Droplets, Paintbrush, HardHat, Truck,
};

export default function ChatRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/chat-rooms');
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Mesleki Sohbet Kanalları</h1>
          <p className="text-gray-600 dark:text-gray-400">Aynı meslekten ustalarla bilgi paylaşımı yap, yardımlaş.</p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {rooms.map((room, i) => {
              const Icon = iconMap[room.icon] || MessageCircle;
              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/sohbet/${room.id}`} className="glass-card rounded-2xl p-6 block hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{room.name}</h3>
                          <p className="text-sm text-gray-500">{room.category}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{room.description}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                      <span className="flex items-center gap-1 text-sm text-gray-500"><Users size={14} /> {room.member_count} üye</span>
                      <span className="flex items-center gap-1 text-sm text-green-500"><span className="w-2 h-2 rounded-full bg-green-500" /> Çevrimiçi</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
