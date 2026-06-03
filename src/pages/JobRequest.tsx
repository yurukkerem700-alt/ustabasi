import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Upload, MapPin, DollarSign, FileText, Tag } from 'lucide-react';

export default function JobRequest() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    category_id: '',
    title: '',
    description: '',
    location: '',
    budget: '',
    images: [] as string[]
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: parseFloat(form.budget) || 0, user_id: 'demo-user' })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/teklifler'), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  if (success) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <Send className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">İş Talebiniz Oluşturuldu!</h2>
          <p className="text-gray-600 dark:text-gray-400">Ustalar teklif göndermeye başladı. Teklifler sayfasına yönlendiriliyorsunuz...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">İş Talebi Oluştur</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Detayları gir, en iyi ustalar teklif göndersin.</p>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Tag size={14} /> Kategori</label>
              <select
                required
                value={form.category_id}
                onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="">Kategori seçin</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><FileText size={14} /> Başlık</label>
              <input
                required
                type="text"
                placeholder="Örn: Banyo fayans döşeme"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><FileText size={14} /> Açıklama</label>
              <textarea
                required
                rows={4}
                placeholder="İşin detaylarını yazın..."
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2"><MapPin size={14} /> Konum</label>
                <input
                  required
                  type="text"
                  placeholder="Şehir / İlçe"
                  value={form.location}
                  onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2"><DollarSign size={14} /> Bütçe (TL)</label>
                <input
                  type="number"
                  placeholder="Tahmini bütçe"
                  value={form.budget}
                  onChange={e => setForm(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Upload size={14} /> Fotoğraflar</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-6 text-center hover:border-amber-500 transition-colors">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="job-images" />
                <label htmlFor="job-images" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-500">Fotoğraf yüklemek için tıklayın</p>
                </label>
              </div>
              {form.images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} /> {submitting ? 'Gönderiliyor...' : 'Talep Oluştur'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
