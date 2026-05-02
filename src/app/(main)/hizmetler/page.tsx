'use client';

import { useState, useMemo } from 'react';
import { Star, MapPin, Search, Filter, ChevronDown, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CITIES, SERVICE_CATEGORIES } from '@/constants';

const mockServices = [
  { id: '1', category: 'veteriner', name: 'VetLife Veteriner Kliniği', city: 'İstanbul', district: 'Kadıköy', rating: 4.9, reviews: 128, verified: true, tags: ['7/24 Acil', 'Ameliyat', 'Röntgen'], price: '200-800₺', emoji: '🩺', color: 'from-blue-100 to-indigo-200' },
  { id: '2', category: 'kuafor', name: 'PawSpa Pet Kuaför', city: 'İstanbul', district: 'Beşiktaş', rating: 4.7, reviews: 85, verified: true, tags: ['Banyo', 'Tıraş', 'Tırnak'], price: '150-400₺', emoji: '✂️', color: 'from-pink-100 to-rose-200' },
  { id: '3', category: 'egitmen', name: 'K9 Köpek Eğitim Merkezi', city: 'Ankara', district: 'Çankaya', rating: 4.8, reviews: 62, verified: true, tags: ['Temel Eğitim', 'Sosyalleşme', 'Terapist'], price: '300-1200₺', emoji: '🎓', color: 'from-green-100 to-emerald-200' },
  { id: '4', category: 'pet-otel', name: 'Pamuklu Pet Hotel', city: 'İzmir', district: 'Bornova', rating: 4.6, reviews: 43, verified: false, tags: ['Konaklama', 'Oyun Alanı', 'CCTV'], price: '150-350₺/gece', emoji: '🏨', color: 'from-purple-100 to-violet-200' },
  { id: '5', category: 'gezdirici', name: 'Köpek Gezdirme İstanbul', city: 'İstanbul', district: 'Şişli', rating: 4.5, reviews: 34, verified: true, tags: ['Günlük Gezdirme', 'Grup/Tekil'], price: '100-200₺/gün', emoji: '🦮', color: 'from-amber-100 to-yellow-200' },
  { id: '6', category: 'veteriner', name: 'ZooCare Veteriner', city: 'Ankara', district: 'Kızılay', rating: 4.4, reviews: 97, verified: true, tags: ['Aşılama', 'Muayene', 'Diş Bakımı'], price: '100-600₺', emoji: '🩺', color: 'from-cyan-100 to-sky-200' },
  { id: '7', category: 'kuafor', name: 'Happy Paws Grooming', city: 'İzmir', district: 'Konak', rating: 4.8, reviews: 55, verified: true, tags: ['Tam Bakım', 'Kedi Uzmanı'], price: '120-350₺', emoji: '✂️', color: 'from-fuchsia-100 to-pink-200' },
  { id: '8', category: 'egitmen', name: 'Evde Köpek Eğitimi', city: 'İstanbul', district: 'Ataşehir', rating: 4.9, reviews: 18, verified: false, tags: ['Evde Eğitim', 'Online Danışmanlık'], price: '500₺/seans', emoji: '🎓', color: 'from-lime-100 to-green-200' },
  { id: '9', category: 'pet-otel', name: 'Büyükada Pet Resort', city: 'İstanbul', district: 'Adalar', rating: 4.7, reviews: 29, verified: true, tags: ['Ada Ortamı', 'Doğal Ortam', 'VIP'], price: '400-600₺/gece', emoji: '🏨', color: 'from-blue-50 to-teal-200' },
];

export default function HizmetlerPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = search || selectedCategory || selectedCity;

  const filtered = useMemo(() => {
    let result = [...mockServices];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) result = result.filter(s => s.category === selectedCategory);
    if (selectedCity) result = result.filter(s => s.city === selectedCity);
    return result;
  }, [search, selectedCategory, selectedCity]);

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-pink-50 border-b border-[var(--border)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ⭐ Onaylı Uzmanlar
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Can Dostunuz İçin <span className="text-gradient">En İyi Hizmet</span>
          </h1>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto mb-8">
            Veteriner, grooming, eğitmen, pet otel ve gezdirici — Sahiplendirme.com güvencesiyle onaylı profesyoneller.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                placeholder="Hizmet, konum veya klinik adı ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-[var(--border)] bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                  <X size={16} />
                </button>
              )}
            </div>
            <Button variant="gradient" size="lg" className="h-14 px-6 shadow-brand">
              Ara
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
              !selectedCategory
                ? 'gradient-brand text-white border-transparent shadow-brand'
                : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--brand-primary-light)] bg-white'
            }`}
          >
            Tüm Hizmetler
          </button>
          {SERVICE_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                selectedCategory === cat.value
                  ? 'gradient-brand text-white border-transparent shadow-brand'
                  : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--brand-primary-light)] bg-white'
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}

          {/* City Filter */}
          <div className="relative ml-auto">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="h-11 pl-8 pr-8 appearance-none rounded-full border-2 border-[var(--border)] bg-white text-sm font-semibold focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer"
            >
              <option value="">Tüm Şehirler</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--foreground-muted)]">
            <strong className="text-[var(--foreground)]">{filtered.length}</strong> hizmet sağlayıcı bulundu
            {selectedCategory && <> · <span className="text-[var(--brand-primary)] font-semibold">{SERVICE_CATEGORIES.find(c => c.value === selectedCategory)?.label}</span></>}
          </p>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCity(''); }}
              className="text-xs text-red-500 hover:underline font-medium">
              Filtreleri Temizle
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(service => (
              <Link key={service.id} href={`/hizmetler/${service.id}`}>
                <Card className="p-6 hover:border-[var(--brand-primary-light)] hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      {service.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-base leading-tight line-clamp-2">{service.name}</h3>
                        {service.verified && (
                          <CheckCircle size={16} className="text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                        <MapPin size={13} className="flex-shrink-0" />
                        {service.district}, {service.city}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                      <Star size={14} className="fill-orange-500" />
                      {service.rating}
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)]">{service.reviews} değerlendirme</span>
                    <span className="text-xs text-green-600 font-semibold ml-auto">{service.price}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold bg-[var(--surface-secondary)] text-[var(--foreground-muted)] px-2 py-1 rounded-full border border-[var(--border)]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Category badge */}
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs text-[var(--brand-primary)] font-bold uppercase tracking-wider">
                      {SERVICE_CATEGORIES.find(c => c.value === service.category)?.emoji}{' '}
                      {SERVICE_CATEGORIES.find(c => c.value === service.category)?.label}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)] group-hover:text-[var(--brand-primary)] transition-colors font-medium">
                      Profili Gör →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold font-display mb-2">Hizmet bulunamadı</h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4">Farklı filtre veya şehir deneyin.</p>
            <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCity(''); }}>
              Filtreleri Temizle
            </Button>
          </div>
        )}

        {/* CTA — Be a professional */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-3">Siz de Hizmet Verebilirsiniz</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Veteriner, groomer, eğitmen veya pet otel olarak platformumuza katılın. Binlerce hayvan sever sizinle buluşsun.</p>
          <Link href="/register">
            <Button variant="outline" size="lg" className="bg-white text-orange-500 border-white hover:bg-orange-50 font-bold">
              Profesyonel Hesap Oluştur
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
