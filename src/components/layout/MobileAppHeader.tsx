'use client';

import { Bell, MapPin, Search, ShoppingCart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function MobileAppHeader() {
  const [city, setCity] = useState('İstanbul');

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-4 py-3">
        {/* Row 1: Logo + Location + Actions */}
        <div className="flex items-center justify-between mb-2.5">
          {/* Logo + Location */}
          <div className="flex items-start flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl">🐾</span>
              <span className="font-bold text-[17px] text-gray-900 tracking-tight">sahiplendirme</span>
            </div>
            <button
              className="flex items-center gap-1 mt-0.5 text-orange-500"
              onClick={() => {}}
            >
              <MapPin size={11} className="flex-shrink-0" />
              <span className="text-[11px] font-semibold">{city}</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="mt-px">
                <path d="M1.5 2.5L4 5L6.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <Link href="/ai-danisman" className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors">
              <Sparkles size={18} />
            </Link>
            <Link href="/bildirimler" className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </Link>
            <Link href="/sepet" className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              <ShoppingCart size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <Link href="/ilanlar" className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 h-10 w-full hover:bg-gray-200 transition-colors">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-400">İlan, hayvan veya hizmet ara...</span>
        </Link>
      </div>
    </header>
  );
}
