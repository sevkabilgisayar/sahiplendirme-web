import Link from 'next/link';
import { RefreshCw, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function IptalIadePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--foreground-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--brand-primary)]">Ana Sayfa</Link>
          {' / '}
          <span className="text-[var(--foreground)] font-medium">İptal & İade Koşulları</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <RefreshCw size={24} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display">İptal & İade Koşulları</h1>
            <p className="text-sm text-[var(--foreground-muted)]">Son güncellenme: 1 Ocak 2024</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-[var(--foreground-muted)] leading-relaxed">

          {/* Mağaza Ürünleri */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              🛍️ Mağaza Ürünleri
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-emerald-500" /> İptal Hakkı
                </h3>
                <p>Siparişinizi kargoya verilmeden önce iptal edebilirsiniz. Kargoya verilmiş siparişlerde iade prosedürü uygulanır. İptal taleplerini hesabınızdan veya müşteri hizmetleri aracılığıyla iletebilirsiniz.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-emerald-500" /> İade Koşulları
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Ürünü teslim aldıktan itibaren <strong className="text-[var(--foreground)]">30 gün</strong> içinde iade talebinde bulunabilirsiniz.</li>
                  <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır.</li>
                  <li>Gıda ürünleri ve kişisel bakım ürünleri iade kapsamı dışındadır.</li>
                  <li>Hasarlı veya hatalı ürünler için kargo ücreti tarafımızca karşılanır.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-emerald-500" /> Para İadesi
                </h3>
                <p>Onaylanan iadeler <strong className="text-[var(--foreground)]">3–7 iş günü</strong> içinde ödeme yönteminize iade edilir. Kredi kartı iadelerinde bankanın işlem süresi eklenebilir.</p>
              </div>
            </div>
          </section>

          {/* Abonelik Paketleri */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              💼 Abonelik Paketleri (Hizmet Sağlayıcılar)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-emerald-500" /> İptal Hakkı
                </h3>
                <p>Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sona erene kadar hizmetleriniz aktif kalır. Bir sonraki dönem için ücret alınmaz.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <AlertCircle size={15} className="text-orange-500" /> İade Koşulları
                </h3>
                <p>Dijital hizmetler kapsamında, abonelik başlamadan önce iptal edilirse tam iade yapılır. Abonelik başladıktan sonra kalan süre için pro-rata iade değerlendirilmez; dönem sonuna kadar kullanım hakkı devam eder.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-emerald-500" /> Ücretsiz Deneme
                </h3>
                <p>Başlangıç planının ücretsiz deneme süresi içinde iptal edilmesi durumunda hiçbir ücret alınmaz.</p>
              </div>
            </div>
          </section>

          {/* İlan Ücretleri */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              📋 İlan Ücretleri
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-emerald-500" /> Ücretsiz İlanlar
                </h3>
                <p>Sahiplendirme, kayıp hayvan ve çiftleştirme ilanları tamamen ücretsizdir. Bu ilanlar için herhangi bir ücret alınmaz ve iade söz konusu değildir.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
                  <AlertCircle size={15} className="text-orange-500" /> Öne Çıkarma Ücretleri
                </h3>
                <p>Öne çıkarma, özel rozet veya ana sayfa görünümü gibi premium özellikler için ödenen ücretler, hizmet başladıktan sonra iade edilmez.</p>
              </div>
            </div>
          </section>

          {/* İletişim */}
          <section className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">İletişim</h2>
            <p className="mb-4">İptal veya iade taleplerini aşağıdaki kanallardan iletebilirsiniz:</p>
            <div className="space-y-2">
              <p>📧 <strong>E-posta:</strong> destek@sahiplendirme.com</p>
              <p>⏰ <strong>Yanıt Süresi:</strong> 24 saat içinde</p>
            </div>
            <Link href="/hakkimizda#iletisim" className="inline-flex items-center gap-1.5 mt-4 text-[var(--brand-primary)] font-semibold hover:underline">
              İletişim Sayfasına Git <ArrowRight size={14} />
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
