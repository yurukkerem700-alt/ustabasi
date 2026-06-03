import { motion } from 'framer-motion';
import { Target, Eye, Heart, Shield, Users, Zap } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Güven', desc: 'Her usta kimlik doğrulamasından geçer.' },
  { icon: Zap, title: 'Hız', desc: 'Dakikalar içinde teklif alırsın.' },
  { icon: Heart, title: 'Memnuniyet', desc: 'Müşteri memnuniyeti önceliğimizdir.' },
  { icon: Users, title: 'Topluluk', desc: 'Binlerce usta ve milyonlarca müşteri.' },
];

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ustabaşı, 2025 yılında İstanbul'da kurulan ve Türkiye'nin her köşesine hizmet veren bir usta eşleştirme platformudur.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 mb-4">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold mb-3">Misyonumuz</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Türkiye'de herkesin güvenilir, hızlı ve ekonomik hizmete ulaşmasını sağlamak. Ustaları ve müşterileri en verimli şekilde buluşturmak.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 mb-4">
              <Eye size={24} />
            </div>
            <h2 className="text-xl font-bold mb-3">Vizyonumuz</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Türkiye'nin ve bölgenin en büyük hizmet eko-sistemini oluşturmak. Teknoloji ve güven ile hizmet sektörünü dönüştürmek.
            </p>
          </motion.div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-4">
                  <v.icon size={22} />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Hikayemiz</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Ustabaşı, evinde tadilat yaptırmak isteyen birinin karşılaştığı güvenilir usta bulma sorununu çözmek için yola çıktı. Bugün 12.500'den fazla aktif usta ve 85.000'den fazla tamamlanan iş ile Türkiye'nin lider platformu olma yolunda hızla ilerliyoruz.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
