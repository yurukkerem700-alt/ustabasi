import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2, CreditCard } from 'lucide-react';

const plans = [
  {
    name: 'Başlangıç',
    icon: Zap,
    price: '0',
    period: 'aylık',
    description: 'Yeni başlayan ustalar için ideal paket.',
    features: ['Aylık 5 teklif hakkı', 'Temel profil sayfası', 'Müşteri değerlendirmeleri', 'E-posta desteği'],
    cta: 'Ücretsiz Başla',
    popular: false,
  },
  {
    name: 'Profesyonel',
    icon: Crown,
    price: '299',
    period: 'aylık',
    description: 'Aktif çalışan ustalar için profesyonel paket.',
    features: ['Sınırsız teklif hakkı', 'Öne çıkan profil', 'Güven rozetleri', 'Öncelikli destek', 'Ustagram erişimi', 'Detaylı istatistikler'],
    cta: 'Profesyonel Ol',
    popular: true,
  },
  {
    name: 'Kurumsal',
    icon: Building2,
    price: '999',
    period: 'aylık',
    description: 'Şirketler ve ekipler için kurumsal çözüm.',
    features: ['5 usta hesabı', 'Marka sayfası', 'API erişimi', '7/24 telefon desteği', 'Reklam kredisi', 'Özel hesap yöneticisi'],
    cta: 'Kurumsal Ol',
    popular: false,
  },
];

export default function Subscriptions() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Abonelik Paketleri</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            İşini büyütmek isteyen ustalar için tasarlanmış paketler.
          </p>
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-gray-100 dark:bg-white/5">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-gray-500'}`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-gray-500'}`}
            >
              Yıllık <span className="text-amber-600 text-xs">%20 indirim</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card rounded-2xl p-6 sm:p-8 ${plan.popular ? 'ring-2 ring-amber-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold">
                  En Popüler
                </div>
              )}
              <div className="text-center mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${plan.popular ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600'}`}>
                  <plan.icon size={24} />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">{billing === 'yearly' ? Math.round(parseInt(plan.price) * 0.8 * 12).toLocaleString('tr-TR') : plan.price} TL</span>
                <span className="text-gray-500 text-sm">/{billing === 'yearly' ? 'yıllık' : plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                plan.popular
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl'
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 hover:border-amber-500'
              }`}>
                <CreditCard size={16} /> {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 glass-card rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tüm paketlerde 14 günlük ücretsiz deneme mevcuttur. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
