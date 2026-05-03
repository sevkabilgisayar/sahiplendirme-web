import Link from 'next/link';
import { Heart } from 'lucide-react';
import SiteLogo from '@/components/ui/SiteLogo';

const footerLinks = {
  platform: {
    title: 'Platform',
    links: [
      { href: '/ilanlar?kategori=sahiplendirme', label: 'Sahiplendirme' },
      { href: '/ilanlar?kategori=kayip', label: 'Kayıp Hayvanlar' },
      { href: '/ilanlar?kategori=ciftlestirme', label: 'Çiftleştirme İlanları' },
      { href: '/hizmetler', label: 'Hizmetler' },
      { href: '/magaza', label: 'Mağaza' },
    ],
  },
  ai: {
    title: 'Yapay Zekâ',
    links: [
      { href: '/ai-danisman', label: 'AI Danışman' },
      { href: '/ai-danisman/hayvan-bul', label: 'Hayvan Bul' },
      { href: '/ai-danisman/ciftlestirme', label: 'Çiftleştirme Önerisi' },
      { href: '/ai-danisman/analiz', label: 'Durum Analizi' },
    ],
  },
  company: {
    title: 'Hakkında',
    links: [
      { href: '/hakkimizda', label: 'Hakkımızda' },
      { href: '/hakkimizda#iletisim', label: 'İletişim' },
      { href: '/paketler', label: 'Hizmet Paketleri' },
      { href: '/barinaklar', label: 'Barınaklar' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  legal: {
    title: 'Hukuki',
    links: [
      { href: '/kvkk', label: 'KVKK' },
      { href: '/gizlilik', label: 'Gizlilik Politikası' },
      { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
      { href: '/cerez', label: 'Çerez Politikası' },
      { href: '/iptal-iade', label: 'İptal & İade Koşulları' },
    ],
  },
  magaza: {
    title: 'Mağazalar',
    links: [
      { href: '/neden-magaza', label: 'Neden Mağaza?' },
      { href: '/register', label: 'Mağaza Açmak İstiyorum' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex mb-4" style={{ overflow: 'visible' }}>
              <SiteLogo size="lg" />
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
              Sahiplendirme, kayıp hayvan ve çiftleştirme ilanları için yapay zekâ destekli platform.
            </p>
            <div className="flex items-center gap-1 mt-4 text-sm text-[var(--foreground-muted)]">
              <span>Sadece</span>
              <span className="text-lg">🐶🐱🐦</span>
              <span>için</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--foreground-muted)]">
            © {new Date().getFullYear()} Sahiplendirme.com — Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-[var(--foreground-muted)] flex items-center gap-1">
            Hayvanlar için
            <Heart size={12} className="text-[var(--danger)] fill-current" />
            ile yapıldı
          </p>
        </div>
      </div>
    </footer>
  );
}
