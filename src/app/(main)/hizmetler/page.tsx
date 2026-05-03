'use client';

import { useState, useMemo } from 'react';
import { Star, MapPin, Search, ChevronDown, CheckCircle, X, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdBanner from '@/components/ui/AdBanner';
import { CITIES, SERVICE_CATEGORIES } from '@/constants';

export const mockServices = [
  { id: '1', category: 'veteriner', name: 'VetLife Veteriner Kliniği', city: 'İstanbul', district: 'Kadıköy', rating: 4.9, reviews: 128, verified: true, featured: true, tags: ['7/24 Acil', 'Ameliyat', 'Röntgen'], price: '200-800₺', emoji: '🩺', color: 'from-blue-100 to-indigo-200', about: '10 yılı aşkın tecrübemizle 7/24 hizmetinizdeyiz.' },
  { id: '2', category: 'kuafor', name: 'PawSpa Pet Kuaför', city: 'İstanbul', district: 'Beşiktaş', rating: 4.7, reviews: 85, verified: true, featured: true, tags: ['Banyo', 'Tıraş', 'Tırnak'], price: '150-400₺', emoji: '✂️', color: 'from-pink-100 to-rose-200', about: 'Premium grooming hizmetleri.' },
  { id: '3', category: 'egitmen', name: 'K9 Köpek Eğitim Merkezi', city: 'Ankara', district: 'Çankaya', rating: 4.8, reviews: 62, verified: true, featured: false, tags: ['Temel Eğitim', 'Sosyalleşme'], price: '300-1200₺', emoji: '🎓', color: 'from-green-100 to-emerald-200', about: 'Pozitif pekiştirme ile eğitim.' },
  { id: '4', category: 'pet-otel', name: 'Pamuklu Pet Hotel', city: 'İzmir', district: 'Bornova', rating: 4.6, reviews: 43, verified: false, featured: true, tags: ['Konaklama', 'Oyun Alanı', 'CCTV'], price: '150-350₺/gece', emoji: '🏨', color: 'from-purple-100 to-violet-200', about: 'Ev konforu ve CCTV güvencesi.' },
  { id: '5', category: 'gezdirici', name: 'Köpek Gezdirme İstanbul', city: 'İstanbul', district: 'Şişli', rating: 4.5, reviews: 34, verified: true, featured: false, tags: ['Günlük Gezdirme', 'Grup/Tekil'], price: '100-200₺/gün', emoji: '🦮', color: 'from-amber-100 to-yellow-200', about: 'Sigortalı, eğitimli gezdirici.' },
  { id: '6', category: 'veteriner', name: 'ZooCare Veteriner', city: 'Ankara', district: 'Kızılay', rating: 4.4, reviews: 97, verified: true, featured: false, tags: ['Aşılama', 'Muayene', 'Diş Bakımı'], price: '100-600₺', emoji: '🩺', color: 'from-cyan-100 to-sky-200', about: 'Ekzotik hayvan dahil tüm evcil hayvanlara hizmet.' },
  { id: '7', category: 'kuafor', name: 'Happy Paws Grooming', city: 'İzmir', district: 'Konak', rating: 4.8, reviews: 55, verified: true, featured: true, tags: ['Tam Bakım', 'Kedi Uzmanı'], price: '120-350₺', emoji: '✂️', color: 'from-fuchsia-100 to-pink-200', about: 'Organik ürünlerle tımar.' },
  { id: '8', category: 'egitmen', name: 'Evde Köpek Eğitimi', city: 'İstanbul', district: 'Ataşehir', rating: 4.9, reviews: 18, verified: false, featured: false, tags: ['Evde Eğitim', 'Online Danışmanlık'], price: '500₺/seans', emoji: '🎓', color: 'from-lime-100 to-green-200', about: 'Evinize gelerek özel eğitim.' },
  { id: '9', category: 'pet-otel', name: 'Büyükada Pet Resort', city: 'İstanbul', district: 'Adalar', rating: 4.7, reviews: 29, verified: true, featured: true, tags: ['Ada Ortamı', 'VIP'], price: '400-600₺/gece', emoji: '🏨', color: 'from-blue-50 to-teal-200', about: 'VIP konaklama deneyimi.' },
  { id: '10', category: 'gezdirici', name: 'PetWalk Ankara', city: 'Ankara', district: 'Mamak', rating: 4.3, reviews: 21, verified: true, featured: false, tags: ['Sabah/Akşam', 'GPS Takip'], price: '80-150₺/gün', emoji: '🦮', color: 'from-yellow-100 to-lime-100', about: 'GPS takipli güvenli gezdirme.' },
];

export default function HizmetlerPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

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
      <div className="bg-gradient-to-br from-orange-50 via-white to-pink-50 border-b border-[var(--border)] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              ⭐ Onaylı Uzmanlar · Doğrulanmış İşletmeler
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-display mb-3">
              Can Dostunuz İçin <span className="text-gradient">En İyi Uzman</span>
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Veteriner, groomer, eğitmen, pet otel ve gezdirici — Sahiplendirme.com güvencesiyle onaylı profesyoneller.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                placeholder="Hizmet, konum veya işletme ara..."
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
            <Button variant="gradient" size="lg" className="h-14 px-6 shadow-brand">Ara</Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedCategory('')}
              className={`flex items-center gap-2 py-2.5 px-5 rounded-full border-2 font-semibold text-sm transition-all ${
                !selectedCategory ? 'gradient-brand text-white border-transparent shadow-brand' : 'border-[var(--border)] bg-white hover:border-[var(--brand-primary-light)]'
              }`}
            >
              🌟 Tümü
            </button>
            {SERVICE_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)}
                className={`flex items-center gap-2 py-2.5 px-5 rounded-full border-2 font-semibold text-sm transition-all ${
                  selectedCategory === cat.value
                    ? 'gradient-brand text-white border-transparent shadow-brand scale-105'
                    : 'border-[var(--border)] bg-white hover:border-[var(--brand-primary-light)]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters + Count row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {selectedCategory && (
              <button onClick={() => setSelectedCategory('')} className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                {SERVICE_CATEGORIES.find(c => c.value === selectedCategory)?.emoji}{' '}
                {SERVICE_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                <X size={13} />
              </button>
            )}
            <p className="text-sm text-[var(--foreground-muted)]">
              <strong className="text-[var(--foreground)]">{filtered.length}</strong> uzman bulundu
            </p>
            {hasFilters && (
              <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCity(''); }} className="text-xs text-red-500 hover:underline font-medium">
                Filtreleri Temizle
              </button>
            )}
          </div>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="h-10 pl-8 pr-8 appearance-none rounded-full border-2 border-[var(--border)] bg-white text-sm font-semibold focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer">
              <option value="">Tüm Şehirler</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
          </div>
        </div>

        {/* Grid with Ad Banner after 3rd item */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service, idx) => (
              <>
                <Link key={service.id} href={`/hizmetler/${service.id}`}>
                  <Card className={`p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full border-2 ${service.featured ? 'border-orange-200 hover:border-orange-400' : 'border-[var(--border)] hover:border-[var(--brand-primary-light)]'}`}>
                    {service.featured && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full w-fit mb-3">
                        ⭐ Öne Çıkan
                      </div>
                    )}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                        {service.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <h3 className="font-bold text-base leading-tight line-clamp-1">{service.name}</h3>
                          {service.verified && <CheckCircle size={15} className="text-blue-500 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                          <MapPin size={11} className="flex-shrink-0" />
                          {service.district}, {service.city}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-0.5 text-orange-500 font-bold text-xs">
                            <Star size={11} className="fill-orange-500" />
                            {service.rating}
                          </div>
                          <span className="text-[10px] text-[var(--foreground-muted)]">({service.reviews})</span>
                          <span className="text-xs text-emerald-600 font-semibold ml-auto">{service.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold bg-[var(--surface-secondary)] text-[var(--foreground-muted)] px-2 py-1 rounded-full border border-[var(--border)]">{tag}</span>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="text-xs text-[var(--brand-primary)] font-bold uppercase tracking-wider">
                        {SERVICE_CATEGORIES.find(c => c.value === service.category)?.emoji}{' '}
                        {SERVICE_CATEGORIES.find(c => c.value === service.category)?.label}
                      </span>
                      <span className="text-xs text-[var(--foreground-muted)] group-hover:text-[var(--brand-primary)] transition-colors font-medium flex items-center gap-0.5">
                        Profili Gör <ArrowRight size={12} />
                      </span>
                    </div>
                  </Card>
                </Link>
                {(idx + 1) % 3 === 0 && idx !== filtered.length - 1 && (
                  <div key={`ad-${idx}`} className="sm:col-span-2 lg:col-span-3">
                    <AdBanner imageUrl="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop" linkUrl="#" altText="Reklam Alanı" />
                  </div>
                )}
              </>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold font-display mb-2">Hizmet bulunamadı</h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4">Farklı filtre veya şehir deneyin.</p>
            <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCity(''); }}>Filtreleri Temizle</Button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-100 rounded-3xl p-8 sm:p-12 text-center">
          <div className="text-4xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold font-display mb-3">Hizmet mi vermek istiyorsunuz?</h2>
          <p className="text-[var(--foreground-muted)] max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Veteriner, groomer, eğitmen, pet otel veya gezdirici olarak platforma katılın. Üyelik planlarımızı inceleyin, binlerce hayvan severin karşısına çıkın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button variant="gradient" size="lg" rightIcon={<ArrowRight size={16} />}>Hemen Üye Ol</Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--foreground-muted)] mt-6">
            <div className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> Güvenli Ödeme</div>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-blue-500" /> İstediğin Zaman İptal</div>
            <div className="flex items-center gap-1.5"><Zap size={14} className="text-orange-500" /> 5 Dakikada Aktif</div>
          </div>
        </div>
      </div>
    </div>
  );
}
