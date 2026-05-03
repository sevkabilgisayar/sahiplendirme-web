'use client';
import { Store, Building, Mail, Phone, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function MagazaAcPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)] mb-4">
            Kurumsal Mağazanızı Açın
          </h1>
          <p className="text-[var(--foreground-muted)] text-lg">
            Sahiplendirme.com'da yerinizi alın, binlerce hayvansevere anında ulaşın.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--border)] p-6 sm:p-10">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Şirket Bilgileri */}
            <section>
              <h2 className="text-xl font-bold border-b border-[var(--border)] pb-3 mb-6 flex items-center gap-2">
                <Building size={20} className="text-[var(--brand-primary)]" /> Firma Bilgileri
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input label="Firma Unvanı" placeholder="Örn: Pati Dünyası Petshop Ltd. Şti." required />
                <Input label="Vergi Numarası / TCKN" placeholder="10 Haneli Vergi No veya 11 Haneli TCKN" required />
                <Input label="Vergi Dairesi" placeholder="Örn: Kadıköy" required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Firma Türü</label>
                  <select className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 focus:border-[var(--brand-primary)] outline-none text-sm">
                    <option>Şahıs Şirketi</option>
                    <option>Limited Şirketi</option>
                    <option>Anonim Şirket</option>
                  </select>
                </div>
              </div>
            </section>

            {/* İletişim Bilgileri */}
            <section>
              <h2 className="text-xl font-bold border-b border-[var(--border)] pb-3 mb-6 flex items-center gap-2 mt-10">
                <Mail size={20} className="text-[var(--brand-primary)]" /> İletişim Yetkilisi
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input label="Ad Soyad" placeholder="Yetkili Kişi" required />
                <Input label="E-Posta Adresi" type="email" placeholder="ornek@firma.com" required />
                <Input label="Cep Telefonu" type="tel" placeholder="05XX XXX XX XX" required />
                <Input label="Mağaza Adı (Platformda görünecek)" placeholder="Örn: Pati Dünyası" required />
              </div>
            </section>

            {/* Belge Yükleme */}
            <section>
              <h2 className="text-xl font-bold border-b border-[var(--border)] pb-3 mb-6 flex items-center gap-2 mt-10">
                <Upload size={20} className="text-[var(--brand-primary)]" /> Gerekli Belgeler
              </h2>
              <div className="bg-[var(--surface-secondary)] border border-dashed border-[var(--border)] rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                  <Upload size={20} />
                </div>
                <h3 className="font-bold mb-2">Vergi Levhası ve İmza Sirküsü Yükleyin</h3>
                <p className="text-xs text-[var(--foreground-muted)] mb-6">PDF, JPG veya PNG (Max 5MB)</p>
                <button type="button" className="bg-white border border-[var(--border)] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
                  Dosya Seç
                </button>
              </div>
            </section>

            {/* Submit */}
            <div className="pt-6 border-t border-[var(--border)] flex flex-col items-center">
              <p className="text-xs text-[var(--foreground-muted)] mb-4 text-center max-w-lg">
                Başvurunuzu göndererek <Link href="/kullanim-sartlari" className="text-[var(--brand-primary)] underline">Satıcı Sözleşmesi</Link> ve <Link href="/kvkk" className="text-[var(--brand-primary)] underline">KVKK Aydınlatma Metni</Link>'ni kabul etmiş sayılırsınız.
              </p>
              <Button size="lg" className="w-full sm:w-auto px-12 h-14 text-base" rightIcon={<ArrowRight size={18} />}>
                Başvuruyu Tamamla
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
