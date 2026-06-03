import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export default function KVKK() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Aydınlatma Metni ve KVKK</h1>
          <p className="text-gray-600 dark:text-gray-400">Kişisel verilerinizin korunması ve işlenmesine ilişkin bilgilendirme.</p>
        </motion.div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Veri Sorumlusu</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Ustabaşı platformu olarak kişisel verilerinizin güvenliği bizim için önceliklidir.
              Veri sorumlusu olarak iletişim bilgilerimiz:
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Mail size={14} className="text-amber-600" /> ustabasi.official@gmail.com</p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Phone size={14} className="text-amber-600" /> 0850 123 45 67</p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><MapPin size={14} className="text-amber-600" /> İstanbul, Türkiye</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. İşlen Kişisel Veriler</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Platformumuz üzerinden ad, soyad, e-posta adresi, telefon numarası, konum bilgisi,
              iş talebi detayları ve ödeme bilgileri gibi veriler işlenmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Veri İşleme Amaçları</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>Hizmet sunumu ve usta-eşleştirme</li>
              <li>Ödeme işlemleri ve faturalandırma</li>
              <li>Müşteri desteği ve iletişim</li>
              <li>Platform güvenliği ve dolandırıcılık önleme</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Haklarınız</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              KVKK kapsamında; verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme,
              işlemeye itiraz etme ve veri taşınabilirliği haklarına sahipsiniz.
              Haklarınızı ustabasi.official@gmail.com adresine yazarak kullanabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Çerez Politikası</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Web sitemizde kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanılmaktadır.
              Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. İletişim</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Gizlilik politikamız hakkında sorularınız için bize ustabasi.official@gmail.com
              adresinden veya 0850 123 45 67 numarasından ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
