'use client';

import { X, Megaphone } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface AdBannerProps {
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  showPlaceholder?: boolean;
}

export default function AdBanner({ linkUrl = '/paketler', showPlaceholder = true }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 rounded-2xl overflow-hidden shadow-sm border-2 border-dashed border-[var(--border)] group">
      <Link href={linkUrl} className="block w-full">
        <div className="w-full h-28 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 flex items-center justify-center gap-4 hover:from-orange-50 hover:via-amber-50 hover:to-orange-50 transition-all">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Megaphone size={20} className="text-white" />
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--foreground)]">REKLAM ALANI</div>
            <div className="text-xs text-[var(--foreground-muted)]">970 × 90 • Bu alana reklam vermek için tıklayın</div>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
            Reklam Ver →
          </div>
        </div>
      </Link>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 w-6 h-6 bg-black/20 hover:bg-black/50 text-slate-600 hover:text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Kapat"
      >
        <X size={12} />
      </button>
      <span className="absolute bottom-2 left-2 bg-black/20 text-[var(--foreground-muted)] text-[9px] px-2 py-0.5 rounded-md">
        Reklam
      </span>
    </div>
  );
}
