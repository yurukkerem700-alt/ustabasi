import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Building2, MapPin, Users, Star, Shield, Phone, Mail,
  Globe, ChevronRight, Briefcase, TrendingUp, CheckCircle2
} from 'lucide-react';

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, empRes, jobRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/company-employees'),
        fetch('/api/company-jobs')
      ]);
      setCompanies(await compRes.json());
      setEmployees(await empRes.json());
      setCompanyJobs(await jobRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  const getCompanyEmployees = (companyId: number) => employees.filter(e => e.company_id === companyId);
  const getCompanyJobs = (companyId: number) => companyJobs.filter(j => j.company_id === companyId);

  const statusColors: Record<string, string> = {
    assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Firmalar</h1>
          <p className="text-gray-600 dark:text-gray-400">Güvenilir firmaları keşfet, çalışan ustaları ve işlerini görüntüle.</p>
        </div>

        <div className="glass-card rounded-2xl p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Firma veya sektör ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        {selectedCompany ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setSelectedCompany(null)} className="mb-4 text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <ChevronRight size={16} className="rotate-180" /> Firmalara Dön
            </button>

            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedCompany.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                    {selectedCompany.verified && <CheckCircle2 size={20} className="text-blue-500" />}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{selectedCompany.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedCompany.location}</span>
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedCompany.industry}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {selectedCompany.employee_count} çalışan</span>
                    <span className="flex items-center gap-1"><Mail size={14} /> {selectedCompany.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {selectedCompany.phone}</span>
                    <span className="flex items-center gap-1"><Globe size={14} /> {selectedCompany.website}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users size={18} /> Çalışan Ustalar ({getCompanyEmployees(selectedCompany.id).length})</h3>
                <div className="space-y-3">
                  {getCompanyEmployees(selectedCompany.id).map((emp: any) => (
                    <div key={emp.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <img
                        src={emp.ustas?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.ustas?.name}`}
                        alt={emp.ustas?.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{emp.ustas?.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[emp.status] || 'bg-gray-100'}`}>{emp.status === 'active' ? 'Aktif' : emp.status}</span>
                        </div>
                        <p className="text-xs text-gray-500">{emp.role} • {emp.ustas?.specialties?.slice(0, 2).join(', ')}</p>
                        <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                          <Star size={10} fill="currentColor" /> {emp.ustas?.rating} • {emp.ustas?.completed_jobs} iş
                        </div>
                      </div>
                      <Link to={`/usta/${emp.usta_id}`} className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 transition-colors">
                        Profil
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Briefcase size={18} /> İş Takibi ({getCompanyJobs(selectedCompany.id).length})</h3>
                <div className="space-y-3">
                  {getCompanyJobs(selectedCompany.id).map((job: any) => (
                    <div key={job.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{job.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[job.status] || 'bg-gray-100'}`}>
                          {job.status === 'in_progress' ? 'Devam Ediyor' : job.status === 'completed' ? 'Tamamlandı' : job.status === 'assigned' ? 'Atandı' : job.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                        <span className="flex items-center gap-1"><TrendingUp size={10} /> {job.budget?.toLocaleString('tr-TR')} TL</span>
                        <span className="flex items-center gap-1"><Users size={10} /> {job.ustas?.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" />)
            ) : filtered.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedCompany(company)}
                className="glass-card rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold">
                    {company.name[0]}
                  </div>
                  {company.verified && <CheckCircle2 size={20} className="text-blue-500" />}
                </div>
                <h3 className="font-bold text-lg mb-1">{company.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{company.industry} • {company.location}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{company.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {company.employee_count}</span>
                  <span className="flex items-center gap-1"><Briefcase size={12} /> {getCompanyJobs(company.id).length} iş</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
