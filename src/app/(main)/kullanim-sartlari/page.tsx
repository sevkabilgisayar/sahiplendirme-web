import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kullanım Şartları — Sahiplendirme.com' };

export default function KullanimSartlariPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display mb-8">Kullanım Şartları</h1>
        <div className="prose prose-sm text-[var(--foreground)] space-y-6">
          <p className="text-[var(--foreground-muted)]">Son güncelleme: 01.05.2026</p>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">1. Genel</h2>
            <p className="text-sm">Sahiplendirme.com platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">2. Hesap Türleri</h2>
            <p className="text-sm">Platform üzerinde bireysel, vakıf/barınak ve profesyonel olmak üzere üç hesap türü mevcuttur. Profesyonel hesaplar aylık ücretlendirmeye tabidir.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">3. İlan Kuralları</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>İlanlar en az 1, en fazla 10 fotoğraf içermelidir</li>
              <li>Açıklama minimum 30 karakter olmalıdır</li>
              <li>Sahte veya yanıltıcı ilanlar yasaktır</li>
              <li>Hayvan satışı kesinlikle yasaktır</li>
              <li>İlanlar editör onayından geçtikten sonra yayınlanır</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">4. Yapay Zekâ Danışman</h2>
            <p className="text-sm">AI danışman yalnızca bilgilendirme amaçlıdır. Teşhis ve tedavi önerisi sunmaz. Hayvanınızla ilgili sağlık sorunlarında mutlaka veteriner hekime başvurunuz.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">5. Moderasyon</h2>
            <p className="text-sm">Platform içerikler AI risk skoru ile otomatik değerlendirilir. Uygunsuz bulunan içerikler askıya alınabilir veya kaldırılabilir.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">6. İletişim</h2>
            <p className="text-sm"><a href="mailto:destek@sahiplendirme.com" className="text-[var(--brand-primary)] hover:underline font-medium">destek@sahiplendirme.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
