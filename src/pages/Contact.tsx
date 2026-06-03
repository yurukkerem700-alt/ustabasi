import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, Instagram, Facebook, Globe } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-gray-600 dark:text-gray-400">Bizimle iletişime geçin, en kısa sürede dönüş yapalım.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Mesajınız Gönderildi!</h3>
                  <p className="text-gray-600 dark:text-gray-400">En kısa sürede size döneceğiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">İsim</label>
                      <input required type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">E-posta</label>
                      <input required type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Konu</label>
                    <input required type="text" value={form.subject} onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mesaj</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                    <Send size={18} /> Gönder
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          <div className="space-y-4">
            {[
              { icon: Mail, title: 'E-posta', value: 'ustabasi.official@gmail.com', href: 'mailto:ustabasi.official@gmail.com' },
              { icon: Phone, title: 'Telefon', value: '0850 123 45 67', href: 'tel:+908501234567' },
              { icon: Instagram, title: 'Instagram', value: '@ustabasi.tr', href: 'https://instagram.com/ustabasi.tr' },
              { icon: Facebook, title: 'Facebook', value: 'ustabasi.tr', href: 'https://facebook.com/ustabasi.tr' },
              { icon: Globe, title: 'Web', value: 'ustabasi.com', href: '#' },
              { icon: MapPin, title: 'Adres', value: 'İstanbul, Türkiye', href: '#' },
              { icon: Clock, title: 'Çalışma Saatleri', value: 'Pzt-Cum: 09:00 - 18:00', href: '#' },
            ].map((item, i) => (
              <motion.a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.title}</p>
                  <p className="font-medium text-sm">{item.value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
