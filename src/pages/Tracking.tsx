import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Icon, LatLngTuple } from 'leaflet';
import {
  Navigation, Clock, MapPin, Phone, Star, Truck, CheckCircle2,
  ArrowLeft, RefreshCw
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const ustaIcon = new Icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
const userIcon = new Icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], className: 'filter hue-rotate-180' });

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const ustaId = searchParams.get('usta');
  const [tracking, setTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<LatLngTuple>([41.0082, 28.9784]);

  useEffect(() => {
    fetchTracking();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
    const interval = setInterval(fetchTracking, 5000);
    return () => clearInterval(interval);
  }, [ustaId]);

  const fetchTracking = async () => {
    try {
      const url = ustaId ? `/api/tracking?usta_id=${ustaId}` : '/api/tracking';
      const res = await fetch(url);
      const data = await res.json();
      setTracking(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const t = tracking[0];
  const ustaPos: LatLngTuple = t ? [t.lat, t.lng] : [41.0, 29.0];

  return (
    <div className="pt-16 h-screen flex flex-col">
      <div className="glass border-b border-gray-200 dark:border-white/10 z-[400] relative">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-amber-600" />
            <h1 className="text-lg font-bold">Ustam Nerede?</h1>
          </div>
          <button onClick={fetchTracking} className="ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" /></div>
        ) : (
          <MapContainer center={ustaPos} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={ustaPos} icon={ustaIcon}>
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-semibold text-sm">{t?.ustas?.name || 'Usta'}</p>
                  <p className="text-xs text-gray-500">{t?.distance_km} km uzakta</p>
                  <p className="text-xs text-amber-600 font-medium">Tahmini varış: {t?.eta_minutes} dk</p>
                </div>
              </Popup>
            </Marker>
            <Marker position={userLocation} icon={userIcon}>
              <Popup><p className="text-sm font-medium">Sizin Konumunuz</p></Popup>
            </Marker>
            <Polyline positions={[ustaPos, userLocation]} color="#f59e0b" weight={4} dashArray="10, 10" />
          </MapContainer>
        )}

        {/* Info Card */}
        {t && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-4 left-4 right-4 z-[400]">
            <div className="glass-card rounded-2xl p-4 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <img src={t.ustas?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.ustas?.name}`} alt="" className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{t.ustas?.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-500" fill="currentColor" /> {t.ustas?.rating}</span>
                    <span className="flex items-center gap-0.5"><Phone size={10} /> {t.ustas?.phone || '0850 123 45 67'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold gradient-text">{t.eta_minutes}</p>
                  <p className="text-xs text-gray-500">dk kaldı</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-center">
                  <p className="text-lg font-bold">{t.distance_km}</p>
                  <p className="text-xs text-gray-500">km</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-center">
                  <p className="text-lg font-bold">{t.eta_minutes}</p>
                  <p className="text-xs text-gray-500">dk</p>
                </div>
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                  <p className="text-lg font-bold text-green-600"><CheckCircle2 size={20} className="mx-auto" /></p>
                  <p className="text-xs text-green-600">Yolda</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
