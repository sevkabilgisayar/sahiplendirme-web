'use client';

import { X, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdBannerProps {
  id?: string;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  showPlaceholder?: boolean;
}

export default function AdBanner({ id, imageUrl, linkUrl = '/reklam-ver', altText = 'Reklam', showPlaceholder = true }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Track impression on load
  useEffect(() => {
    if (id && imageUrl) {
      fetch('/api/banners/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerId: id, type: 'impression' })
      }).catch(err => console.error("Banner impression tracking failed", err));
    }
  }, [id, imageUrl]);

  const handleBannerClick = () => {
    if (id && imageUrl) {
      fetch('/api/banners/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerId: id, type: 'click' })
      }).catch(err => console.error("Banner click tracking failed", err));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 rounded-2xl overflow-hidden shadow-sm group">
      {imageUrl ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-auto max-h-32" onClick={handleBannerClick}>
          <img src={imageUrl} alt={altText} className="w-full h-full object-cover rounded-2xl" />
        </a>
      ) : showPlaceholder ? (
        <Link href={linkUrl} className="block w-full border-2 border-dashed border-[var(--border)] rounded-2xl">
          <div className="w-full h-28 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 flex items-center justify-center gap-4 hover:from-orange-50 hover:via-amber-50 hover:to-orange-50 transition-all rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Megaphone size={20} className="text-white" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-[var(--foreground)]">REKLAM ALANI</div>
              <div className="text-xs text-[var(--foreground-muted)]">Hedef kitlenize ulaşın • Bu alana reklam vermek için tıklayın</div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              Reklam Ver →
            </div>
          </div>
        </Link>
      ) : null}

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 w-6 h-6 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Kapat"
      >
        <X size={12} />
      </button>
      <span className="absolute bottom-2 left-2 bg-black/40 text-white text-[9px] px-2 py-0.5 rounded-md">
        Reklam
      </span>
    </div>
  );
}
