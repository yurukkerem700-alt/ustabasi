import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, DollarSign, CheckCircle, MessageCircle, TrendingUp } from 'lucide-react';

export default function Offers() {
  const { jobId } = useParams();
  const [offers, setOffers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>(jobId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) fetchOffers(selectedJob);
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
      if (!selectedJob && data.length > 0) setSelectedJob(data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOffers = async (jid: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/offers?job_id=${jid}`);
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async (id: string) => {
    try {
      await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'accepted' })
      });
      fetchOffers(selectedJob);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedJobData = jobs.find(j => j.id === selectedJob);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">Teklifler</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Gelen teklifleri karşılaştır ve en uygun ustayı seç.</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">İş Taleplerim</h2>
            {jobs.map(job => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job.id)}
                className={`w-full text-left glass-card rounded-xl p-4 transition-all ${selectedJob === job.id ? 'ring-2 ring-amber-500' : 'hover:shadow-md'}`}
              >
                <p className="font-medium text-sm truncate">{job.title}</p>
                <p className="text-xs text-gray-500 mt-1">{job.location} • {new Date(job.created_at).toLocaleDateString('tr-TR')}</p>
              </button>
            ))}
          </div>

          {/* Offers */}
          <div className="lg:col-span-2">
            {selectedJobData && (
              <div className="glass-card rounded-xl p-4 mb-6">
                <h3 className="font-semibold">{selectedJobData.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedJobData.description}</p>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-32" />)}
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-xl">
                <p className="text-gray-500">Henüz teklif gelmemiş.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer, i) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={offer.ustas?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${offer.ustas?.name}`}
                        alt={offer.ustas?.name}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{offer.ustas?.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span className="flex items-center gap-1"><Star size={14} className="text-amber-500" /> {offer.ustas?.rating}</span>
                              <span className="flex items-center gap-1"><TrendingUp size={14} /> {offer.ustas?.completed_jobs} iş</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold gradient-text">{offer.price.toLocaleString('tr-TR')} TL</p>
                            <p className="text-xs text-gray-500 flex items-center justify-end gap-1"><Clock size={12} /> {offer.estimated_days} gün</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">{offer.message}</p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => acceptOffer(offer.id)}
                            disabled={offer.status === 'accepted'}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            <CheckCircle size={14} /> {offer.status === 'accepted' ? 'Kabul Edildi' : 'Kabul Et'}
                          </button>
                          <Link
                            to={`/mesajlar/${selectedJob}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-sm font-medium hover:shadow-lg transition-all"
                          >
                            <MessageCircle size={14} /> Mesaj Gönder
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
