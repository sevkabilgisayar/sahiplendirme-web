import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { Listing } from '@/types';

const listingTypeConfig = {
  sahiplendirme: { label: 'Sahiplendirme', color: 'bg-blue-100 text-blue-700' },
  kayip: { label: 'Kayıp', color: 'bg-red-100 text-red-700' },
  ciftlestirme: { label: 'Çiftleştirme', color: 'bg-purple-100 text-purple-700' },
};

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const typeConf = listingTypeConfig[listing.type];
  
  return (
    <Link href={`/ilan/${listing.id}`} className="group block h-full">
      <div className="bg-[var(--surface)] h-full flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-[var(--brand-primary-light)]">
        {/* Image area */}
        <div className={`relative h-48 bg-gradient-to-br ${listing.imageColor} flex items-center justify-center overflow-hidden shrink-0`}>
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
            {listing.emoji}
          </span>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeConf.color}`}>
              {typeConf.label}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              listing.ownerType === 'sahibinde' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'
            }`}>
              {listing.ownerType === 'sahibinde' ? '🏠 Sahibinde' : '🏛️ Barınakta'}
            </span>
          </div>
          {/* Reward badge */}
          {listing.reward && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              🏅 ₺{listing.reward} Ödül
            </div>
          )}
          {/* Heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm z-10"
          >
            <Heart size={14} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs text-[var(--foreground-muted)] font-medium bg-[var(--surface-secondary)] px-2 py-0.5 rounded-md">{listing.breed}</span>
            <span className="text-xs text-[var(--foreground-muted)] bg-[var(--surface-secondary)] px-2 py-0.5 rounded-md">{listing.age}</span>
            <span className="text-xs text-[var(--foreground-muted)] bg-[var(--surface-secondary)] px-2 py-0.5 rounded-md">
              {listing.gender === 'erkek' ? '♂ Erkek' : '♀ Dişi'}
            </span>
          </div>
          <h3 className="font-semibold text-[var(--foreground)] text-base mb-1 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-1">
            {listing.name}
          </h3>
          <span className="text-[10px] text-[var(--foreground-muted)] font-mono mb-2 block">
            #{String(listing.id).padStart(5, '0')}
          </span>
          <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)] mt-auto pt-2 border-t border-[var(--border-subtle)]">
            <MapPin size={12} className="text-[var(--brand-primary)]" />
            {listing.city}
            <span className="ml-auto text-[10px]">{listing.createdAt}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
