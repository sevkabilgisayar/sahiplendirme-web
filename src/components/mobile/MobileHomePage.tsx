'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Heart, MapPin, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const quickCategories = [
  { href: '/ilanlar?kategori=sahiplendirme&tur=kopek', emoji: '🐶', label: 'Köpek', color: 'from-amber-400 to-orange-400', bg: 'bg-amber-50' },
  { href: '/ilanlar?kategori=sahiplendirme&tur=kedi', emoji: '🐱', label: 'Kedi', color: 'from-pink-400 to-rose-400', bg: 'bg-pink-50' },
  { href: '/ilanlar?kategori=sahiplendirme&tur=kus', emoji: '🐦', label: 'Kuş', color: 'from-sky-400 to-blue-400', bg: 'bg-sky-50' },
  { href: '/ilanlar?kategori=kayip', emoji: '🔍', label: 'Kayıp', color: 'from-red-400 to-orange-400', bg: 'bg-red-50' },
  { href: '/ilanlar?kategori=ciftlestirme', emoji: '💕', label: 'Çiftleştirme', color: 'from-purple-400 to-pink-400', bg: 'bg-purple-50' },
  { href: '/hizmetler', emoji: '⭐', label: 'Hizmetler', color: 'from-violet-400 to-purple-400', bg: 'bg-violet-50' },
  { href: '/magaza', emoji: '🛍️', label: 'Mağaza', color: 'from-emerald-400 to-teal-400', bg: 'bg-emerald-50' },
  { href: '/barinaklar', emoji: '🏛️', label: 'Barınak', color: 'from-slate-400 to-gray-400', bg: 'bg-slate-50' },
];

const banners = [
  {
    id: 1,
    title: 'Yapay Zeka ile Eşleşme',
    sub: 'Sana özel hayvan bul',
    emoji: '🤖',
    href: '/ai-danisman',
    grad: 'from-violet-600 to-indigo-600',
  },
  {
    id: 2,
    title: 'Fotoğraf Eşleştirme',
    sub: 'Kayıp hayvanını bul',
    emoji: '📸',
    href: '/ai-danisman/foto-eslestirme',
    grad: 'from-pink-500 to-rose-500',
  },
  {
    id: 3,
    title: 'Barınak Haritası',
    sub: 'Yakınındaki barınaklar',
    emoji: '🗺️',
    href: '/barinaklar',
    grad: 'from-emerald-500 to-teal-500',
  },
];



function MobileListingCard({ listing }: { listing: any }) {
  const [liked, setLiked] = useState(false);
  return (
    <Link href={`/ilan/${listing.id}`} className="flex-shrink-0 w-[155px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 block">
      <div className="relative">
        <img
          src={listing.photos?.[0] || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80'}
          alt={listing.name}
          className="w-full h-[110px] object-cover"
        />
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>
      <div className="p-2.5">
        <p className="font-bold text-[13px] text-gray-900 leading-tight truncate">{listing.name}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{listing.breed}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin size={9} className="text-gray-400 flex-shrink-0" />
          <span className="text-[10px] text-gray-400 truncate">{listing.city}</span>
        </div>
        <div className="mt-2 bg-orange-500 text-white text-[11px] font-bold py-1 rounded-lg text-center">
          Sahiplen
        </div>
      </div>
    </Link>
  );
}

function MobileServiceCard({ service }: { service: any }) {
  return (
    <Link href={`/hizmetler/${service.id}`} className="flex-shrink-0 w-[145px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 block">
      <div className={`h-[72px] bg-gradient-to-br ${service.color} flex items-center justify-center`}>
        <span className="text-3xl">{service.emoji}</span>
      </div>
      <div className="p-2.5">
        <p className="font-bold text-[12px] text-gray-900 leading-tight line-clamp-1">{service.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={9} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-semibold text-gray-700">{service.rating}</span>
          <span className="text-[9px] text-gray-400">({service.reviews})</span>
        </div>
        <p className="text-[11px] text-emerald-600 font-bold mt-1">{service.price}</p>
      </div>
    </Link>
  );
}

export default function MobileHomePage() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [adoptionListings, setAdoptionListings] = useState<any[]>([]);
  const [lostListings, setLostListings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/listings?kategori=sahiplendirme').then(r => r.json()).then(d => {
      if (d.success) setAdoptionListings(d.listings.slice(0, 6));
    });
    fetch('/api/listings?kategori=kayip').then(r => r.json()).then(d => {
      if (d.success) setLostListings(d.listings.slice(0, 4));
    });
    fetch('/api/services').then(r => r.json()).then(d => {
      if (d.success) setServices(d.services.slice(0, 5));
    });
    fetch('/api/products').then(r => r.json()).then(d => {
      if (d.success) setStoreProducts(d.products.slice(0, 6));
    });
  }, []);

  return (
    <div className="bg-gray-50 pb-24">
      {/* Quick Category Grid */}
      <section className="px-4 pt-2 pb-4">
        <div className="grid grid-cols-4 gap-2.5">
          {quickCategories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="flex flex-col items-center gap-1.5">
              <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center shadow-sm border border-white`}>
                <span className="text-2xl">{cat.emoji}</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner Carousel */}
      <section className="px-4 mb-5">
        <div className="relative overflow-hidden rounded-2xl">
          {banners.map((b, idx) => (
            <Link
              key={b.id}
              href={b.href}
              className={`${idx === activeBanner ? 'flex' : 'hidden'} bg-gradient-to-r ${b.grad} rounded-2xl p-4 items-center gap-3 shadow-md`}
            >
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {b.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-[15px] leading-tight">{b.title}</p>
                <p className="text-white/80 text-[12px] mt-0.5">{b.sub}</p>
              </div>
              <ArrowRight size={18} className="text-white/80 flex-shrink-0" />
            </Link>
          ))}
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBanner(idx)}
                className={`transition-all duration-200 rounded-full ${idx === activeBanner ? 'w-4 h-1.5 bg-orange-500' : 'w-1.5 h-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="mx-4 mb-5 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {[
            { value: '12K+', label: 'Hayvan', emoji: '🐾' },
            { value: '8.5K', label: 'İlan', emoji: '📋' },
            { value: '45K', label: 'Üye', emoji: '👥' },
            { value: '200+', label: 'Barınak', emoji: '🏛️' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center py-1">
              <span className="text-base leading-none">{s.emoji}</span>
              <span className="font-bold text-[14px] text-gray-900 mt-1">{s.value}</span>
              <span className="text-[9px] text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Adoption */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold text-[15px] text-gray-900">Sahiplendirme</span>
            <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">PREMIUM</span>
          </div>
          <Link href="/ilanlar?kategori=sahiplendirme" className="flex items-center gap-0.5 text-orange-500 text-[12px] font-semibold">
            Tümü <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
          {adoptionListings.map(l => (
            <div key={l.id} className="snap-start">
              <MobileListingCard listing={l} />
            </div>
          ))}
          {/* View all card */}
          <Link href="/ilanlar?kategori=sahiplendirme" className="flex-shrink-0 w-[80px] snap-start">
            <div className="h-full min-h-[200px] bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <ArrowRight size={16} className="text-orange-500" />
              </div>
              <span className="text-[10px] font-bold text-orange-500 text-center px-1">Tümünü Gör</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Lost Animals */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <span className="font-bold text-[15px] text-gray-900">Kayıp İlanları</span>
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">ACİL</span>
          </div>
          <Link href="/ilanlar?kategori=kayip" className="flex items-center gap-0.5 text-orange-500 text-[12px] font-semibold">
            Tümü <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
          {lostListings.map(l => (
            <div key={l.id} className="snap-start">
              <MobileListingCard listing={l} />
            </div>
          ))}
          <Link href="/ilanlar?kategori=kayip" className="flex-shrink-0 w-[80px] snap-start">
            <div className="h-full min-h-[200px] bg-red-50 rounded-2xl border-2 border-dashed border-red-200 flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowRight size={16} className="text-red-500" />
              </div>
              <span className="text-[10px] font-bold text-red-500 text-center px-1">Tümünü Gör</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="font-bold text-[15px] text-gray-900">Hizmetler</span>
            <span className="bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">ONAYLI</span>
          </div>
          <Link href="/hizmetler" className="flex items-center gap-0.5 text-orange-500 text-[12px] font-semibold">
            Tümü <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
          {services.map(s => (
            <div key={s.id} className="snap-start">
              <MobileServiceCard service={s} />
            </div>
          ))}
        </div>
      </section>

      {/* Store Products */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛍️</span>
            <span className="font-bold text-[15px] text-gray-900">Mağaza</span>
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">YENİ</span>
          </div>
          <Link href="/magaza" className="flex items-center gap-0.5 text-orange-500 text-[12px] font-semibold">
            Tümü <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
          {storeProducts.map(p => (
            <Link key={p.id} href={`/magaza/${p.id}`} className="flex-shrink-0 w-[130px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 block">
              <div className="w-full h-[90px] bg-gray-50 flex items-center justify-center overflow-hidden">
                <img src={p.image || p.photo || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80'} alt={p.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
              </div>
              <div className="p-2.5">
                <p className="font-semibold text-[11px] text-gray-900 line-clamp-2 leading-tight">{p.name || p.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={9} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[9px] text-gray-500">{p.rating || '4.8'}</span>
                </div>
                <p className="font-bold text-emerald-600 text-[13px] mt-1">₺{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 mb-4">
        <Link href="/ilan-ver" className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-4 shadow-lg shadow-orange-200">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-[14px]">İlan Ver</p>
            <p className="text-white/80 text-[11px]">Ücretsiz ilan oluştur, hızlıca yayınla</p>
          </div>
          <ArrowRight size={18} className="text-white/80" />
        </Link>
      </section>
    </div>
  );
}
