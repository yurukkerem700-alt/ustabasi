import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Icon, LatLngTuple } from 'leaflet';
import {
  Search, Filter, MapPin, Users, Briefcase, Wrench, Navigation,
  ZoomIn, ZoomOut, Layers, Circle
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
const companyIcon = new Icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], className: 'filter hue-rotate-90' });
const jobIcon = new Icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], className: 'filter hue-rotate-270' });

function MapController({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  const map = (window as any).leafletMap;
  useEffect(() => {
    if (map) map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function WorldMap() {
  const [ustas, setUstas] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ustas' | 'companies' | 'jobs'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([39.0, 35.0]);
  const [mapZoom, setMapZoom] = useState(6);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, cRes, jRes] = await Promise.all([
        fetch('/api/ustas'),
        fetch('/api/companies'),
        fetch('/api/company-jobs')
      ]);
      setUstas(await uRes.json());
      setCompanies(await cRes.json());
      setJobs(await jRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUstas = useMemo(() => {
    return ustas.filter(u => u.lat && u.lng && (!search || (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.location || '').toLowerCase().includes(search.toLowerCase())));
  }, [ustas, search]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => c.lat && c.lng && (!search || (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.location || '').toLowerCase().includes(search.toLowerCase())));
  }, [companies, search]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => j.lat && j.lng && (!search || (j.title || '').toLowerCase().includes(search.toLowerCase()) || (j.location || '').toLowerCase().includes(search.toLowerCase())));
  }, [jobs, search]);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
          setMapZoom(13);
        },
        () => {
          setMapCenter([41.0082, 28.9784]);
          setMapZoom(11);
        }
      );
    }
  };

  return (
    <div className="pt-16 h-screen flex flex-col">
      <div className="glass border-b border-gray-200 dark:border-white/10 z-[400] relative">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold gradient-text">Dünya Haritası</h1>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); }} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Konum, usta veya iş ara..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </form>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <Filter size={18} />
            </button>
            <button onClick={handleLocate} className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-200 transition-colors" title="Konumuma Git">
              <Navigation size={18} />
            </button>
          </div>

          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'Tümü', icon: Layers, color: 'bg-gray-500' },
                  { value: 'ustas', label: 'Ustalar', icon: Wrench, color: 'bg-blue-500' },
                  { value: 'companies', label: 'Firmalar', icon: Briefcase, color: 'bg-green-500' },
                  { value: 'jobs', label: 'İşler', icon: MapPin, color: 'bg-purple-500' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setFilterType(opt.value as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterType === opt.value ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}>
                    <opt.icon size={12} /> {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" /></div>
        ) : (
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} zoomControl={false}
            ref={(ref: any) => { if (ref) { (window as any).leafletMap = ref; setMapReady(true); } }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {mapReady && <MapController center={mapCenter} zoom={mapZoom} />}

            {(filterType === 'all' || filterType === 'ustas') && filteredUstas.map(u => (
              <Marker key={`u-${u.id}`} position={[u.lat, u.lng]} icon={defaultIcon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.location}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{(u.specialties || []).join(', ')}</p>
                    <p className="text-xs text-amber-600 font-medium">⭐ {u.rating} • {u.completed_jobs} iş</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {(filterType === 'all' || filterType === 'companies') && filteredCompanies.map(c => (
              <Marker key={`c-${c.id}`} position={[c.lat, c.lng]} icon={companyIcon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.industry} • {c.location}</p>
                    <p className="text-xs text-gray-600 mt-1">{c.employee_count} çalışan</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {(filterType === 'all' || filterType === 'jobs') && filteredJobs.map(j => (
              <Marker key={`j-${j.id}`} position={[j.lat, j.lng]} icon={jobIcon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <p className="font-semibold text-sm">{j.title}</p>
                    <p className="text-xs text-gray-500">{j.location}</p>
                    <p className="text-xs text-gray-600 mt-1">{j.budget?.toLocaleString('tr-TR')} TL</p>
                    <p className="text-xs text-amber-600">{j.ustas?.name}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Legend */}
        <div className="absolute top-4 left-4 z-[400]">
          <div className="glass-card rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-500 mb-1">Harita Lejandı</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Usta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Firma</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">İş</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-[400]">
          <div className="glass-card rounded-xl p-3 flex gap-4 justify-center sm:justify-start">
            <div className="text-center">
              <p className="text-lg font-bold gradient-text">{filteredUstas.length}</p>
              <p className="text-xs text-gray-500">Usta</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold gradient-text">{filteredCompanies.length}</p>
              <p className="text-xs text-gray-500">Firma</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold gradient-text">{filteredJobs.length}</p>
              <p className="text-xs text-gray-500">İş</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
