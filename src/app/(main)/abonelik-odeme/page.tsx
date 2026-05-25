'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';

const SERVICE_LABELS: Record<string, string> = {
  egitmen: 'Eğitmen',
  gezdirici: 'Gezdirici',
  kuafor: 'Pet Kuaför',
  otel: 'Pet Otel',
  veteriner: 'Veteriner',
};

function AbonelikOdemeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const services = searchParams.get('services')?.split(',') || [];
  const cycle = searchParams.get('cycle') || 'monthly';
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Fatura Bilgileri State
  const [billingType, setBillingType] = useState<'bireysel' | 'kurumsal'>('bireysel');
  const [tcNo, setTcNo] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [taxNo, setTaxNo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Kart Bilgileri State
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Fiyat Hesaplama
  const isYearly = cycle === 'yearly';
  const UNIT_PRICE = isYearly ? 159 : 199;
  const DISCOUNT_THRESHOLD = 2;
  const DISCOUNT_RATE = 0.20;

  const totalFull = services.length * UNIT_PRICE;
  const hasDiscount = services.length >= DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? Math.round(totalFull * DISCOUNT_RATE) : 0;
  const totalFinal = totalFull - discountAmount;
  const finalAmountToCharge = isYearly ? totalFinal * 12 : totalFinal;

  useEffect(() => {
    if (services.length === 0) {
      router.push('/profil'); // Geçersiz parametreler
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [services, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !city) {
      toast.error('Lütfen adres ve şehir bilgilerini doldurun.');
      return;
    }
    if (billingType === 'bireysel' && tcNo.length !== 11) {
      toast.error('Lütfen geçerli bir 11 haneli TC Kimlik No girin.');
      return;
    }
    if (billingType === 'kurumsal' && (!taxOffice || taxNo.length < 10 || !companyName)) {
      toast.error('Lütfen kurumsal fatura bilgilerini eksiksiz girin.');
      return;
    }
    if (!cardHolder || cardNumber.length < 16 || expireDate.length < 5 || cvc.length < 3) {
      toast.error('Lütfen tüm kart bilgilerini eksiksiz girin.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services,
          cycle,
          amount: finalAmountToCharge,
          billing: {
            type: billingType,
            tcNo,
            taxOffice,
            taxNo,
            companyName,
            address,
            city
          },
          card: {
            holder: cardHolder,
            number: cardNumber.replace(/\s+/g, ''),
            expire: expireDate,
            cvc: cvc
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ödeme işlemi başarısız');

      if (data.html) {
        // 3D Secure yönlendirmesi
        document.open();
        document.write(data.html);
        document.close();
      } else {
        toast.success('Ödemeniz başarıyla alındı! Profilinize yönlendiriliyorsunuz...');
        setTimeout(() => {
          window.location.href = '/profil';
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setExpireDate(val.slice(0, 5));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Profesyonel Üyelik Aktivasyonu</h1>
        <p className="text-[var(--foreground-muted)] max-w-lg mx-auto">
          Hesabınız oluşturuldu. Profesyonel ilanlarınızı yayınlamaya başlamak için ödemenizi tamamlayın.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Sol Taraf - Fiyat Özeti */}
        <div className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={20} /> Seçilen Paketiniz
          </h2>
          
          <div className="space-y-4 mb-6">
            {services.map(srv => (
              <div key={srv} className="flex justify-between items-center text-sm font-medium p-3 bg-white rounded-xl border border-[var(--border)]">
                <span className="text-[var(--foreground)]">{SERVICE_LABELS[srv] || srv} Hizmeti</span>
                <span className="text-[var(--foreground-muted)]">₺{UNIT_PRICE}/ay</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--border)] pt-4 space-y-3 text-sm">
            {hasDiscount && (
              <div className="flex justify-between items-center text-[var(--foreground-muted)] line-through">
                <span>Ara Toplam</span>
                <span>₺{totalFull}/ay</span>
              </div>
            )}
            {hasDiscount && (
              <div className="flex justify-between items-center text-green-600 font-semibold">
                <span>%20 İndirim</span>
                <span>-₺{discountAmount}/ay</span>
              </div>
            )}
            
            <div className="flex justify-between items-end pt-2">
              <span className="font-bold text-[var(--foreground)]">Genel Toplam {isYearly ? '(Yıllık)' : '(Aylık)'}</span>
              <div className="text-right">
                <span className="text-3xl font-black text-[var(--brand-primary)]">₺{finalAmountToCharge}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--foreground-muted)] bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 font-medium">
            <Shield size={16} /> Bireysel profil özellikleriniz hediye!
          </div>
        </div>

        {/* Sağ Taraf - Ödeme Formu */}
        <div className="bg-white border border-[var(--border)] rounded-3xl p-6 shadow-xl shadow-orange-500/5">
          <form onSubmit={handlePayment} className="space-y-6">
            
            {/* Fatura Bilgileri Bölümü */}
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
                Fatura Bilgileri
              </h2>
              
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="radio" name="billingType" checked={billingType === 'bireysel'} onChange={() => setBillingType('bireysel')} className="w-4 h-4 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
                  Bireysel
                </label>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="radio" name="billingType" checked={billingType === 'kurumsal'} onChange={() => setBillingType('kurumsal')} className="w-4 h-4 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
                  Kurumsal
                </label>
              </div>

              {billingType === 'bireysel' ? (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">TC Kimlik No *</label>
                  <input 
                    type="text" 
                    value={tcNo}
                    onChange={e => setTcNo(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="11 Haneli TC Kimlik No"
                    className="w-full h-10 px-4 rounded-xl border border-[var(--border)] text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                    required={billingType === 'bireysel'}
                    maxLength={11}
                  />
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Şirket Unvanı *</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Şirket Tam Unvanı"
                      className="w-full h-10 px-4 rounded-xl border border-[var(--border)] text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                      required={billingType === 'kurumsal'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Vergi Dairesi *</label>
                      <input 
                        type="text" 
                        value={taxOffice}
                        onChange={e => setTaxOffice(e.target.value)}
                        placeholder="Vergi Dairesi"
                        className="w-full h-10 px-4 rounded-xl border border-[var(--border)] text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                        required={billingType === 'kurumsal'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Vergi No *</label>
                      <input 
                        type="text" 
                        value={taxNo}
                        onChange={e => setTaxNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10 Haneli Vergi No"
                        className="w-full h-10 px-4 rounded-xl border border-[var(--border)] text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                        required={billingType === 'kurumsal'}
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Açık Adres *</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Mahalle, Sokak, No"
                    className="w-full h-10 px-4 rounded-xl border border-[var(--border)] text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Şehir *</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Örn: İstanbul"
                    className="w-full h-10 px-4 rounded-xl border border-[var(--border)] text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Kredi Kartı Bölümü */}
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2 mt-2">
                <CreditCard className="text-[var(--brand-primary)]" size={20} /> Ödeme Bilgileri
              </h2>
              
              <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Kart Üzerindeki İsim</label>
              <input 
                type="text" 
                value={cardHolder}
                onChange={e => setCardHolder(e.target.value)}
                placeholder="AD SOYAD"
                className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm font-medium focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all uppercase"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Kart Numarası</label>
              <input 
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm font-medium focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                required
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">Son Kul. (AA/YY)</label>
                <input 
                  type="text" 
                  value={expireDate}
                  onChange={handleExpireChange}
                  placeholder="MM/YY"
                  className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm font-medium focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                  required
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 ml-1">CVC</label>
                <input 
                  type="text" 
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm font-medium focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                  required
                  maxLength={4}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4 border-t border-[var(--border)]">
              <img src="https://param.com.tr/images/logo.svg" alt="ParamPOS" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              variant="gradient"
              isLoading={isLoading}
              className="mt-4 h-14 shadow-lg shadow-[var(--brand-primary)]/20"
              rightIcon={<Lock size={18} />}
            >
              ₺{finalAmountToCharge} Güvenli Ödeme Yap
            </Button>
            
            <p className="text-[10px] text-center text-[var(--foreground-muted)] px-4 leading-relaxed">
              Ödeme işleminiz 256-bit SSL ile şifrelenerek Param POS altyapısı üzerinden güvenle gerçekleştirilmektedir. Kart bilgileriniz sunucularımızda saklanmaz.
            </p>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AbonelikOdemePage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20">Yükleniyor...</div>}>
      <AbonelikOdemeContent />
    </Suspense>
  );
}
