'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, Star, CheckCircle, Shield, Award, MapPin, Search, UserPlus, Check } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

export default function SaticiProfilePage({ params }: { params: { id: string } }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(12400);

  const handleFollow = () => {
    if (isFollowing) {
      setFollowerCount(prev => prev - 1);
      setIsFollowing(false);
    } else {
      setFollowerCount(prev => prev + 1);
      setIsFollowing(true);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'B';
    return count;
  };

  // Sahte bir satıcı verisi (URL'den alınan ID'ye göre değişebilir normalde)
  const seller = {
    id: params.id,
    name: 'Pati Dünyası',
    rating: 9.8,
    reviews: 1450,
    joined: '2021',
    city: 'İstanbul',
    description: 'Evcil dostlarınız için en taze mamalar ve en kaliteli aksesuarlar Pati Dünyası güvencesiyle sizlerle.',
    cover: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&auto=format&fit=crop',
    logo: 'PD'
  };

  const [sellerProducts, setSellerProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSellerProducts(d.products);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      
      {/* ── KAPAK VE PROFİL ── */}
      <div className="bg-white border-b border-[var(--border)]">
        {/* Kapak Fotoğrafı */}
        <div className="h-48 sm:h-64 md:h-80 w-full relative overflow-hidden bg-emerald-900">
          <img src={seller.cover} alt="Cover" className="w-full h-full object-cover mix-blend-overlay opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Profil Bilgileri (Desktop ve Mobile uyumlu offset) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-24 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
            
            {/* Logo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl p-2 shadow-xl border border-[var(--border)] relative z-10 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                {seller.logo}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Onaylı Mağaza">
                <CheckCircle size={20} />
              </div>
            </div>

            {/* Bilgiler ve Butonlar */}
            <div className="flex-1 text-center sm:text-left mb-2 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
              <div className="text-white sm:text-[var(--foreground)] mt-2 sm:mt-0">
                <h1 className="text-3xl font-bold font-display flex items-center justify-center sm:justify-start gap-2">
                  {seller.name}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm font-medium">
                  {/* Puan */}
                  <div className="flex items-center gap-1.5 bg-green-500 text-white px-2 py-0.5 rounded-lg shadow-sm">
                    <Star size={14} className="fill-white" />
                    <span>{seller.rating}</span>
                  </div>
                  <span className="text-[var(--foreground-muted)]">{seller.reviews} Değerlendirme</span>
                  
                  {/* Takipçi Sayısı */}
                  <span className="text-gray-300 sm:text-[var(--border)]">|</span>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                    <strong className="text-lg">{formatFollowers(followerCount)}</strong> 
                    <span className="text-[var(--foreground-muted)]">Takipçi</span>
                  </div>

                  <span className="text-gray-300 sm:text-[var(--border)]">|</span>
                  <div className="flex items-center gap-1 text-[var(--foreground-muted)]">
                    <MapPin size={14} /> {seller.city}
                  </div>
                </div>
              </div>

              {/* Takip Et Butonu */}
              <div className="flex-shrink-0">
                <button 
                  onClick={handleFollow}
                  className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-sm w-full sm:w-auto ${
                    isFollowing 
                      ? 'bg-gray-100 text-[var(--foreground)] hover:bg-gray-200 border border-[var(--border)]' 
                      : 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-dark)] hover:-translate-y-0.5'
                  }`}
                >
                  {isFollowing ? (
                    <><Check size={20} /> Takip Ediliyor</>
                  ) : (
                    <><UserPlus size={20} /> Takip Et</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── İÇERİK ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sol Kolon (Hakkında) */}
          <div className="lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Store size={20} className="text-[var(--brand-primary)]" /> Mağaza Hakkında
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-6">
                {seller.description}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Shield size={16} /></div>
                  <div className="flex-1">
                    <div className="font-bold text-[var(--foreground)]">Güvenilir Satıcı</div>
                    <div className="text-[10px] text-[var(--foreground-muted)]">Belgeleri onaylandı</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Award size={16} /></div>
                  <div className="flex-1">
                    <div className="font-bold text-[var(--foreground)]">{seller.joined}'den beri üye</div>
                    <div className="text-[10px] text-[var(--foreground-muted)]">Platform rozeti</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon (Ürünler) */}
          <div className="flex-1">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-4 sm:p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-bold font-display">Mağazanın Ürünleri</h2>
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Mağazada ara..." 
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </div>
            </div>

            {/* Ürün Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sellerProducts.map((p, i) => (
                <ProductCard key={`${p.id}-${i}`} product={p} size="small" />
              ))}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
