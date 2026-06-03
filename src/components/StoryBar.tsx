import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface StoryBarProps {
  onSelectUsta?: (ustaId: number) => void;
}

export default function StoryBar({ onSelectUsta }: StoryBarProps) {
  const [ustas, setUstas] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/ustas?status=active')
      .then(r => r.json())
      .then(data => setUstas(Array.isArray(data) ? data.slice(0, 12) : []))
      .catch(() => setUstas([]));
  }, []);

  return (
    <div className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-xl mx-auto px-4 py-3">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
          {/* Add Story */}
          <button className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-slate-800">
              <Plus size={24} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-500">Ekle</span>
          </button>

          {ustas.map((usta, i) => (
            <motion.button
              key={usta.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectUsta?.(usta.id)}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div className={`w-16 h-16 rounded-full p-[2px] ${
                usta.status === 'active'
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 overflow-hidden">
                  <img
                    src={usta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usta.name}`}
                    alt={usta.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[64px]">{usta.name?.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
