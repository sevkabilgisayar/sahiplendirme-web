'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, MapPin, ScanSearch, Eye, MessageCircle, ArrowRight, Shield, User, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
}

let cachedFavorites: string[] | null = null;
let fetchingPromise: Promise<string[]> | null = null;

function fetchFavorites() {
  if (cachedFavorites) return Promise.resolve(cachedFavorites);
  if (fetchingPromise) return fetchingPromise;
  fetchingPromise = fetch('/api/favorites').then(r => r.json()).then(d => {
    if (d.success) {
      cachedFavorites = (d.listings || []).map((l: any) => l.id);
      return cachedFavorites as string[];
    }
    return [] as string[];
  }).catch(() => {
    return [] as string[];
  });
  return fetchingPromise;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchFavorites().then(favs => {
      setIsFav(favs.includes(listing.id));
    });
  }, [listing.id]);

  const handleFav = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favLoading) return;
    setFavLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFav(data.action === 'added');
      } else if (res.status === 401) {
        alert('Favorilere eklemek için giriş yapmalısınız.');
      }
    } catch {
      console.error('Favorite error');
    } finally {
      setFavLoading(false);
    }
  };

  const isSahibinde = listing.user?.accountType !== 'barinak';

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
  } else if (listing.type === 'diger') {
    btnClass = 'bg-slate-500 hover:bg-slate-600';
    borderClass = 'hover:border-slate-500 border-gray-200';
    btnText = 'İncele';
  }

  let parsedPhotos: string[] = [];
  try {
    if (typeof listing.photos === 'string') {
      parsedPhotos = JSON.parse(listing.photos);
      if (typeof parsedPhotos === 'string') {
        parsedPhotos = JSON.parse(parsedPhotos);
      }
    } else if (Array.isArray(listing.photos)) {
      parsedPhotos = listing.photos;
    }
  } catch (e) {
    parsedPhotos = [];
  }

  // Auto slide on hover
  useEffect(() => {
    if (isHovered && parsedPhotos.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % parsedPhotos.length);
      }, 1500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, parsedPhotos.length]);

  const handleNextPhoto = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (parsedPhotos.length > 1) setActiveImage((prev) => (prev + 1) % parsedPhotos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (parsedPhotos.length > 1) setActiveImage((prev) => (prev - 1 + parsedPhotos.length) % parsedPhotos.length);
  };

  const coverPhoto = parsedPhotos && parsedPhotos.length > 0 ? parsedPhotos[activeImage] : null;
  const shortId = String(listing.id).split('-')[0].toUpperCase();
  const displayName = listing.title || listing.name || 'İsimsiz Can Dostu';

  return (
    <Link href={`/ilan/${listing.id}`} className="group block h-full">
      <div className={`bg-white h-full flex flex-col rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${borderClass} overflow-hidden`}>

        {/* Image Area */}
        <div
          className="relative aspect-square w-full overflow-hidden shrink-0 bg-slate-100 group/image"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setActiveImage(0); // reset when not hovered
          }}
          onTouchStart={() => setIsHovered(true)}
        >
          {coverPhoto ? (
            <img
              src={coverPhoto}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-700"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200`}>
              <span className="text-7xl">🐾</span>
            </div>
          )}

          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Pagination Dots & Navigation Arrows */}
          {parsedPhotos.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevPhoto}
                onTouchEnd={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity z-30 hover:bg-white/40"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextPhoto}
                onTouchEnd={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity z-30 hover:bg-white/40"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                {parsedPhotos.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImage ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50'}`} />
                ))}
              </div>
            </>
          )}

          {/* Top Left: Owner Type Badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20 pointer-events-none">
            <span className={`text-[9px] font-extrabold tracking-wide px-2 py-0.5 rounded flex items-center gap-1 shadow-sm backdrop-blur-md ${!isSahibinde ? 'bg-emerald-500/90 text-white' : 'bg-white/70 text-gray-800'
              }`}>
              {!isSahibinde ? <Building2 size={10} strokeWidth={2.5} /> : <User size={10} strokeWidth={2.5} />}
              {!isSahibinde ? `BARINAKTA (${listing.user?.firstName || 'Barınak'})` : 'BİREYSEL İLAN'}
            </span>

            {listing.type === 'kayip' && (
              <span className="bg-red-500/90 backdrop-blur-md text-white text-[9px] font-extrabold tracking-wide px-2 py-0.5 rounded shadow-sm w-fit">
                KAYIP
              </span>
            )}

            {listing.hasReward && listing.rewardAmount && (
              <span className="bg-yellow-400/90 backdrop-blur-md text-yellow-900 text-[9px] font-extrabold tracking-wide px-2 py-0.5 rounded shadow-sm w-fit">
                🏅 ₺{listing.rewardAmount}
              </span>
            )}
          </div>

          {/* Heart Icon */}
          <button
            onClick={handleFav}
            onTouchEnd={handleFav}
            className={`absolute top-2 right-2 w-7 h-7 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-sm z-30 ${isFav ? 'bg-red-50/90 text-red-500 hover:bg-red-100' : 'bg-white/70 text-gray-500 hover:bg-white hover:text-red-500'}`}
          >
            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} className="transition-colors" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3 flex flex-col flex-1 bg-white">
          {/* Title and Breed */}
          <div className="mb-2">
            <h3 className="font-bold text-[15px] mb-0.5 leading-tight text-gray-900 truncate" title={displayName}>{displayName}</h3>
            <p className="text-xs text-gray-500 truncate">
              {listing.breed} • {listing.animalType === 'kopek' ? 'Köpek' : listing.animalType === 'kedi' ? 'Kedi' : listing.animalType === 'kus' ? 'Kuş' : 'Diğer'}
            </p>
          </div>

          {/* Details: Gender, Age, City */}
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center text-[11px] text-gray-600 font-medium mb-3">
            <div className="flex items-center gap-2">
              <span>{listing.gender === 'erkek' ? '♂ Erkek' : '♀ Dişi'}</span>
              <span className="text-gray-300">•</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="truncate max-w-[80px]">{listing.age.replace('Yıl', 'Yaşında')}</span>
              <span className="text-gray-300">•</span>
            </div>
            <div className="flex items-center gap-0.5 min-w-0">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate max-w-[80px]">{listing.city}</span>
            </div>
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
          <div className="flex gap-1.5 items-center">
            <button className={`flex-1 ${btnClass} text-white text-[11px] sm:text-xs font-bold py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors min-w-0`}>
              {icon}
              <span className="truncate">{btnText}</span>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors shrink-0"
            >
              <MessageCircle size={15} />
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}
