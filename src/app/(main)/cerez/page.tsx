import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Çerez Politikası — Sahiplendirme.com' };

export default function CerezPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display mb-8">Çerez Politikası</h1>
        <div className="prose prose-sm text-[var(--foreground)] space-y-6">
          <p className="text-[var(--foreground-muted)]">Son güncelleme: 01.05.2026</p>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">Çerez Nedir?</h2>
            <p className="text-sm">Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">Kullandığımız Çerezler</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Zorunlu çerezler:</strong> Oturum yönetimi, güvenlik</li>
              <li><strong>Fonksiyonel çerezler:</strong> Dil ve tema tercihleri</li>
              <li><strong>Analitik çerezler:</strong> Ziyaretçi istatistikleri</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">Çerez Yönetimi</h2>
            <p className="text-sm">Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Bazı çerezleri devre dışı bırakmak, platformun işlevselliğini etkileyebilir.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
