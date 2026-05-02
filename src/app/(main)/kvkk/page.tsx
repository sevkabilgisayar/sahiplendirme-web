import { Metadata } from 'next';

export const metadata: Metadata = { title: 'KVKK Aydınlatma Metni — Sahiplendirme.com' };

export default function KVKKPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display mb-8">KVKK Aydınlatma Metni</h1>
        <div className="prose prose-sm text-[var(--foreground)] space-y-6">
          <p className="text-[var(--foreground-muted)]">Son güncelleme: 01.05.2026</p>

          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">1. Veri Sorumlusu</h2>
            <p>Sahiplendirme.com platformu olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan amaçlarla işlemekteyiz.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">2. İşlenen Kişisel Veriler</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Kimlik bilgileri (ad, soyad)</li>
              <li>İletişim bilgileri (e-posta, telefon numarası)</li>
              <li>Konum bilgileri (il, ilçe, yaklaşık konum)</li>
              <li>Hesap bilgileri (şifre hash, hesap türü, üyelik tarihi)</li>
              <li>İlan bilgileri (fotoğraflar, açıklamalar, hayvan bilgileri)</li>
              <li>İşlem güvenliği (IP adresi, giriş log kayıtları)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">3. Veri İşleme Amaçları</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
              <li>İlan oluşturma ve yönetim hizmetlerinin sunulması</li>
              <li>Sahiplenme başvurularının işlenmesi</li>
              <li>Kayıp hayvan ihbarlarının iletilmesi</li>
              <li>Yapay zekâ danışman hizmetinin sağlanması</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">4. Veri Aktarımı</h2>
            <p className="text-sm">Kişisel verileriniz, hizmet sağlayıcılarımız (Supabase, SendGrid, ödeme kuruluşları) ile yasal zorunluluklar kapsamında yetkili kamu kuruluşlarına aktarılabilir.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-6 mb-3">5. Haklarınız</h2>
            <p className="text-sm">KVKK'nın 11. maddesi gereği; verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme, aktarılmasını talep etme ve itiraz etme haklarına sahipsiniz.</p>
            <p className="text-sm mt-2">Başvurularınızı <a href="mailto:kvkk@sahiplendirme.com" className="text-[var(--brand-primary)] hover:underline font-medium">kvkk@sahiplendirme.com</a> adresine iletebilirsiniz.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
