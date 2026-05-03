'use client';

import { useState, useMemo } from 'react';
import { Star, MapPin, Search, ChevronDown, CheckCircle, X, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdBanner from '@/components/ui/AdBanner';
import { CITIES, SERVICE_CATEGORIES } from '@/constants';

export const mockServices = [
  { id: '1', category: 'veteriner', name: 'VetLife Veteriner Kliniği', city: 'İstanbul', district: 'Kadıköy', rating: 4.9, reviews: 128, verified: true, featured: true, tags: ['7/24 Acil', 'Ameliyat', 'Röntgen'], price: '200-800₺', emoji: '🩺', color: 'from-blue-100 to-indigo-200', about: '10 yılı aşkın tecrübemizle 7/24 hizmetinizdeyiz.', services: ['Muayene', 'Aşı', 'Acil Müdahale'], address: 'Moda Cad. No:1', phone: '0532 123 45 67', web: 'www.vetlife.com.tr', hours: { hafta: '09:00 - 20:00', cumartesi: '10:00 - 18:00', pazar: 'Kapalı' } },
  { id: '2', category: 'kuafor', name: 'PawSpa Pet Kuaför', city: 'İstanbul', district: 'Beşiktaş', rating: 4.7, reviews: 85, verified: true, featured: true, tags: ['Banyo', 'Tıraş', 'Tırnak'], price: '150-400₺', emoji: '✂️', color: 'from-pink-100 to-rose-200', about: 'Premium grooming hizmetleri.', services: ['Banyo', 'Tıraş', 'Tırnak Kesimi'], address: 'Barbaros Bulvarı No:5', phone: '0533 987 65 43', web: 'www.pawspa.com', hours: { hafta: '10:00 - 19:00', cumartesi: '10:00 - 19:00', pazar: '12:00 - 17:00' } },
  { id: '3', category: 'egitmen', name: 'K9 Köpek Eğitim Merkezi', city: 'Ankara', district: 'Çankaya', rating: 4.8, reviews: 62, verified: true, featured: false, tags: ['Temel Eğitim', 'Sosyalleşme'], price: '300-1200₺', emoji: '🎓', color: 'from-green-100 to-emerald-200', about: 'Pozitif pekiştirme ile eğitim.', services: ['Temel İtaat', 'İleri İtaat', 'Sosyalleşme'], address: 'Tunalı Hilmi No:10', phone: '0555 444 33 22', web: 'www.k9ankara.com', hours: { hafta: '08:00 - 18:00', cumartesi: '09:00 - 15:00', pazar: 'Kapalı' } },
  { id: '4', category: 'pet-otel', name: 'Pamuklu Pet Hotel', city: 'İzmir', district: 'Bornova', rating: 4.6, reviews: 43, verified: false, featured: true, tags: ['Konaklama', 'Oyun Alanı', 'CCTV'], price: '150-350₺/gece', emoji: '🏨', color: 'from-purple-100 to-violet-200', about: 'Ev konforu ve CCTV güvencesi.', services: ['Günlük Bakım', 'Konaklama', 'Oyun Alanı'], address: 'Küçükpark Sokak No:3', phone: '0544 333 22 11', web: 'www.pamukluhotel.com', hours: { hafta: '7/24 Açık', cumartesi: '7/24 Açık', pazar: '7/24 Açık' } },
  { id: '5', category: 'gezdirici', name: 'Köpek Gezdirme İstanbul', city: 'İstanbul', district: 'Şişli', rating: 4.5, reviews: 34, verified: true, featured: false, tags: ['Günlük Gezdirme', 'Grup/Tekil'], price: '100-200₺/gün', emoji: '🦮', color: 'from-amber-100 to-yellow-200', about: 'Sigortalı, eğitimli gezdirici.', services: ['Grup Gezdirme', 'Bireysel Gezdirme', 'Ev Ziyareti'], address: 'Büyükdere Cad. No:22', phone: '0505 555 44 33', web: '', hours: { hafta: '07:00 - 21:00', cumartesi: '08:00 - 20:00', pazar: '08:00 - 20:00' } },
  { id: '6', category: 'veteriner', name: 'ZooCare Veteriner', city: 'Ankara', district: 'Kızılay', rating: 4.4, reviews: 97, verified: true, featured: false, tags: ['Aşılama', 'Muayene', 'Diş Bakımı'], price: '100-600₺', emoji: '🩺', color: 'from-cyan-100 to-sky-200', about: 'Ekzotik hayvan dahil tüm evcil hayvanlara hizmet.', services: ['Muayene', 'Aşı', 'Egzotik Hayvan'], address: 'Atatürk Bulvarı No:100', phone: '0312 123 45 67', web: 'www.zoocare.com.tr', hours: { hafta: '09:00 - 19:00', cumartesi: '09:00 - 15:00', pazar: 'Kapalı' } },
  { id: '7', category: 'kuafor', name: 'Happy Paws Grooming', city: 'İzmir', district: 'Konak', rating: 4.8, reviews: 55, verified: true, featured: true, tags: ['Tam Bakım', 'Kedi Uzmanı'], price: '120-350₺', emoji: '✂️', color: 'from-fuchsia-100 to-pink-200', about: 'Organik ürünlerle tımar.', services: ['Tam Bakım', 'Kedi Tıraşı', 'Spa'], address: 'Alsancak Kıbrıs Şehitleri', phone: '0232 987 65 43', web: 'www.happypaws.com', hours: { hafta: '09:30 - 18:30', cumartesi: '10:00 - 18:00', pazar: 'Kapalı' } },
  { id: '8', category: 'egitmen', name: 'Evde Köpek Eğitimi', city: 'İstanbul', district: 'Ataşehir', rating: 4.9, reviews: 18, verified: false, featured: false, tags: ['Evde Eğitim', 'Online Danışmanlık'], price: '500₺/seans', emoji: '🎓', color: 'from-lime-100 to-green-200', about: 'Evinize gelerek özel eğitim.', services: ['Evde Eğitim', 'Online Danışmanlık', 'Davranış Terapisi'], address: 'Ataşehir Bulvarı No:55', phone: '0535 777 88 99', web: '', hours: { hafta: '10:00 - 20:00', cumartesi: '10:00 - 18:00', pazar: '12:00 - 16:00' } },
  { id: '9', category: 'pet-otel', name: 'Büyükada Pet Resort', city: 'İstanbul', district: 'Adalar', rating: 4.7, reviews: 29, verified: true, featured: true, tags: ['Ada Ortamı', 'VIP'], price: '400-600₺/gece', emoji: '🏨', color: 'from-blue-50 to-teal-200', about: 'VIP konaklama deneyimi.', services: ['VIP Oda', 'Geniş Oyun Alanı', 'Transfer'], address: 'Büyükada İskele Meydanı', phone: '0543 222 11 00', web: 'www.ada-petresort.com', hours: { hafta: '7/24 Açık', cumartesi: '7/24 Açık', pazar: '7/24 Açık' } },
  { id: '10', category: 'gezdirici', name: 'PetWalk Ankara', city: 'Ankara', district: 'Mamak', rating: 4.3, reviews: 21, verified: true, featured: false, tags: ['Sabah/Akşam', 'GPS Takip'], price: '80-150₺/gün', emoji: '🦮', color: 'from-yellow-100 to-lime-100', about: 'GPS takipli güvenli gezdirme.', services: ['GPS Takip', 'Günlük Yürüyüş', 'Ev Ziyareti'], address: 'Mamak Merkez No:11', phone: '0555 123 99 88', web: '', hours: { hafta: '06:00 - 22:00', cumartesi: '07:00 - 21:00', pazar: '08:00 - 20:00' } },
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

  // Reklamın tam ortada çıkması için listenin yarısını hesaplıyoruz
  const middleIndex = Math.floor(filtered.length / 2);

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 border-b border-[var(--border)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ⭐ Onaylı Uzmanlar · Güvenilir Hizmetler
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display mb-3">
            Hizmetler <span className="text-gradient">Vitrini</span>
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto">
            Veteriner, groomer, eğitmen, pet otel ve gezdirici — Can dostunuz için en iyi profesyonelleri süzgeçten geçirin ve seçin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ============ SOL SÜZGEÇ (FİLTRELER SIDEBAR) ============ */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
                <h2 className="font-bold font-display text-lg flex items-center gap-2">
                  <Search size={18} className="text-[var(--brand-primary)]" /> Filtrele (Süzgeç)
                </h2>
                {hasFilters && (
                  <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCity(''); }} className="text-xs text-red-500 hover:underline font-medium">
                    Temizle
                  </button>
                )}
              </div>

              {/* Arama */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-2">Kelime ile Ara</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <input
                    type="text"
                    placeholder="Örn: VetLife, Röntgen..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Kategori Seçimi */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-3">Hizmet Türü</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors border border-transparent hover:border-[var(--border)]">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === ''} 
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-[var(--brand-primary)] border-[var(--border)] focus:ring-[var(--brand-primary)]"
                    />
                    <span className="text-sm font-medium">🌟 Tümü</span>
                  </label>
                  {SERVICE_CATEGORIES.map(cat => (
                    <label key={cat.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors border border-transparent hover:border-[var(--border)]">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat.value}
                        checked={selectedCategory === cat.value} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-[var(--brand-primary)] border-[var(--border)] focus:ring-[var(--brand-primary)]"
                      />
                      <span className="text-sm font-medium">{cat.emoji} {cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Şehir Seçimi */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-2">İl Seçimi</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <select 
                    value={selectedCity} 
                    onChange={e => setSelectedCity(e.target.value)} 
                    className="w-full h-10 pl-9 pr-8 appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] cursor-pointer"
                  >
                    <option value="">Tüm Şehirler</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ============ SAĞ İLANLAR LİSTESİ ============ */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Uzman Vitrini</h2>
              <p className="text-sm text-[var(--foreground-muted)] font-medium">
                <strong className="text-[var(--foreground)]">{filtered.length}</strong> ilan bulundu
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-6">
                
                {/* İlk yarıyılı göster */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.slice(0, middleIndex > 0 ? middleIndex : 1).map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>

                {/* ORTAYA REKLAM BANNER'I */}
                {filtered.length > 1 && (
                  <div className="py-4">
                    <AdBanner imageUrl="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop" linkUrl="#" altText="Sponsorlu PetShop" />
                  </div>
                )}

                {/* İkinci yarıyılı göster */}
                {filtered.length > 1 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.slice(middleIndex).map(service => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}

                {/* SONA REKLAM BANNER'I */}
                <div className="pt-8">
                  <AdBanner imageUrl="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=2688&auto=format&fit=crop" linkUrl="#" altText="Veteriner İndirimi" />
                </div>

              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-[var(--border)]">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold font-display mb-2">Kriterlere uygun hizmet bulunamadı</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-4">Farklı bir il, kategori veya arama kelimesi deneyin.</p>
                <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCity(''); }}>Filtreleri Temizle</Button>
              </div>
            )}
          </div>
        </div>

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
        </div>
      </div>
    </div>
  );
}

// Kart tasarımı aynı sayfada tekrarlanan yapı olduğu için ayrı bir bileşene alındı
function ServiceCard({ service }: { service: any }) {
  const categoryData = SERVICE_CATEGORIES.find(c => c.value === service.category);
  return (
    <Link href={`/hizmetler/${service.id}`}>
      <Card className={`p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full border-2 ${service.featured ? 'border-violet-200 hover:border-violet-400' : 'border-[var(--border)] hover:border-[var(--brand-primary-light)]'}`}>
        {service.featured && (
          <div className="flex items-center gap-1 text-[9px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded-full w-fit mb-3">
            ⭐ Öne Çıkan
          </div>
        )}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
            {service.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1 flex-wrap">
              <h3 className="font-bold text-sm leading-tight line-clamp-1">{service.name}</h3>
              {service.verified && <CheckCircle size={13} className="text-blue-500 flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[var(--foreground-muted)]">
              <MapPin size={10} className="flex-shrink-0" />
              {service.district}, {service.city}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-0.5 text-orange-500 font-bold text-[10px]">
                <Star size={10} className="fill-orange-500" />
                {service.rating}
              </div>
              <span className="text-[10px] text-[var(--foreground-muted)]">({service.reviews})</span>
            </div>
          </div>
        </div>
        <div className="text-[11px] text-emerald-600 font-semibold mb-3">{service.price}</div>
        <div className="flex flex-wrap gap-1 mb-3">
          {service.tags.slice(0,2).map((tag: string) => (
            <span key={tag} className="text-[9px] font-semibold bg-[var(--surface-secondary)] text-[var(--foreground-muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">{tag}</span>
          ))}
        </div>
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${categoryData?.color || 'text-[var(--brand-primary)]'}`}>
            {categoryData?.emoji} {categoryData?.label}
          </span>
          <span className="text-[10px] text-[var(--foreground-muted)] group-hover:text-[var(--brand-primary)] transition-colors font-medium flex items-center gap-0.5">
            İncele <ArrowRight size={10} />
          </span>
        </div>
      </Card>
    </Link>
  );
}
