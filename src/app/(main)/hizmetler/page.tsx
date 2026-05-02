'use client';

import { useState, useMemo } from 'react';
import { Star, MapPin, Search, ChevronDown, CheckCircle, X, Zap, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CITIES, SERVICE_CATEGORIES } from '@/constants';

export const mockServices = [
  { id: '1', category: 'veteriner', name: 'VetLife Veteriner Kliniği', city: 'İstanbul', district: 'Kadıköy', rating: 4.9, reviews: 128, verified: true, featured: true, tags: ['7/24 Acil', 'Ameliyat', 'Röntgen'], price: '200-800₺', emoji: '🩺', color: 'from-blue-100 to-indigo-200', about: '10 yılı aşkın tecrübemizle 7/24 hizmetinizdeyiz. Tam donanımlı kliniğimizde röntgen, ultrason, laboratuvar ve cerrahi hizmetler.', phone: '0216 123 45 67', web: 'www.vetlife.com.tr', address: 'Moda Cad. No:12 Kadıköy/İstanbul', services: ['Genel Muayene', 'Aşılama', 'Cerrahi', 'Röntgen', 'Diş Bakımı', '7/24 Acil'], hours: { hafta: '09:00–22:00', cumartesi: '10:00–20:00', pazar: 'Acil Vaka' } },
  { id: '2', category: 'kuafor', name: 'PawSpa Pet Kuaför', city: 'İstanbul', district: 'Beşiktaş', rating: 4.7, reviews: 85, verified: true, featured: true, tags: ['Banyo', 'Tıraş', 'Tırnak'], price: '150-400₺', emoji: '✂️', color: 'from-pink-100 to-rose-200', about: 'Evcil hayvanlarınız için premium grooming hizmetleri sunuyoruz. Stres-free ortamda keyifli bakım.', phone: '0212 234 56 78', web: 'www.pawspa.com.tr', address: 'Barbaros Blv. No:45 Beşiktaş/İstanbul', services: ['Tam Bakım Paketi', 'Banyo & Fön', 'Tıraş', 'Tırnak Kesimi', 'Kulak Temizliği'], hours: { hafta: '10:00–20:00', cumartesi: '10:00–19:00', pazar: 'Kapalı' } },
  { id: '3', category: 'egitmen', name: 'K9 Köpek Eğitim Merkezi', city: 'Ankara', district: 'Çankaya', rating: 4.8, reviews: 62, verified: true, featured: false, tags: ['Temel Eğitim', 'Sosyalleşme', 'Terapist'], price: '300-1200₺', emoji: '🎓', color: 'from-green-100 to-emerald-200', about: 'Pozitif pekiştirme yöntemiyle köpeğinizin potansiyelini açıyoruz. Bireysel ve grup seansları.', phone: '0312 345 67 89', web: 'www.k9ankara.com', address: 'Turan Güneş Blv. No:30 Çankaya/Ankara', services: ['Temel İtaat', 'İleri Eğitim', 'Sosyalleşme', 'Köpek Terapisi', 'Online Danışmanlık'], hours: { hafta: '09:00–19:00', cumartesi: '09:00–17:00', pazar: 'Kapalı' } },
  { id: '4', category: 'pet-otel', name: 'Pamuklu Pet Hotel', city: 'İzmir', district: 'Bornova', rating: 4.6, reviews: 43, verified: false, featured: true, tags: ['Konaklama', 'Oyun Alanı', 'CCTV'], price: '150-350₺/gece', emoji: '🏨', color: 'from-purple-100 to-violet-200', about: 'Sevimli dostlarınız için ev konforu. Geniş oyun alanı, CCTV kameralar ve 24 saat bakım hizmeti.', phone: '0232 456 78 90', web: '', address: 'Atatürk Cad. No:88 Bornova/İzmir', services: ['Günlük Bakım', 'Gecelik Konaklama', 'Haftalık Paket', 'Oyun Terapisi', 'Veteriner Kontrolü'], hours: { hafta: '07:00–22:00', cumartesi: '08:00–22:00', pazar: '08:00–20:00' } },
  { id: '5', category: 'gezdirici', name: 'Köpek Gezdirme İstanbul', city: 'İstanbul', district: 'Şişli', rating: 4.5, reviews: 34, verified: true, featured: false, tags: ['Günlük Gezdirme', 'Grup/Tekil'], price: '100-200₺/gün', emoji: '🦮', color: 'from-amber-100 to-yellow-200', about: 'Güvenilir gezdirme hizmeti. Sigortalı, eğitimli ve deneyimli gezdirici ekibimizle her gün yanınızdayız.', phone: '0532 567 89 01', web: '', address: 'Halaskargazi Cad. No:22 Şişli/İstanbul', services: ['Sabah Gezisi', 'Akşam Gezisi', 'Tam Gün', 'Grup Gezisi', 'Özel Bakım'], hours: { hafta: '07:00–21:00', cumartesi: '08:00–20:00', pazar: '09:00–18:00' } },
  { id: '6', category: 'veteriner', name: 'ZooCare Veteriner', city: 'Ankara', district: 'Kızılay', rating: 4.4, reviews: 97, verified: true, featured: false, tags: ['Aşılama', 'Muayene', 'Diş Bakımı'], price: '100-600₺', emoji: '🩺', color: 'from-cyan-100 to-sky-200', about: 'Ankara merkezde konumlanan kliniğimizde ekzotik hayvan dahil tüm evcil hayvanlara hizmet veriyoruz.', phone: '0312 678 90 12', web: 'www.zoocare.com.tr', address: 'Atatürk Blv. No:55 Kızılay/Ankara', services: ['Genel Muayene', 'Aşılama', 'Diş Bakımı', 'Ekzotik Hayvanlar', 'Kan Tahlili'], hours: { hafta: '09:00–20:00', cumartesi: '10:00–17:00', pazar: 'Kapalı' } },
  { id: '7', category: 'kuafor', name: 'Happy Paws Grooming', city: 'İzmir', district: 'Konak', rating: 4.8, reviews: 55, verified: true, featured: true, tags: ['Tam Bakım', 'Kedi Uzmanı'], price: '120-350₺', emoji: '✂️', color: 'from-fuchsia-100 to-pink-200', about: 'Kedi ve köpek tımarında uzman ekibimizle hizmetinizdeyiz. Organik ürünler kullanıyoruz.', phone: '0232 789 01 23', web: 'www.happypaws.com.tr', address: 'Gazi Blv. No:10 Konak/İzmir', services: ['Tam Bakım', 'Kedi Tımarı', 'Köpek Tımarı', 'Organik Banyo', 'Parfümleme'], hours: { hafta: '10:00–20:00', cumartesi: '10:00–19:00', pazar: 'Kapalı' } },
  { id: '8', category: 'egitmen', name: 'Evde Köpek Eğitimi', city: 'İstanbul', district: 'Ataşehir', rating: 4.9, reviews: 18, verified: false, featured: false, tags: ['Evde Eğitim', 'Online Danışmanlık'], price: '500₺/seans', emoji: '🎓', color: 'from-lime-100 to-green-200', about: 'Evinize gelerek ya da online olarak köpeğinize özel eğitim programı hazırlıyorum. 5+ yıl deneyim.', phone: '0544 890 12 34', web: '', address: 'Ataşehir/İstanbul', services: ['Ev Eğitimi', 'Online Seans', 'Sorun Davranış', 'Tuvalet Eğitimi', 'Komut Eğitimi'], hours: { hafta: '10:00–20:00', cumartesi: '10:00–18:00', pazar: 'Kapalı' } },
  { id: '9', category: 'pet-otel', name: 'Büyükada Pet Resort', city: 'İstanbul', district: 'Adalar', rating: 4.7, reviews: 29, verified: true, featured: true, tags: ['Ada Ortamı', 'Doğal Ortam', 'VIP'], price: '400-600₺/gece', emoji: '🏨', color: 'from-blue-50 to-teal-200', about: 'Büyükada\'nın doğal ortamında evcil dostlarınız için VIP konaklama deneyimi.', phone: '0216 901 23 45', web: 'www.buyukadapetresort.com', address: 'Büyükada/Adalar/İstanbul', services: ['VIP Suite', 'Doğa Yürüyüşü', 'Özel Bakım', 'Fotoğraf Servisi', 'Transfer'], hours: { hafta: '07:00–22:00', cumartesi: '07:00–22:00', pazar: '07:00–22:00' } },
];

const PLANS = [
  { name: 'Başlangıç', price: 199, color: 'border-slate-200 hover:border-slate-400', badge: '', features: ['1 Hizmet İlanı', 'Temel Profil', 'Mesaj Alma', 'Şehir Arama Listesi'] },
  { name: 'Profesyonel', price: 399, color: 'border-orange-400 hover:border-orange-500 bg-orange-50/50', badge: 'Popüler', features: ['3 Hizmet İlanı', 'Öne Çıkan Rozet ⭐', 'Fotoğraf Galerisi', 'Yorum Toplama', 'Kategori Arama Önceliği'] },
  { name: 'Premium', price: 699, color: 'border-violet-400 hover:border-violet-500 bg-violet-50/50', badge: 'En İyi Değer', features: ['Sınırsız İlan', 'Doğrulanmış Rozet ✓', 'Ana Sayfa Görünümü', 'Analitik Paneli', 'Özel Profil Sayfası', '7/24 Destek'] },
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
          <div className="max-w-2xl mx-auto flex gap-3 mb-10">
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

          {/* Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {SERVICE_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                  selectedCategory === cat.value
                    ? 'gradient-brand text-white border-transparent shadow-brand scale-105'
                    : 'border-[var(--border)] bg-white hover:border-[var(--brand-primary-light)] hover:shadow-sm'
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs leading-tight text-center">{cat.label}</span>
                <span className={`text-[10px] font-bold ${selectedCategory === cat.value ? 'text-white/80' : 'text-[var(--brand-primary)]'}`}>
                  +₺199/ay
                </span>
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
              <button
                onClick={() => setSelectedCategory('')}
                className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full"
              >
                {SERVICE_CATEGORIES.find(c => c.value === selectedCategory)?.emoji}{' '}
                {SERVICE_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                <X size={13} />
              </button>
            )}
            <p className="text-sm text-[var(--foreground-muted)]">
              <strong className="text-[var(--foreground)]">{filtered.length}</strong> uzman bulundu
            </p>
            {hasFilters && (
              <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCity(''); }}
                className="text-xs text-red-500 hover:underline font-medium">
                Filtreleri Temizle
              </button>
            )}
          </div>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="h-10 pl-8 pr-8 appearance-none rounded-full border-2 border-[var(--border)] bg-white text-sm font-semibold focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer"
            >
              <option value="">Tüm Şehirler</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(service => (
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
                      <span key={tag} className="text-[10px] font-semibold bg-[var(--surface-secondary)] text-[var(--foreground-muted)] px-2 py-1 rounded-full border border-[var(--border)]">
                        {tag}
                      </span>
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

        {/* Abonelik Planları */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
              <Zap size={14} /> Hizmet Sağlayıcılar İçin
            </div>
            <h2 className="text-3xl font-bold font-display mb-2">Siz de Uzman Olarak Katılın</h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto text-sm">
              Veteriner, groomer, eğitmen, pet otel veya gezdirici olarak platformumuza katılın. Binlerce hayvan sever sizinle buluşsun.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {PLANS.map((plan, i) => (
              <div key={plan.name} className={`relative border-2 rounded-3xl p-6 transition-all hover:shadow-lg ${plan.color}`}>
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${i === 1 ? 'bg-orange-500 text-white' : 'bg-violet-600 text-white'}`}>
                    {plan.badge}
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="font-bold text-xl mb-1">{plan.name}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-[var(--foreground)]">₺{plan.price}</span>
                    <span className="text-sm text-[var(--foreground-muted)]">/ay</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/hizmetler/kayit">
                  <Button
                    variant={i === 1 ? 'gradient' : 'outline'}
                    fullWidth
                    className={i === 2 ? 'border-violet-400 text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600' : ''}
                  >
                    {i === 0 ? 'Ücretsiz Dene' : 'Hemen Başla'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-[var(--foreground-muted)]">
            <div className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> Güvenli Ödeme</div>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-blue-500" /> İstediğin Zaman İptal</div>
            <div className="flex items-center gap-1.5"><Zap size={14} className="text-orange-500" /> 5 Dakikada Aktif</div>
          </div>
        </div>

      </div>
    </div>
  );
}
