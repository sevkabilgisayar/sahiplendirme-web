'use client';

import Link from 'next/link';
import { ArrowRight, Search, Heart, MapPin, Sparkles, Shield, Zap, Star, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

import ListingCard from '@/components/ui/ListingCard';
import AdBanner from '@/components/ui/AdBanner';
import { mockListings as featuredListings, mockStoreProducts } from '@/lib/mock-data';
import { mockServices } from '@/app/(main)/hizmetler/page';

const stats = [
  { value: '12.000+', label: 'Mutlu Hayvan', emoji: '🐾' },
  { value: '8.500+', label: 'Aktif İlan', emoji: '📋' },
  { value: '45.000+', label: 'Üye', emoji: '👥' },
  { value: '200+', label: 'Barınak', emoji: '🏛️' },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-[var(--background)] to-rose-50" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 text-orange-700 text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles size={14} className="text-orange-500" />
              Yapay Zekâ Destekli Platform
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">YENİ</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display mb-6 leading-tight">
              Doğru dostu bul,{' '}
              <span className="text-gradient">sıcak bir yuva</span>{' '}
              ver 🐾
            </h1>

            <p className="text-lg sm:text-xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Köpek, kedi ve kuş sahiplendirme ilanları. Kayıp hayvan ihbarları. Çiftleştirme eşleştirme.
              Yapay zekâ ile anında doğru cevap.
            </p>

            {/* Search bar — functional */}
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
              onSubmit={(e) => {
                e.preventDefault();
                const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value;
                if (q.trim()) window.location.href = `/ilanlar?q=${encodeURIComponent(q)}`;
                else window.location.href = '/ilanlar';
              }}
            >
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  type="text"
                  name="q"
                  placeholder="Örn: İstanbul'da Golden Retriever sahiplendirme"
                  className="w-full h-14 pl-11 pr-4 rounded-2xl border border-[var(--border)] bg-white/90 backdrop-blur-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm text-sm"
                />
              </div>
              <Button type="submit" size="lg" variant="gradient" className="h-14 px-7 rounded-2xl shadow-brand">
                Ara <ArrowRight size={18} />
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                { href: '/ilanlar?kategori=sahiplendirme&tur=kopek', label: '🐶 Köpek Sahiplendirme' },
                { href: '/ilanlar?kategori=sahiplendirme&tur=kedi', label: '🐱 Kedi Sahiplendirme' },
                { href: '/ilanlar?kategori=sahiplendirme&tur=kus', label: '🐦 Kuş Sahiplendirme' },
                { href: '/ilanlar?kategori=kayip', label: '🔍 Kayıp Hayvanlar' },
              ].map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="text-sm font-medium bg-white/80 backdrop-blur-sm border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary-light)] px-4 py-2 rounded-full transition-all hover:bg-white shadow-sm"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ NASIL ÇALIŞIR ============ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Nasıl Çalışır?</h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">Üç adımda can dostunuzu bulun ya da bir hayvanı sahiplendirmeye başlayın.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-orange-300 to-pink-300 z-0" />
            {[
              { step: 1, emoji: '📝', title: 'İlan Oluştur veya Ara', desc: 'Ücretsiz hesap açın. Sahiplendirme, kayıp veya çiftleştirme ilanı oluşturun. Ya da ilanları filtreleyin.', color: 'from-orange-400 to-amber-400' },
              { step: 2, emoji: '🤖', title: 'AI ile Eşleşin', desc: 'Yapay zekâ danışmanımız sizin yaşam tarzınıza ve ihtiyaçlarınıza göre en uygun ilanları önerir.', color: 'from-pink-400 to-rose-400' },
              { step: 3, emoji: '🏠', title: 'Yuva Bulun', desc: 'İlan sahibiyle mesajlaşın, başvurun ve can dostunuzu sıcak yuvasına kavuşturun!', color: 'from-purple-400 to-indigo-400' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center relative z-10">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center text-3xl mb-5 shadow-lg`}>
                  {item.emoji}
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[var(--surface)] border-2 border-[var(--brand-primary)] flex items-center justify-center text-xs font-bold text-[var(--brand-primary)] hidden md:flex">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{item.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/register">
              <Button size="lg" variant="gradient" className="shadow-brand" rightIcon={<ArrowRight size={18} />}>
                Hemen Başla
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="py-12 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold font-display text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--foreground-muted)] flex items-center justify-center gap-1">
                  <span>{stat.emoji}</span>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI FOTOĞRAF EŞLEŞTİRME BANNER ============ */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/ai-danisman/foto-eslestirme" className="block group">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 sm:p-8 shadow-xl shadow-violet-200/50 hover:shadow-violet-300/60 transition-all hover:-translate-y-0.5">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-px h-20 bg-white/20" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Left content */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                    📸
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-xl text-white">Yapay Zeka ile Fotoğraf Eşleştirme</span>
                      <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">YENİ</span>
                    </div>
                    <p className="text-violet-100 text-sm leading-relaxed max-w-lg">
                      Kayıp hayvan fotoğrafını yükle, sistemdeki tüm ilanlarla otomatik olarak karşılaştır. Eşleşme bulunduğunda anında bildirim al.
                    </p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {['📷 Fotoğraf yükle', '🤖 AI karşılaştır', '🔔 Eşleşme bildirimi'].map(step => (
                        <span key={step} className="text-[11px] font-medium bg-white/15 text-white px-3 py-1 rounded-full">{step}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 bg-white text-violet-700 font-bold text-sm px-5 py-3 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                    Nasıl Çalışır? <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>



      {/* ============ AD BANNER - ORTA ============ */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <AdBanner 
          imageUrl="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop" 
          linkUrl="#" 
          altText="Pet İhtiyaçları" 
        />
      </div>

      {/* ============ ÖNE ÇIKAN SAHİPLENDİRME ============ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">🏠</span>
                <h2 className="text-2xl font-bold font-display text-[var(--foreground)]">Öne Çıkan Sahiplendirme</h2>
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">PREMIUM</span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">Sıcak bir yuva arayan can dostlarımız</p>
            </div>
            <Link href="/ilanlar?kategori=sahiplendirme">
              <Button variant="outline" rightIcon={<ArrowRight size={14} />} className="hidden sm:flex text-sm h-9">Tümünü Gör</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.filter(l => l.type === 'sahiplendirme').slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/ilanlar?kategori=sahiplendirme" className="sm:hidden">
              <Button variant="outline">Tümünü Gör</Button>
            </Link>
            <Link href="/ilan-ver">
              <Button variant="gradient" rightIcon={<Zap size={14}/>}>Hemen Sahiplendirme İlanı Ver</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ÖNE ÇIKAN KAYIP ============ */}
      <section className="py-16 bg-red-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg">🔍</span>
                <h2 className="text-2xl font-bold font-display text-[var(--foreground)]">Kayıp İlanları</h2>
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">PREMIUM</span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">Görenlerin iletişime geçmesi önemle rica olunur</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.filter(l => l.type === 'kayip').slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/ilanlar?kategori=kayip">
              <Button variant="outline">Kayıp İlanlarını İncele</Button>
            </Link>
            <Link href="/ilan-ver">
              <Button className="bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20" rightIcon={<Zap size={14}/>}>Kayıp İlanı Ver</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ÖNE ÇIKAN ÇİFTLEŞTİRME ============ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg">💕</span>
                <h2 className="text-2xl font-bold font-display text-[var(--foreground)]">Çiftleştirme Eşleştirmeleri</h2>
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">PREMIUM</span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">Uyumlu eş arayan dostlarımız</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.filter(l => l.type === 'ciftlestirme').slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/ilanlar?kategori=ciftlestirme">
              <Button variant="outline">Tüm Eşleştirmeleri Gör</Button>
            </Link>
          </div>
        </div>
      </section>


      {/* ============ MAĞAZA VİTRİN ============ */}
      <section className="py-16 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">🛍️</span>
                <h2 className="text-2xl font-bold font-display text-[var(--foreground)]">Mağaza Vitrini</h2>
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">YENİ</span>
              </div>
              <p className="text-emerald-700/70 text-sm">Pet dostunuz için en popüler ürünler</p>
            </div>
            <Link href="/magaza">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" rightIcon={<ArrowRight size={14}/>}>Mağazaya Git</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mockStoreProducts.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/magaza/${p.id}`} className="bg-white border border-emerald-100 rounded-2xl p-4 flex flex-col hover:shadow-lg transition-all group cursor-pointer block">
                <div className="w-full h-24 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                </div>
                <div className="font-semibold text-sm leading-tight mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">{p.name}</div>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-[10px]">{p.rating}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-emerald-600">₺{p.price}</span>
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ArrowRight size={12}/>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HİZMETLER VİTRİNİ ============ */}
      <section className="py-16 bg-gradient-to-br from-violet-50/60 via-white to-fuchsia-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-lg">⭐</span>
                <h2 className="text-2xl font-bold font-display text-[var(--foreground)]">Hizmetler Vitrini</h2>
                <span className="bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ONAYLANMIŞ</span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">Veteriner, groomer, eğitmen, pet otel ve gezdirici — onaylı profesyoneller</p>
            </div>
            <Link href="/hizmetler">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white" rightIcon={<ArrowRight size={14}/>}>Tüm Hizmetler</Button>
            </Link>
          </div>

          {/* Category quick filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { emoji: '🩺', label: 'Veteriner', cat: 'veteriner', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
              { emoji: '✂️', label: 'Pet Kuaför', cat: 'kuafor', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
              { emoji: '🎓', label: 'Eğitmen', cat: 'egitmen', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { emoji: '🏨', label: 'Pet Otel', cat: 'pet-otel', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
              { emoji: '🦨', label: 'Gezdirici', cat: 'gezdirici', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map(c => (
              <Link
                key={c.cat}
                href={`/hizmetler?kategori=${c.cat}`}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${c.bg} hover:shadow-sm hover:scale-105 transition-all`}
              >
                {c.emoji} {c.label}
              </Link>
            ))}
          </div>

          {/* Service cards — featured first, 2-row layout, up to 6 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockServices.filter(s => s.featured).slice(0, 2).concat(
              mockServices.filter(s => !s.featured).slice(0, 2)
            ).slice(0, 4).map(service => (
              <Link key={service.id} href={`/hizmetler/${service.id}`} className="group">
                <div className={`bg-white rounded-2xl border-2 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${
                  service.featured ? 'border-violet-200 hover:border-violet-400' : 'border-[var(--border)] hover:border-violet-300'
                }`}>
                  {/* Top row */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                      {service.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="font-bold text-sm leading-tight line-clamp-1">{service.name}</span>
                        {service.verified && <CheckCircle size={13} className="text-blue-500 flex-shrink-0" />}
                        {service.featured && (
                          <span className="text-[9px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded-full">⭐ Öne Çıkan</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[var(--foreground-muted)] mb-1.5">
                        <MapPin size={10} className="flex-shrink-0" />
                        {service.district}, {service.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-orange-500 font-bold text-[11px]">
                          <Star size={10} className="fill-orange-500" />
                          {service.rating}
                        </div>
                        <span className="text-[10px] text-[var(--foreground-muted)]">({service.reviews} yorum)</span>
                        <span className="text-[11px] text-emerald-600 font-bold ml-auto">{service.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-3 line-clamp-2">{service.about}</p>

                  {/* Services list */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.services.slice(0, 3).map(sv => (
                      <span key={sv} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[var(--surface-secondary)] text-[var(--foreground-muted)] px-2 py-1 rounded-full border border-[var(--border)]">
                        <span className="w-1 h-1 rounded-full bg-violet-400 inline-block" />
                        {sv}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-medium text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] text-[var(--foreground-muted)]">
                      <span>📞 {service.phone}</span>
                    </div>
                    <span className="text-xs text-violet-600 group-hover:text-violet-700 font-semibold flex items-center gap-0.5 transition-colors">
                      Profili Gör <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <div className="font-bold text-base mb-1">🐾 Uzman mı olmak istiyorsunuz?</div>
              <p className="text-violet-100 text-sm">Platforma katılın, binlerce hayvan severle buluşun.</p>
            </div>
            <Link href="/hizmetler/kayit">
              <div className="flex items-center gap-2 bg-white text-violet-700 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap">
                Uzman Olarak Kayıt Ol <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ RESMİ BARINAKLAR ============ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg">🏛️</span>
                <h2 className="text-2xl font-bold font-display text-[var(--foreground)]">Resmi Barınaklar</h2>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">Türkiye genelindeki belediye ve resmi barınaklar</p>
            </div>
            <Button variant="outline" rightIcon={<ArrowRight size={14}/>}>Tüm Barınaklar</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { id: 1, name: 'İstanbul Büyükşehir Belediyesi Barınağı', city: 'İstanbul', count: 450, img: '🏢' },
              { id: 2, name: 'Ankara Çankaya Hayvan Barınağı', city: 'Ankara', count: 320, img: '🏥' },
              { id: 3, name: 'İzmir Şopengazi Barınağı', city: 'İzmir', count: 210, img: '🏡' }
            ].map(b => (
              <div key={b.id} className="border border-[var(--border)] bg-[var(--surface)] p-5 rounded-3xl flex items-center gap-4 hover:border-[var(--brand-primary)] hover:shadow-md transition-all cursor-pointer">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl">{b.img}</div>
                <div>
                  <div className="font-bold text-sm leading-tight mb-1">{b.name}</div>
                  <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    <span className="flex items-center gap-0.5"><MapPin size={10}/> {b.city}</span>
                    <span>•</span>
                    <span className="font-medium text-orange-600">{b.count} İlan</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AD BANNER ============ */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AdBanner 
          imageUrl="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop" 
          linkUrl="#" 
          altText="Petshop İndirimi" 
        />
      </div>

      {/* ============ AI SECTION ============ */}
      <section className="py-20 bg-gradient-to-br from-[var(--surface-secondary)] to-orange-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
                <Sparkles size={14} />
                Yapay Zekâ ile
              </div>
              <h2 className="text-4xl font-bold font-display mb-5 leading-tight">
                Sana özel hayvan{' '}
                <span className="text-gradient">öneri sistemi</span>
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg mb-8 leading-relaxed">
                Ne aradığını yaz, yapay zekâmız binlerce ilan arasından sana en uygun olanları saniyeler içinde bulsun.
              </p>

              <div className="flex flex-col gap-4 mb-8">
                {[
                  { title: 'Metin ile Hayvan Bul', desc: 'İstediğin özellikleri yaz, AI eşleştirsin', href: '/ai-danisman/hayvan-bul', emoji: '🔎' },
                  { title: 'Durum Analizi', desc: 'Hayvanınızın durumunu AI ile analiz edin', href: '/ai-danisman/analiz', emoji: '🩺' },
                  { title: 'Çiftleştirme Eşleştirme', desc: 'Uygun eş bulmak artık daha kolay', href: '/ai-danisman/ciftlestirme', emoji: '💕' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-[var(--border)] hover:border-[var(--brand-primary-light)] hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:shadow-brand transition-shadow">
                      {item.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--foreground)] text-sm">{item.title}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">{item.desc}</div>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-[var(--foreground-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Chat Preview */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl border border-[var(--border)] p-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--border)]">
                  <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--foreground)]">Yapay Zekâ Danışman</div>
                    <div className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                      Çevrimiçi
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-[var(--brand-primary)] text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      Küçük bir dairede yaşıyorum. Bana uygun bir kedi ırkı önerir misin?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[var(--surface-secondary)] text-[var(--foreground)] text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                      Daire hayatı için <strong>British Shorthair</strong> veya <strong>Ragdoll</strong> harika seçimler! Sakin yapıları ve az aktivite ihtiyaçlarıyla küçük alanlara çok uyum sağlarlar. 🐱
                      <div className="mt-2 pt-2 border-t border-[var(--border)]">
                        <div className="text-xs text-[var(--foreground-muted)] mb-1.5">Platform'daki uygun ilanlar:</div>
                        <div className="text-xs text-[var(--brand-primary)] font-medium hover:underline cursor-pointer">→ 8 ilan bulundu - Görüntüle</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="mt-5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Bir şey sor..."
                    className="flex-1 h-10 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    readOnly
                  />
                  <Button size="sm" variant="gradient" className="px-3">
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-100 rounded-full blur-xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rose-100 rounded-full blur-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-3">Kategorileri Keşfet</h2>
            <p className="text-[var(--foreground-muted)]">Aradığın kategoriyi seç ve hemen ilanları gör</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { href: '/ilanlar?kategori=sahiplendirme&tur=kopek', emoji: '🐶', label: 'Köpek', sub: 'Sahiplendirme' },
              { href: '/ilanlar?kategori=sahiplendirme&tur=kedi', emoji: '🐱', label: 'Kedi', sub: 'Sahiplendirme' },
              { href: '/ilanlar?kategori=sahiplendirme&tur=kus', emoji: '🐦', label: 'Kuş', sub: 'Sahiplendirme' },
              { href: '/ilanlar?kategori=kayip', emoji: '🔍', label: 'Kayıp', sub: 'Hayvanlar' },
              { href: '/ilanlar?kategori=ciftlestirme', emoji: '💕', label: 'Çiftleştirme', sub: 'İlanları' },
              { href: '/hizmetler', emoji: '⭐', label: 'Hizmetler', sub: 'Profesyonel' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center gap-3 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:border-[var(--brand-primary-light)] hover:shadow-md transition-all hover:-translate-y-1 text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </div>
                <div>
                  <div className="font-semibold text-[var(--foreground)] text-sm">{cat.label}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">{cat.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="py-20 bg-[var(--surface-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-3">Neden Sahiplendirme.com?</h2>
            <p className="text-[var(--foreground-muted)]">Platformumuzun size sunduğu avantajlar</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles size={24} />,
                title: 'Yapay Zekâ Destekli',
                desc: 'AI ile saniyeler içinde sana özel hayvan önerileri, durum analizi ve çiftleştirme eşleştirmesi.',
                color: 'orange',
              },
              {
                icon: <Shield size={24} />,
                title: 'Güvenli Platform',
                desc: 'Doğrulanmış barınak hesapları, moderasyon sistemi ve spam koruması ile güvenli ilan ortamı.',
                color: 'blue',
              },
              {
                icon: <Zap size={24} />,
                title: 'Hızlı & Kolay',
                desc: 'İlanını dakikalar içinde yayınla. Sahiplendirme başvurusunu tek tıkla gönder.',
                color: 'green',
              },
            ].map((item, i) => (
              <Card key={i} hover className="text-center">
                <div className={`w-14 h-14 mx-auto mb-4 gradient-brand rounded-2xl flex items-center justify-center text-white`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 font-display">{item.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-brand rounded-3xl p-12 text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 text-8xl">🐾</div>
              <div className="absolute bottom-4 right-8 text-8xl">🐾</div>
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🐾</div>
              <h2 className="text-3xl font-bold font-display mb-4">
                Bugün bir hayat değiştir
              </h2>
              <p className="text-white/85 mb-8 text-lg">
                Sahiplendirme ilanı ver, kayıp hayvan ihbar et veya çiftleştirme ilanı oluştur. Tamamen ücretsiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/ilan/olustur">
                  <Button
                    size="lg"
                    className="bg-white text-[var(--brand-primary)] hover:bg-white/90 shadow-lg font-bold"
                  >
                    Hemen İlan Ver
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" className="border-2 border-white/50 bg-transparent text-white hover:bg-white/10">
                    Ücretsiz Üye Ol
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
