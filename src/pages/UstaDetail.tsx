import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Clock, Shield, Award, Phone, Mail,
  CheckCircle, MessageCircle, Calendar, TrendingUp
} from 'lucide-react';

export default function UstaDetail() {
  const { id } = useParams();
  const [usta, setUsta] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsta();
  }, [id]);

  const fetchUsta = async () => {
    setLoading(true);
    try {
      const [ustaRes, reviewsRes] = await Promise.all([
        fetch(`/api/ustas?id=${id}`),
        fetch(`/api/reviews?usta_id=${id}`)
      ]);
      const ustas = await ustaRes.json();
      setUsta(Array.isArray(ustas) ? ustas[0] : null);
      setReviews(await reviewsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!usta) {
    return (
      <div className="pt-24 pb-20 text-center">
        <p className="text-gray-500">Usta bulunamadı.</p>
      </div>
    );
  }

  const badges = [
    { key: 'identity_verified', label: 'Kimlik Doğrulandı', icon: Shield, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    { key: 'phone_verified', label: 'Telefon Doğrulandı', icon: Phone, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    { key: 'address_verified', label: 'Adres Doğrulandı', icon: MapPin, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    { key: 'certified', label: 'Sertifikalı Usta', icon: Award, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative mx-auto sm:mx-0">
              <img
                src={usta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usta.name}`}
                alt={usta.name}
                className="w-32 h-32 rounded-2xl object-cover bg-gray-100"
              />
              <span className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium border-2 border-white dark:border-slate-800 ${
                usta.status === 'active' ? 'bg-green-500 text-white' :
                usta.status === 'busy' ? 'bg-red-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {usta.status === 'active' ? 'Çevrimiçi' : usta.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{usta.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={18} fill="currentColor" />
                  <span className="font-semibold">{usta.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 dark:text-gray-400">{usta.completed_jobs} tamamlanan iş</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 dark:text-gray-400">{usta.experience} yıl deneyim</span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {(usta.specialties || []).map((s: string) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Link
                  to={`/mesajlar?usta=${usta.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  <MessageCircle size={16} /> Mesaj Gönder
                </Link>
                <Link
                  to="/is-talebi"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 font-medium hover:shadow-lg transition-all"
                >
                  <Calendar size={16} /> Teklif İste
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Hakkında</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{usta.about || 'Profesyonel hizmet anlayışıyla müşteri memnuniyetini ön planda tutuyorum.'}</p>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Değerlendirmeler ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.length === 0 && <p className="text-gray-500 text-sm">Henüz değerlendirme yok.</p>}
                {reviews.map((review: any) => (
                  <div key={review.id} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Güven Rozetleri</h2>
              <div className="space-y-3">
                {badges.map(badge => (
                  <div key={badge.key} className={`flex items-center gap-3 p-3 rounded-xl ${usta[badge.key] ? badge.color : 'opacity-40 grayscale'}`}>
                    <badge.icon size={18} />
                    <span className="text-sm font-medium">{badge.label}</span>
                    {usta[badge.key] && <CheckCircle size={14} className="ml-auto" />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">İstatistikler</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><TrendingUp size={14} /> Başarı Oranı</span>
                  <span className="font-semibold">%{Math.round((usta.rating / 5) * 100)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><Clock size={14} /> Tepki Süresi</span>
                  <span className="font-semibold">15 dk</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><CheckCircle size={14} /> Tamamlanan İş</span>
                  <span className="font-semibold">{usta.completed_jobs}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
