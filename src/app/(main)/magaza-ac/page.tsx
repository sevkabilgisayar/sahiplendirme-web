'use client';
import { useState } from 'react';
import { Store, Building, Mail, Phone, ArrowRight, Upload, CheckCircle, MapPin, ChevronDown } from 'lucide-react';
import { CITIES, DISTRICTS_BY_CITY } from '@/constants';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

export default function MagazaAcPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    taxNumber: '',
    taxOffice: '',
    companyType: 'Şahıs Şirketi',
    city: '',
    district: '',
    address: '',
    contactName: '',
    email: '',
    phone: '',
    storeName: ''
  });
  
  const [files, setFiles] = useState({
    vergiLevhasi: null as File | null,
    imzaSirkusu: null as File | null,
    markaTescil: null as File | null
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [fileError, setFileError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.vergiLevhasi || !files.imzaSirkusu) {
      setFileError(true);
      toast.error('Lütfen zorunlu belgeleri (Vergi Levhası ve İmza Sirküsü) yükleyin.');
      return;
    }
    if (!accepted) {
      toast.error('Lütfen Satıcı Sözleşmesi ve KVKK metnini onaylayın.');
      return;
    }
    setFileError(false);

    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
      if (files.vergiLevhasi) submitData.append('vergiLevhasi', files.vergiLevhasi);
      if (files.imzaSirkusu) submitData.append('imzaSirkusu', files.imzaSirkusu);
      if (files.markaTescil) submitData.append('markaTescil', files.markaTescil);

      const res = await fetch('/api/magaza-basvuru', {
        method: 'POST',
        body: submitData
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        toast.error(data.error || 'Başvuru gönderilirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-[var(--border)] shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">Başvurunuz Alındı!</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Kurumsal mağaza (ürün satışı) başvurunuz başarıyla yönetici paneline iletildi. Belgeleriniz incelendikten sonra sizinle iletişime geçeceğiz.
          </p>
          <Button fullWidth variant="gradient" onClick={() => window.location.href = '/profil'}>
            Profile Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)] mb-4">
            Ürün Satışı (Kurumsal Mağaza) Başvurusu
          </h1>
          <p className="text-[var(--foreground-muted)] text-lg">
            Sahiplendirme.com'da yerinizi alın, ürünlerinizi binlerce hayvansevere ulaştırın.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--border)] p-6 sm:p-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* Şirket Bilgileri */}
            <section>
              <h2 className="text-xl font-bold border-b border-[var(--border)] pb-3 mb-6 flex items-center gap-2">
                <Building size={20} className="text-[var(--brand-primary)]" /> Firma Bilgileri
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input label="Firma Unvanı" placeholder="Örn: Pati Dünyası Petshop Ltd. Şti." required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                <Input label="Vergi Numarası / TCKN" placeholder="10 Haneli Vergi No veya 11 Haneli TCKN" required value={formData.taxNumber} onChange={e => setFormData({...formData, taxNumber: e.target.value})} />
                <Input label="Vergi Dairesi" placeholder="Örn: Kadıköy" required value={formData.taxOffice} onChange={e => setFormData({...formData, taxOffice: e.target.value})} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Firma Türü</label>
                  <select className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 focus:border-[var(--brand-primary)] outline-none text-sm" value={formData.companyType} onChange={e => setFormData({...formData, companyType: e.target.value})}>
                    <option>Şahıs Şirketi</option>
                    <option>Limited Şirketi</option>
                    <option>Anonim Şirket</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]">İl</label>
                  <div className="relative">
                    <select className="w-full h-11 pl-3 pr-8 rounded-xl border border-[var(--border)] bg-white appearance-none focus:border-[var(--brand-primary)] outline-none text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value, district: ''})} required>
                      <option value="">İl Seçin</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]">İlçe</label>
                  <div className="relative">
                    <select className="w-full h-11 pl-3 pr-8 rounded-xl border border-[var(--border)] bg-white appearance-none focus:border-[var(--brand-primary)] outline-none text-sm disabled:opacity-50" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} disabled={!formData.city} required>
                      <option value="">İlçe Seçin</option>
                      {formData.city && DISTRICTS_BY_CITY[formData.city]?.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Input label="Firma Açık Adresi" placeholder="Örn: Caferağa Mah. Moda Cad. No:1 Kadıköy/İstanbul" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
            </section>

            {/* İletişim Bilgileri */}
            <section>
              <h2 className="text-xl font-bold border-b border-[var(--border)] pb-3 mb-6 flex items-center gap-2 mt-10">
                <Mail size={20} className="text-[var(--brand-primary)]" /> İletişim Yetkilisi
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input label="Ad Soyad" placeholder="Yetkili Kişi" required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                <Input label="E-Posta Adresi" type="email" placeholder="ornek@firma.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <Input label="Cep Telefonu" type="tel" placeholder="05XX XXX XX XX" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <Input label="Mağaza Adı (Platformda görünecek)" placeholder="Örn: Pati Dünyası" required value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} />
              </div>
            </section>

            {/* Belge Yükleme */}
            <section>
              <h2 className="text-xl font-bold border-b border-[var(--border)] pb-3 mb-6 flex items-center gap-2 mt-10">
                <Upload size={20} className="text-[var(--brand-primary)]" /> Gerekli Belgeler
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Vergi Levhası */}
                <div className={`bg-[var(--surface-secondary)] border border-dashed rounded-2xl p-6 text-center relative cursor-pointer hover:bg-gray-50 ${fileError && !files.vergiLevhasi ? 'border-red-400 bg-red-50' : 'border-[var(--border)]'}`} onClick={() => document.getElementById('file-vergi')?.click()}>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
                    {files.vergiLevhasi ? <CheckCircle className="text-green-500" size={18} /> : <Upload size={18} />}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${fileError && !files.vergiLevhasi ? 'text-red-600' : ''}`}>Vergi Levhası*</h3>
                  <p className="text-[10px] text-[var(--foreground-muted)] line-clamp-1">{files.vergiLevhasi ? files.vergiLevhasi.name : 'Yüklemek için tıklayın'}</p>
                  <input id="file-vergi" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFiles({...files, vergiLevhasi: e.target.files?.[0] || null})} />
                </div>

                {/* İmza Sirküsü */}
                <div className={`bg-[var(--surface-secondary)] border border-dashed rounded-2xl p-6 text-center relative cursor-pointer hover:bg-gray-50 ${fileError && !files.imzaSirkusu ? 'border-red-400 bg-red-50' : 'border-[var(--border)]'}`} onClick={() => document.getElementById('file-imza')?.click()}>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
                    {files.imzaSirkusu ? <CheckCircle className="text-green-500" size={18} /> : <Upload size={18} />}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${fileError && !files.imzaSirkusu ? 'text-red-600' : ''}`}>İmza Sirküsü*</h3>
                  <p className="text-[10px] text-[var(--foreground-muted)] line-clamp-1">{files.imzaSirkusu ? files.imzaSirkusu.name : 'Yüklemek için tıklayın'}</p>
                  <input id="file-imza" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFiles({...files, imzaSirkusu: e.target.files?.[0] || null})} />
                </div>

                {/* Marka Tescil */}
                <div className="bg-[var(--surface-secondary)] border border-dashed border-[var(--border)] rounded-2xl p-6 text-center relative cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('file-marka')?.click()}>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
                    {files.markaTescil ? <CheckCircle className="text-green-500" size={18} /> : <Upload size={18} />}
                  </div>
                  <h3 className="font-bold text-sm mb-1">Marka Tescil</h3>
                  <p className="text-[10px] text-[var(--foreground-muted)] line-clamp-1">{files.markaTescil ? files.markaTescil.name : '(Opsiyonel)'}</p>
                  <input id="file-marka" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFiles({...files, markaTescil: e.target.files?.[0] || null})} />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="pt-6 border-t border-[var(--border)] flex flex-col items-center">
              {fileError && (
                <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                  Lütfen yukarıdaki kırmızı ile işaretli zorunlu belgeleri yükleyin.
                </div>
              )}
              <label className="flex items-start gap-2 mb-4 text-sm cursor-pointer max-w-lg">
                <input 
                  type="checkbox" 
                  checked={accepted} 
                  onChange={e => setAccepted(e.target.checked)} 
                  className="mt-1 w-4 h-4 accent-[var(--brand-primary)]" 
                  required 
                />
                <span className="text-[var(--foreground)]">
                  Başvurunuzu göndererek <Link href="/kullanim-sartlari" className="text-[var(--brand-primary)] underline font-semibold">Satıcı Sözleşmesi</Link> ve <Link href="/kvkk" className="text-[var(--brand-primary)] underline font-semibold">KVKK Aydınlatma Metni</Link>'ni okuduğumu ve kabul ettiğimi onaylıyorum.
                </span>
              </label>
              <Button size="lg" type="submit" className="w-full sm:w-auto px-12 h-14 text-base" rightIcon={<ArrowRight size={18} />} isLoading={loading}>
                Başvuruyu Gönder
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
