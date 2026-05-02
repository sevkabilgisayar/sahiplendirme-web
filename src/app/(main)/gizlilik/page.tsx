import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gizlilik Politikası — Sahiplendirme.com' };

export default function GizlilikPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display mb-8">Gizlilik Politikası</h1>
        <div className="prose prose-sm text-[var(--foreground)] space-y-6">
          <p className="text-[var(--foreground-muted)]">Son güncelleme: 01.05.2026</p>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">1. Giriş</h2>
            <p className="text-sm">Sahiplendirme.com olarak gizliliğinize önem veriyoruz. Bu politika, platformumuzu kullandığınızda kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">2. Toplanan Bilgiler</h2>
            <p className="text-sm">Hesap oluşturma sırasında ad, soyad, e-posta, telefon numarası ve konum bilgileriniz toplanır. İlan oluşturma sırasında hayvan fotoğrafları ve konum verileri işlenir.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">3. Çerezler</h2>
            <p className="text-sm">Platformumuz, deneyiminizi iyileştirmek amacıyla çerezler kullanır. Detaylar için <a href="/cerez" className="text-[var(--brand-primary)] hover:underline font-medium">Çerez Politikası</a> sayfamızı inceleyin.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">4. Konum Gizliliği</h2>
            <p className="text-sm">İlan oluştururken konum bilginizi &quot;yaklaşık&quot; veya &quot;tam&quot; olarak paylaşabilirsiniz. Varsayılan ayar yaklaşık konumdur ve mahalle seviyesinde gösterilir.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">5. İletişim</h2>
            <p className="text-sm">Gizlilik ile ilgili sorularınız için: <a href="mailto:gizlilik@sahiplendirme.com" className="text-[var(--brand-primary)] hover:underline font-medium">gizlilik@sahiplendirme.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
