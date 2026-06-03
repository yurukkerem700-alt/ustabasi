import { Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, Award, Shield, Verified } from 'lucide-react';

interface Props {
  usta: any;
  showFollow?: boolean;
  onFollow?: (ustaId: number) => void;
  isFollowing?: boolean;
}

export default function UstaProfileMini({ usta, showFollow = true, onFollow, isFollowing = false }: Props) {
  if (!usta) return null;

  return (
    <div className="flex items-center gap-3 p-3">
      <Link to={`/usta/${usta.id}`} className="relative flex-shrink-0">
        <img
          src={usta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usta.name}`}
          alt={usta.name}
          className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200 dark:border-white/10"
        />
        {usta.identity_verified && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
            <BadgeCheck size={8} className="text-white" />
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Link to={`/usta/${usta.id}`} className="font-semibold text-sm hover:text-amber-600 transition-colors truncate">
            {usta.name}
          </Link>
          {usta.certified && <Award size={14} className="text-amber-500 flex-shrink-0" />}
          {usta.premium && <Verified size={14} className="text-purple-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-0.5">
            <Star size={10} className="text-amber-500" fill="currentColor" /> {usta.rating}
          </span>
          <span className="flex items-center gap-0.5">
            <MapPin size={10} /> {usta.location}
          </span>
        </div>
      </div>
      {showFollow && onFollow && (
        <button
          onClick={() => onFollow(usta.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isFollowing
              ? 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
              : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
        >
          {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
        </button>
      )}
    </div>
  );
}
