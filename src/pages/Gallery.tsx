import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryItems = [
  { id: 1, category: 'Boya', before: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600', after: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600', title: 'Salon Boyama' },
  { id: 2, category: 'Fayans', before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600', after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', title: 'Banyo Yenileme' },
  { id: 3, category: 'Mutfak', before: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600', after: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600', title: 'Mutfak Dolapları' },
  { id: 4, category: 'Bahçe', before: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', after: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600', title: 'Bahçe Düzenleme' },
  { id: 5, category: 'Parke', before: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600', after: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600', title: 'Parke Döşeme' },
  { id: 6, category: 'Çatı', before: 'https://images.unsplash.com/photo-1632823471406-5c1c0c69c0f6?w=600', after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', title: 'Çatı Tadilat' },
];

const categories = ['Tümü', ...Array.from(new Set(galleryItems.map(i => i.category)))];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const filtered = selectedCategory === 'Tümü' ? galleryItems : galleryItems.filter(i => i.category === selectedCategory);

  const openModal = (index: number) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);
  const next = () => setModalIndex(prev => prev !== null ? (prev + 1) % filtered.length : null);
  const prev = () => setModalIndex(prev => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Galeri</h1>
          <p className="text-gray-600 dark:text-gray-400">Tamamlanan işlerimizin öncesi ve sonrası.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 hover:border-amber-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => openModal(i)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="relative overflow-hidden">
                  <img src={item.before} alt="Before" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs">Öncesi</span>
                </div>
                <div className="relative overflow-hidden">
                  <img src={item.after} alt="After" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-green-500/80 text-white text-xs">Sonrası</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeModal}>
          <button onClick={closeModal} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={32} /></button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/70 hover:text-white"><ChevronLeft size={40} /></button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/70 hover:text-white"><ChevronRight size={40} /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <img src={filtered[modalIndex].before} alt="Before" className="w-full h-[60vh] object-cover rounded-xl" />
                <p className="text-center text-white/70 mt-2">Öncesi</p>
              </div>
              <div>
                <img src={filtered[modalIndex].after} alt="After" className="w-full h-[60vh] object-cover rounded-xl" />
                <p className="text-center text-white/70 mt-2">Sonrası</p>
              </div>
            </div>
            <h3 className="text-white text-center text-xl font-bold mt-4">{filtered[modalIndex].title}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
