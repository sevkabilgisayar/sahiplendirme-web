import Link from 'next/link';
import { Heart, MapPin, ScanSearch, Eye, MessageCircle, ArrowRight, Shield, User, Building2 } from 'lucide-react';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const isSahibinde = listing.ownerType === 'sahibinde';
  
  let btnClass = 'bg-[#FF6B00] hover:bg-[#E65A00]';
  let borderClass = 'hover:border-[#FF6B00] border-gray-200';
  let icon = <Eye size={16} />;
  let btnText = 'Sahiplen';
  
  if (listing.type === 'kayip') {
    btnClass = 'bg-red-500 hover:bg-red-600';
    borderClass = 'hover:border-red-500 border-gray-200';
    icon = <ScanSearch size={16} />;
    btnText = 'İhbar Et';
  } else if (listing.type === 'ciftlestirme') {
    btnClass = 'bg-purple-500 hover:bg-purple-600';
    borderClass = 'hover:border-purple-500 border-gray-200';
    btnText = 'Eşleştir';
  }
  
  return (
    <Link href={`/ilan/${listing.id}`} className="group block h-full">
      <div className={`bg-white h-full flex flex-col rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${borderClass} overflow-hidden`}>
        
        {/* Image Area */}
        <div className="relative aspect-square w-full overflow-hidden shrink-0 bg-slate-100">
          {listing.photos?.[0] ? (
            <img
              src={listing.photos[0]}
              alt={listing.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${listing.imageColor}`}>
              <span className="text-7xl">{listing.emoji}</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Left: Owner Type Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm ${
              !isSahibinde ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700'
            }`}>
              {!isSahibinde ? <Building2 size={11} /> : <User size={11} />}
              {!isSahibinde ? (listing.shelterName || 'Barınak') : 'Bireysel'}
            </span>
            
            {listing.type === 'kayip' && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                KAYIP
              </span>
            )}
            
            {listing.reward && (
              <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                🏅 ₺{listing.reward} Ödül
              </span>
            )}
          </div>

          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm z-20"
          >
            <Heart size={15} className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>

          {/* Bottom: Name, Breed & Shelter */}
          <div className="absolute bottom-3 left-4 right-4 z-20 text-white">
            <h3 className="font-bold text-lg mb-0.5 leading-tight">{listing.name}</h3>
            <p className="text-xs text-white/85">
              {listing.breed} • {listing.animalType === 'kopek' ? 'Köpek' : listing.animalType === 'kedi' ? 'Kedi' : 'Kuş'}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 flex flex-col flex-1 bg-white">
          {/* Row 1: İlan No + Details */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 px-2 py-0.5 rounded-md font-mono tracking-tight shadow-sm">
              #{String(listing.id).padStart(5, '0')}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <MapPin size={11} />
              <span>{listing.city}</span>
            </div>
          </div>

          {/* Row 2: Age & Gender */}
          <div className="flex items-center gap-2 text-[11px] text-gray-600 font-medium mb-3 flex-wrap">
            <span>{listing.gender === 'erkek' ? '♂ Erkek' : '♀ Dişi'}</span>
            <span className="text-gray-300">•</span>
            <span>{listing.age}</span>
            {listing.type === 'kayip' && (
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = '/ai-danisman/foto-eslestirme';
                }}
                className="flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full hover:bg-violet-100 transition-colors ml-auto"
              >
                <ScanSearch size={9} /> Eşleştir
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="mt-auto" />

          {/* Row 3: Action Buttons */}
          <div className="flex gap-2 items-center">
            <button className={`flex-1 ${btnClass} text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors`}>
              {icon}
              {btnText}
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <MessageCircle size={16} />
            </button>
            <div className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
}
