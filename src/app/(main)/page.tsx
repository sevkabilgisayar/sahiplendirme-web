'use client';

import Link from 'next/link';
import { ArrowRight, Search, Heart, MapPin, Sparkles, Shield, Zap, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

import ListingCard from '@/components/ui/ListingCard';
import AdBanner from '@/components/ui/AdBanner';
import { mockListings as featuredListings } from '@/lib/mock-data';

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
              Doğru hayvanı bul,{' '}
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

      {/* ============ FEATURED LISTINGS ============ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-display text-[var(--foreground)] mb-2">
                Son İlanlar
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Platformumuzdaki en güncel ilanlar
              </p>
            </div>
            <Link href="/ilanlar">
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                Tümünü Gör
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
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
              { href: '/ilanlar?kategori=hizmetler', emoji: '⭐', label: 'Hizmetler', sub: 'Profesyonel' },
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
