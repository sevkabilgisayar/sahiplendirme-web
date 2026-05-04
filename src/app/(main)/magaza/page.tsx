'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ShoppingBag, Star, Truck, Shield, RefreshCw, Search,
  ChevronDown, ChevronUp, SlidersHorizontal, X
} from 'lucide-react';
import { mockStoreProducts } from '@/lib/mock-data';
import ProductCard from '@/components/ui/ProductCard';
import AdBanner from '@/components/ui/AdBanner';

const duplicateItems = (arr: any[], count: number) => {
  const result: any[] = [];
  while (result.length < count) result.push(...arr.map(a => ({ ...a, id: a.id + Math.random() })));
  return result.slice(0, count);
};

const ALL_PRODUCTS = duplicateItems(mockStoreProducts, 30);

const CATEGORY_FILTERS = [
  { emoji: '🥩', label: 'Mama & Atıştırmalık', count: 248 },
  { emoji: '🦮', label: 'Tasma & Gezdirme', count: 134 },
  { emoji: '🛏️', label: 'Yatak & Yuva', count: 89 },
  { emoji: '🧸', label: 'Oyuncak', count: 176 },
  { emoji: '💊', label: 'Sağlık & Vitamin', count: 92 },
  { emoji: '✂️', label: 'Bakım & Tımar', count: 67 },
];

const BRANDS = ['Royal Canin', 'Purina Pro Plan', 'Hills', 'Brit', 'Josera', 'Farmina'];
const RATINGS = [5, 4, 3, 2];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border)] py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-3">
        <span className="font-bold text-sm text-[var(--foreground)]">{title}</span>
        {open ? <ChevronUp size={16} className="text-[var(--foreground-muted)]" /> : <ChevronDown size={16} className="text-[var(--foreground-muted)]" />}
      </button>
      {open && children}
    </div>
  );
}

export default function MagazaPage() {
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleCat = (label: string) => setSelectedCats(prev => prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]);
  const toggleBrand = (b: string) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const activeFilterCount = selectedCats.length + selectedBrands.length + (minRating > 0 ? 1 : 0) + (onlyDiscount ? 1 : 0) + (freeShipping ? 1 : 0);

  const filtered = ALL_PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (onlyDiscount && !p.isOnSale) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const FilterPanel = () => (
    <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
      {/* Filtre Başlık */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-gray-50">
        <div className="flex items-center gap-2 font-bold text-sm">
          <SlidersHorizontal size={16} className="text-[var(--brand-primary)]" /> Filtrele
        </div>
        {activeFilterCount > 0 && (
          <button onClick={() => { setSelectedCats([]); setSelectedBrands([]); setMinPrice(''); setMaxPrice(''); setMinRating(0); setOnlyDiscount(false); setFreeShipping(false); }} className="text-xs text-rose-500 font-semibold hover:underline">
            Temizle ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="px-4">
        {/* Kategoriler */}
        <FilterSection title="Kategori">
          <div className="space-y-1.5">
            {CATEGORY_FILTERS.map(cat => (
              <label key={cat.label} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={selectedCats.includes(cat.label)} onChange={() => toggleCat(cat.label)}
                  className="w-4 h-4 accent-emerald-500 rounded" />
                <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--brand-primary)] flex-1">{cat.emoji} {cat.label}</span>
                <span className="text-[11px] text-[var(--foreground-muted)]">{cat.count}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Fiyat Aralığı */}
        <FilterSection title="Fiyat Aralığı">
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="Min ₺" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <input type="number" placeholder="Max ₺" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[['0-100', '0', '100'], ['100-250', '100', '250'], ['250-500', '250', '500'], ['500+', '500', '']].map(([label, mn, mx]) => (
              <button key={label} onClick={() => { setMinPrice(mn); setMaxPrice(mx); }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${minPrice === mn && maxPrice === mx ? 'bg-emerald-500 text-white border-emerald-500' : 'border-[var(--border)] hover:border-emerald-400 text-[var(--foreground-muted)]'}`}>
                ₺{label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Marka */}
        <FilterSection title="Marka" defaultOpen={false}>
          <div className="space-y-1.5">
            {BRANDS.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 accent-emerald-500" />
                <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--brand-primary)]">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Değerlendirme */}
        <FilterSection title="Minimum Puan" defaultOpen={false}>
          <div className="space-y-1.5">
            {RATINGS.map(r => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)}
                  className="w-4 h-4 accent-emerald-500" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: r }).map((_, i) => <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />)}
                  {Array.from({ length: 5 - r }).map((_, i) => <Star key={i} size={13} className="text-gray-200 fill-gray-200" />)}
                </div>
                <span className="text-xs text-[var(--foreground-muted)]">ve üzeri</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Diğer */}
        <FilterSection title="Diğer Filtreler" defaultOpen={false}>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={onlyDiscount} onChange={() => setOnlyDiscount(!onlyDiscount)} className="w-4 h-4 accent-emerald-500" />
              <span className="text-sm text-[var(--foreground)]">Sadece İndirimli Ürünler</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={freeShipping} onChange={() => setFreeShipping(!freeShipping)} className="w-4 h-4 accent-emerald-500" />
              <span className="text-sm text-[var(--foreground)]">Ücretsiz Kargo</span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Pet Mağaza</h1>
              <p className="text-emerald-100 text-xs">Evcil dostların için en iyi ürünler</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Ürün ara... (mama, tasma, oyuncak)"
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-white text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm" />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {[{ icon: <Truck size={12} />, label: '₺150+ Ücretsiz Kargo' }, { icon: <Shield size={12} />, label: 'Güvenli Alışveriş' }, { icon: <RefreshCw size={12} />, label: '30 Gün İade' }].map((item, i) => (
                <div key={i} className="flex items-center gap-1 text-xs text-emerald-100">{item.icon} {item.label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── VİTRİNLER (POPÜLER KATEGORİLER) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <h2 className="text-xl font-bold font-display text-[var(--foreground)] mb-4">Popüler Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_FILTERS.map((cat) => (
            <div 
              key={cat.label}
              onClick={() => toggleCat(cat.label)}
              className={cn(
                "bg-white border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 text-center h-[104px]",
                selectedCats.includes(cat.label) 
                  ? "border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)] bg-orange-50/50" 
                  : "border-[var(--border)]"
              )}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-bold text-[var(--foreground)] leading-tight">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">

          {/* Sol Filtre Paneli (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20">
            <FilterPanel />
          </aside>

          {/* Sağ: Ürünler */}
          <div className="flex-1 min-w-0">

            {/* Üst Bar: Sonuç sayısı + Sıralama + Mobil Filtre */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="text-sm text-[var(--foreground-muted)]">
                <span className="font-bold text-[var(--foreground)]">{sorted.length}</span> ürün bulundu
                {activeFilterCount > 0 && <span className="ml-2 text-emerald-600 font-semibold">({activeFilterCount} filtre aktif)</span>}
              </div>
              <div className="flex items-center gap-2">
                {/* Mobil filtre butonu */}
                <button onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[var(--border)] rounded-xl text-sm font-medium bg-white shadow-sm">
                  <SlidersHorizontal size={15} /> Filtrele {activeFilterCount > 0 && <span className="bg-emerald-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>}
                </button>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="border border-[var(--border)] rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  <option value="featured">Önerilen</option>
                  <option value="price-asc">Fiyat: Artan</option>
                  <option value="price-desc">Fiyat: Azalan</option>
                  <option value="rating">En Yüksek Puan</option>
                </select>
              </div>
            </div>

            {/* Aktif Filtre Etiketleri */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCats.map(c => (
                  <span key={c} onClick={() => toggleCat(c)} className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-emerald-100">
                    {c} <X size={12} />
                  </span>
                ))}
                {selectedBrands.map(b => (
                  <span key={b} onClick={() => toggleBrand(b)} className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-blue-100">
                    {b} <X size={12} />
                  </span>
                ))}
                {onlyDiscount && <span onClick={() => setOnlyDiscount(false)} className="flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer">İndirimli <X size={12} /></span>}
                {minRating > 0 && <span onClick={() => setMinRating(0)} className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer">{minRating}★+ <X size={12} /></span>}
              </div>
            )}

            {/* Reklam Alanı */}
            <div className="mb-6"><AdBanner /></div>

            {/* Ürün Grid */}
            {sorted.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {sorted.map(p => <ProductCard key={p.id} product={p} size="small" />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-bold text-lg text-[var(--foreground)] mb-2">Ürün bulunamadı</div>
                <p className="text-[var(--foreground-muted)] text-sm">Filtrelerinizi değiştirerek tekrar deneyin.</p>
              </div>
            )}

            {/* Alt Reklam */}
            <div className="mt-10"><AdBanner /></div>
          </div>
        </div>
      </div>

      {/* Affiliate Notu */}
      <div className="py-6 bg-amber-50 border-y border-amber-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-amber-800">
            Bu ürünler affiliate ortaklık kapsamında önerilmektedir. sahiplendirme.com, doğrudan ürün satışı yapmamaktadır.
          </p>
        </div>
      </div>

      {/* Mobil Filtre Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <span className="font-bold text-lg">Filtrele</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-[var(--border)]">
              <button onClick={() => setMobileFilterOpen(false)} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
                {sorted.length} Ürünü Göster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
