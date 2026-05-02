'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Tag, Star, Truck, Shield, RefreshCw, Search,
  ChevronLeft, ChevronRight, Flame, Zap, TrendingUp, Percent, Gift, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { mockStoreProducts } from '@/lib/mock-data';

const CATEGORIES = [
  { emoji: '🥩', label: 'Mama & Atıştırmalık', count: 248, color: 'from-red-50 to-orange-50 border-orange-100 hover:border-orange-300' },
  { emoji: '🦮', label: 'Tasma & Gezdirme', count: 134, color: 'from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300' },
  { emoji: '🛏️', label: 'Yatak & Yuva', count: 89, color: 'from-purple-50 to-violet-50 border-purple-100 hover:border-purple-300' },
  { emoji: '🧸', label: 'Oyuncak', count: 176, color: 'from-yellow-50 to-amber-50 border-yellow-100 hover:border-yellow-300' },
  { emoji: '💊', label: 'Sağlık & Vitamin', count: 92, color: 'from-green-50 to-emerald-50 border-green-100 hover:border-green-300' },
  { emoji: '✂️', label: 'Bakım & Tımar', count: 67, color: 'from-pink-50 to-rose-50 border-pink-100 hover:border-pink-300' },
];

const BESTSELLERS = mockStoreProducts.filter(p => p.isBestseller);
const FEATURED = mockStoreProducts.filter(p => p.isFeatured);
const ON_SALE = mockStoreProducts.filter(p => p.isOnSale);
const SLIDER_PRODUCTS = mockStoreProducts.slice(0, 5);

// Vitrin hero ürünleri
const HERO_PRODUCTS = [
  { id: 1, name: 'Royal Canin', subtitle: 'Irka özel formül', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', discount: '%17', price: 289, color: 'from-amber-400 to-orange-500' },
  { id: 3, name: 'Ortopedik Yatak', subtitle: 'Eklem dostları için', photo: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop', discount: '%15', price: 379, color: 'from-violet-500 to-purple-600' },
  { id: 7, name: 'Purina Pro Plan', subtitle: 'Kedi uzmanı mama', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', discount: '%18', price: 319, color: 'from-teal-500 to-emerald-600' },
];

function ProductSlider() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % SLIDER_PRODUCTS.length), 3000);
    return () => clearInterval(t);
  }, []);
  const prev = () => setCurrent(p => (p - 1 + SLIDER_PRODUCTS.length) % SLIDER_PRODUCTS.length);
  const next = () => setCurrent(p => (p + 1) % SLIDER_PRODUCTS.length);
  const product = SLIDER_PRODUCTS[current];
  return (
    <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 h-full min-h-[160px]">
      <Link href={`/magaza/${product.id}`} className="p-5 h-full flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer">
        <div className="w-20 h-20 flex-shrink-0 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
          <img src={product.photo} alt={product.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
        </div>
        <div className="flex-1 min-w-0">
          {product.tag && <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full mb-2 inline-block">{product.tag}</span>}
          <div className="text-[10px] text-emerald-100 font-medium">{product.brand}</div>
          <div className="font-bold text-white text-sm leading-tight line-clamp-2 mt-0.5">{product.name}</div>
          <div className="flex items-center gap-1 mt-1"><Star size={10} className="text-yellow-300 fill-yellow-300" /><span className="text-[10px] text-white/90">{product.rating} ({product.reviews})</span></div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold text-white">₺{product.price}</span>
            {product.oldPrice && <span className="text-xs line-through text-emerald-200">₺{product.oldPrice}</span>}
          </div>
        </div>
      </Link>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"><ChevronLeft size={14} /></button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"><ChevronRight size={14} /></button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDER_PRODUCTS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all ${i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`} />
        ))}
      </div>
      <div className="absolute top-3 right-3 text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">ÖNE ÇIKAN</div>
    </div>
  );
}

function ProductCard({ product, size = 'normal' }: { product: typeof mockStoreProducts[0]; size?: 'normal' | 'small' }) {
  const [inCart, setInCart] = useState(false);
  return (
    <Link href={`/magaza/${product.id}`} className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group cursor-pointer overflow-hidden ${size === 'small' ? 'p-3' : 'p-4'}`}>
      <div className="relative">
        <div className={`w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform ${size === 'small' ? 'h-24' : 'h-36'}`}>
          <img src={product.photo} alt={product.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
        </div>
        {product.tag && (
          <span className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            product.tag.includes('İndirim') ? 'bg-rose-500 text-white' :
            product.tag === 'Yeni' ? 'bg-blue-500 text-white' :
            'bg-emerald-500 text-white'
          }`}>{product.tag}</span>
        )}
        {product.isBestseller && (
          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-amber-400 text-amber-900 px-1 py-0.5 rounded-md">🔥</span>
        )}
      </div>
      <div className={`text-[10px] text-[var(--foreground-muted)] font-medium ${size === 'small' ? 'mt-2' : 'mt-2'}`}>{product.brand}</div>
      <div className={`font-semibold text-[var(--foreground)] leading-tight line-clamp-2 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>{product.name}</div>
      <div className="flex items-center gap-1 mt-1">
        <Star size={9} className="text-yellow-400 fill-yellow-400" />
        <span className="text-[10px] font-medium">{product.rating}</span>
        <span className="text-[9px] text-[var(--foreground-muted)]">({product.reviews})</span>
      </div>
      <div className="flex items-center gap-2 mt-auto pt-2">
        <span className={`font-bold text-emerald-600 ${size === 'small' ? 'text-sm' : 'text-base'}`}>₺{product.price}</span>
        {product.oldPrice && <span className="text-xs line-through text-[var(--foreground-muted)]">₺{product.oldPrice}</span>}
      </div>
      <button
        onClick={(e) => { 
          e.preventDefault(); 
          setInCart(true); 
          toast.success(`${product.name} sepete eklendi!`);
          setTimeout(() => setInCart(false), 2000); 
        }}
        className={`w-full mt-2 font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${size === 'small' ? 'h-7 text-[11px]' : 'h-9 text-xs'} ${
          inCart ? 'bg-green-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white'
        }`}
      >
        {inCart ? '✓ Eklendi!' : <><Tag size={10} /> Sepete Ekle</>}
      </button>
    </Link>
  );
}

function SectionHeader({ icon, title, subtitle, color }: { icon: React.ReactNode; title: string; subtitle?: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <h2 className="text-xl font-bold font-display">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--foreground-muted)]">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function MagazaPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Pet Mağaza</h1>
              <p className="text-emerald-100 text-sm">Evcil dostların için en iyi ürünler</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Sol: Arama */}
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Ürün ara... (mama, tasma, oyuncak)"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
                />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[{ icon: <Truck size={13}/>, label: '₺150 üzeri ücretsiz kargo' }, { icon: <Shield size={13}/>, label: 'Güvenli alışveriş' }, { icon: <RefreshCw size={13}/>, label: '30 gün iade garantisi' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-100">{item.icon} {item.label}</div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {['🥩 Mama', '🦮 Tasma', '🧸 Oyuncak', '💊 Vitamin', '✂️ Bakım'].map(chip => (
                  <button key={chip} className="text-[11px] font-medium bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full transition-colors border border-white/20">{chip}</button>
                ))}
              </div>
            </div>
            {/* Sağ: Slider */}
            <div className="lg:w-96 flex-shrink-0">
              <ProductSlider />
            </div>
          </div>
        </div>
      </div>

      {/* ── VİTRİN HERO ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SectionHeader icon={<Zap size={18} className="text-white"/>} title="Vitrin Ürünleri" subtitle="Haftanın en beğenilen seçimleri" color="bg-gradient-to-br from-amber-400 to-orange-500" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HERO_PRODUCTS.map(p => (
            <Link href={`/magaza/${p.id}`} key={p.id} className={`bg-gradient-to-br ${p.color} rounded-3xl p-6 text-white flex items-center gap-5 hover:scale-[1.02] transition-transform cursor-pointer shadow-lg overflow-hidden relative`}>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 bg-white rounded-full mix-blend-overlay"></div>
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 flex-shrink-0 z-10">
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
              </div>
              <div className="flex-1 z-10">
                <div className="text-xs font-bold bg-white/25 text-white px-2 py-0.5 rounded-full inline-block mb-2">{p.discount} İndirim</div>
                <div className="font-bold text-lg leading-tight">{p.name}</div>
                <div className="text-white/80 text-xs mt-0.5">{p.subtitle}</div>
                <div className="text-2xl font-bold mt-3">₺{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── KATEGORİLER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <SectionHeader icon={<Gift size={18} className="text-white"/>} title="Kategoriler" color="bg-gradient-to-br from-purple-500 to-violet-600" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <button key={i} className={`flex flex-col items-center gap-2 p-4 bg-[var(--surface)] border rounded-2xl transition-all group ${cat.color}`}>
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-[11px] font-semibold text-[var(--foreground)] text-center leading-tight">{cat.label}</span>
              <span className="text-[9px] text-[var(--foreground-muted)]">{cat.count} ürün</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ÇOK SATANLAR ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <SectionHeader icon={<Flame size={18} className="text-white"/>} title="Çok Satanlar" subtitle="Binlerce kullanıcının tercihi" color="bg-gradient-to-br from-rose-500 to-red-600" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BESTSELLERS.map(p => <ProductCard key={p.id} product={p} size="small" />)}
        </div>
      </div>

      {/* ── İNDİRİMDEKİLER ── */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 border-y border-rose-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <Percent size={18} className="text-white"/>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-rose-700">İndirimdekiler</h2>
                <p className="text-xs text-rose-500">{ON_SALE.length} ürün indirimdeki fırsatlar</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-rose-600 font-medium bg-rose-100 px-3 py-1.5 rounded-full">
              <Clock size={12}/> Sınırlı süre
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ON_SALE.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      {/* ── ÖNE ÇIKAN ÜRÜNLER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader icon={<TrendingUp size={18} className="text-white"/>} title="Öne Çıkan Ürünler" subtitle="Editörün önerdiği seçimler" color="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURED.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── TÜM ÜRÜNLER ── */}
      <div className="bg-[var(--surface-secondary)] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display">Tüm Ürünler</h2>
            <span className="text-xs text-[var(--foreground-muted)]">{mockStoreProducts.length} ürün</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {mockStoreProducts.map(p => <ProductCard key={p.id} product={p} size="small" />)}
          </div>
        </div>
      </div>

      {/* ── FOOTER NOT ── */}
      <div className="py-6 text-center">
        <p className="text-[10px] text-[var(--foreground-muted)]">
          Bu ürünler affiliate ortaklık kapsamında önerilmektedir. sahiplendirme.com, doğrudan ürün satışı yapmamaktadır.
        </p>
      </div>
    </div>
  );
}
