import { Shield, Phone, MapPin, Award, Star, Clock, Heart } from 'lucide-react';

const badgeConfig: Record<string, { icon: any; label: string; color: string }> = {
  identity_verified: { icon: Shield, label: 'Kimlik Doğrulandı', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  phone_verified: { icon: Phone, label: 'Telefon Doğrulandı', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
  address_verified: { icon: MapPin, label: 'Adres Doğrulandı', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  certified: { icon: Award, label: 'Sertifikalı Usta', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
  top_rated: { icon: Star, label: 'En Yüksek Puan', color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
  fast_response: { icon: Clock, label: 'Hızlı Tepki', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400' },
  trusted: { icon: Heart, label: 'Güvenilir Usta', color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400' },
};

interface Props {
  usta: any;
  size?: 'sm' | 'md';
}

export default function ReputationBadges({ usta, size = 'sm' }: Props) {
  if (!usta) return null;

  const badges = Object.entries(badgeConfig).filter(([key]) => usta[key]);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map(([key, config]) => {
        const Icon = config.icon;
        return (
          <span
            key={key}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${config.color} ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            }`}
            title={config.label}
          >
            <Icon size={size === 'sm' ? 10 : 12} />
            {config.label}
          </span>
        );
      })}
    </div>
  );
}
