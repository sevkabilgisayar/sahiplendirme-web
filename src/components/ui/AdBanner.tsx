'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

export default function AdBanner({ imageUrl, linkUrl, altText }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 rounded-2xl overflow-hidden shadow-sm group border border-[var(--border)]">
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
        <img 
          src={imageUrl} 
          alt={altText} 
          className="w-full h-auto max-h-32 object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
        />
      </a>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Reklamı Kapat"
      >
        <X size={14} />
      </button>
      <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-sm">
        Reklam
      </span>
    </div>
  );
}
