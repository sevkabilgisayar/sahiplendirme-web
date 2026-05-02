'use client';

import { Check, Star, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const packages = [
  {
    name: 'Bireysel',
    price: 0,
    period: '',
    desc: 'Sahiplendirme, kayıp ve çiftleştirme ilanları',
    color: 'from-gray-100 to-gray-200',
    textColor: 'text-gray-800',
    popular: false,
    features: [
      'Sınırsız ilan görüntüleme',
      'Sahiplendirme başvurusu',
      'Kayıp hayvan ihbarı',
      'AI danışman kullanımı',
      'Mesajlaşma',
      '3 aktif ilan',
    ],
    cta: 'Ücretsiz Başla',
  },
  {
    name: 'Profesyonel',
    price: 299,
    period: '/ay',
    desc: 'Veteriner, kuaför, eğitmen, pet otel, gezdirici',
    color: 'from-orange-500 to-pink-500',
    textColor: 'text-white',
    popular: true,
    features: [
      'Hizmet profili oluşturma',
      'Premium rozet',
      'Haritada öne çıkma',
      'Müşteri yorumları',
      'İstatistik paneli',
      'Sınırsız mesajlaşma',
      'Öncelikli destek',
      'Google Ads entegrasyonu',
    ],
    cta: 'Hemen Başla',
  },
  {
    name: 'Barınak / Vakıf',
    price: 0,
    period: '',
    desc: 'Resmi kurum ve barınaklar için özel paket',
    color: 'from-blue-100 to-indigo-200',
    textColor: 'text-blue-800',
    popular: false,
    features: [
      'Sınırsız ilan yayınlama',
      'Toplu ilan yükleme',
      'Kurum profili sayfası',
      'Doğrulanmış rozet',
      'İstatistik paneli',
      'API erişimi',
      'Öncelikli destek',
    ],
    cta: 'Başvuru Yap',
  },
];

export default function PaketlerPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)]/10 px-4 py-1.5 rounded-full text-sm font-semibold text-[var(--brand-primary)] mb-4">
            <Sparkles size={14} /> Paketler & Fiyatlandırma
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            İhtiyacınıza uygun <span className="text-gradient">plan seçin</span>
          </h1>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Bireysel kullanıcılar için tamamen ücretsiz. Profesyoneller için güçlü araçlar.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {packages.map((pkg) => (
            <Card key={pkg.name} className={`p-6 relative overflow-hidden ${pkg.popular ? 'border-[var(--brand-primary)] border-2 shadow-brand scale-[1.02]' : 'border-[var(--border)]'}`}>
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-[var(--brand-primary)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <Star size={10} className="fill-white" /> En Popüler
                </div>
              )}
              <div className={`w-full h-2 rounded-full bg-gradient-to-r ${pkg.color} mb-6`} />
              <h3 className="text-xl font-bold font-display">{pkg.name}</h3>
              <p className="text-sm text-[var(--foreground-muted)] mt-1 mb-4">{pkg.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold font-display">
                  {pkg.price === 0 ? 'Ücretsiz' : `₺${pkg.price}`}
                </span>
                {pkg.period && <span className="text-[var(--foreground-muted)] text-sm">{pkg.period}</span>}
              </div>
              <div className="space-y-3 mb-6">
                {pkg.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link href={pkg.price > 0 ? '/odeme' : pkg.name === 'Barınak / Vakıf' ? '/register?tip=barinak' : '/register'}>
                <Button variant={pkg.popular ? 'gradient' : 'outline'} fullWidth size="lg" rightIcon={pkg.popular ? <ArrowRight size={18} /> : undefined}>
                  {pkg.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-display text-center mb-8">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            {[
              { q: 'Bireysel kullanıcılar gerçekten ücretsiz mi?', a: 'Evet! Sahiplendirme, kayıp ihbar ve çiftleştirme ilanları tamamen ücretsizdir.' },
              { q: 'Profesyonel paketi iptal edebilir miyim?', a: 'Evet, istediğiniz zaman iptal edebilirsiniz. Kalan süre sonuna kadar erişiminiz devam eder.' },
              { q: 'Barınak paketi için nasıl başvururum?', a: 'Kayıt olurken "Vakıf/Barınak" hesap türünü seçin. Belge doğrulaması sonrası paketiniz aktif edilir.' },
              { q: 'Ödeme yöntemleri nelerdir?', a: 'Kredi/banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Iyzico güvencesiyle.' },
            ].map((faq) => (
              <Card key={faq.q} className="p-5 border-[var(--border)]">
                <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
