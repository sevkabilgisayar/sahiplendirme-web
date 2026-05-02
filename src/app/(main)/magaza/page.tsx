'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Tag, Star, Truck, Shield, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { emoji: '🥩', label: 'Mama & Atıştırmalık', count: 248 },
  { emoji: '🦮', label: 'Tasma & Gezdirme', count: 134 },
  { emoji: '🛏️', label: 'Yatak & Yuva', count: 89 },
  { emoji: '🧸', label: 'Oyuncak', count: 176 },
  { emoji: '💊', label: 'Sağlık & Vitamin', count: 92 },
  { emoji: '✂️', label: 'Bakım & Tımar', count: 67 },
];

const PRODUCTS = [
  { id: 1, name: 'Royal Canin Medium Adult', brand: 'Royal Canin', price: 289, oldPrice: 350, img: '🥩', tag: '%17 İndirim', rating: 4.8, reviews: 324 },
  { id: 2, name: 'Flexi Otomatik Tasma 5m', brand: 'Flexi', price: 199, oldPrice: 249, img: '🦮', tag: '%20 İndirim', rating: 4.6, reviews: 187 },
  { id: 3, name: 'ComfyPet Ortopedik Yatak', brand: 'ComfyPet', price: 379, oldPrice: 450, img: '🛏️', tag: '%15 İndirim', rating: 4.9, reviews: 412 },
  { id: 4, name: 'Kong Extreme Oyuncak', brand: 'Kong', price: 149, oldPrice: null, img: '🧸', tag: 'Yeni', rating: 4.7, reviews: 98 },
  { id: 5, name: 'NutriVet Eklem Vitamini', brand: 'NutriVet', price: 89, oldPrice: null, img: '💊', tag: '', rating: 4.5, reviews: 203 },
  { id: 6, name: 'Trixie Tüy Fırçası Pro', brand: 'Trixie', price: 129, oldPrice: 159, img: '✂️', tag: '%19 İndirim', rating: 4.4, reviews: 76 },
  { id: 7, name: 'Purina Pro Plan Kedi', brand: 'Purina', price: 319, oldPrice: 389, img: '🐱', tag: '%18 İndirim', rating: 4.8, reviews: 511 },
  { id: 8, name: 'PetSafe Otomatik Besleyici', brand: 'PetSafe', price: 599, oldPrice: 749, img: '🍽️', tag: '%20 İndirim', rating: 4.6, reviews: 143 },
  { id: 9, name: 'Kuş Kafesi Deluxe', brand: 'PetHouse', price: 849, oldPrice: null, img: '🐦', tag: 'Yeni', rating: 4.3, reviews: 34 },
  { id: 10, name: "Hill's Science Plan", brand: "Hill's", price: 459, oldPrice: 529, img: '🥩', tag: '%13 İndirim', rating: 4.9, reviews: 678 },
];

// İlk 5 ürün slider için öne çıkan olarak seçildi
const FEATURED_SLIDER = PRODUCTS.slice(0, 5);

function ProductSlider() {
  const [current, setCurrent] = useState(0);

  // 3 saniyede bir otomatik geç
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % FEATURED_SLIDER.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(p => (p - 1 + FEATURED_SLIDER.length) % FEATURED_SLIDER.length);
  const next = () => setCurrent(p => (p + 1) % FEATURED_SLIDER.length);
  const product = FEATURED_SLIDER[current];

  return (
    <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 h-full min-h-[160px]">
      {/* Slide içerik */}
      <div className="p-5 h-full flex items-center gap-4">
        {/* Emoji büyük */}
        <div className="w-20 h-20 flex-shrink-0 bg-white/20 rounded-2xl flex items-center justify-center text-5xl">
          {product.img}
        </div>
        {/* Bilgi */}
        <div className="flex-1 min-w-0">
          {product.tag && (
            <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full mb-2 inline-block">
              {product.tag}
            </span>
          )}
          <div className="text-[10px] text-emerald-100 font-medium">{product.brand}</div>
          <div className="font-bold text-white text-sm leading-tight line-clamp-2 mt-0.5">{product.name}</div>
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="text-yellow-300 fill-yellow-300" />
            <span className="text-[10px] text-white/90">{product.rating} ({product.reviews})</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold text-white">₺{product.price}</span>
            {product.oldPrice && (
              <span className="text-xs line-through text-emerald-200">₺{product.oldPrice}</span>
            )}
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronLeft size={14} />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronRight size={14} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {FEATURED_SLIDER.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
          />
        ))}
      </div>

      {/* Label */}
      <div className="absolute top-3 right-3 text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
        ÖNE ÇIKAN
      </div>
    </div>
  );
}

export default function MagazaPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Başlık */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Pet Mağaza</h1>
              <p className="text-emerald-100 text-sm">Evcil dostların için en iyi ürünler</p>
            </div>
          </div>

          {/* İki sütun: Sol - Arama | Sağ - Slider */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Sol: Arama + Güvenceler */}
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ürün ara... (mama, tasma, oyuncak)"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
                />
              </div>

              {/* Güvenceler */}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { icon: <Truck size={13} />, label: '₺150 üzeri ücretsiz kargo' },
                  { icon: <Shield size={13} />, label: 'Güvenli alışveriş' },
                  { icon: <RefreshCw size={13} />, label: '30 gün iade garantisi' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-100">
                    {item.icon} {item.label}
                  </div>
                ))}
              </div>

              {/* Hızlı kategori chips */}
              <div className="flex flex-wrap gap-2">
                {['🥩 Mama', '🦮 Tasma', '🧸 Oyuncak', '💊 Vitamin', '✂️ Bakım'].map(chip => (
                  <button key={chip} className="text-[11px] font-medium bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full transition-colors border border-white/20">
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Sağ: Ürün Slider */}
            <div className="lg:w-96 flex-shrink-0">
              <ProductSlider />
            </div>
          </div>
        </div>
      </div>

      {/* Kategoriler */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold font-display mb-5">Kategoriler</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <button key={i} className="flex flex-col items-center gap-2 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-emerald-400 hover:shadow-md transition-all group">
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-[11px] font-semibold text-[var(--foreground)] text-center leading-tight">{cat.label}</span>
              <span className="text-[9px] text-[var(--foreground-muted)]">{cat.count} ürün</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ürünler */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold font-display">Öne Çıkan Ürünler</h2>
          <span className="text-xs text-[var(--foreground-muted)]">{PRODUCTS.length} ürün</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer">
              <div className="relative">
                <div className="w-full h-28 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                  {product.img}
                </div>
                {product.tag && (
                  <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500 text-white">{product.tag}</span>
                )}
              </div>
              <div className="text-[10px] text-[var(--foreground-muted)] font-medium">{product.brand}</div>
              <div className="text-sm font-semibold text-[var(--foreground)] leading-tight line-clamp-2">{product.name}</div>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-medium text-[var(--foreground)]">{product.rating}</span>
                <span className="text-[9px] text-[var(--foreground-muted)]">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-sm font-bold text-emerald-600">₺{product.price}</span>
                {product.oldPrice && <span className="text-xs line-through text-[var(--foreground-muted)]">₺{product.oldPrice}</span>}
              </div>
              <button className="w-full h-8 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-1">
                <Tag size={11} /> Sepete Ekle
              </button>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-[var(--foreground-muted)] text-center mt-6">
          Bu ürünler affiliate ortaklık kapsamında önerilmektedir. sahiplendirme.com, doğrudan ürün satışı yapmamaktadır.
        </p>
      </div>
    </div>
  );
}
