'use client';

import { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function OdemePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-[var(--border)] shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">Ödeme Başarılı!</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Profesyonel paketiniz aktif edildi. Faturanız e-posta adresinize gönderildi.
          </p>
          <Button fullWidth variant="gradient" onClick={() => window.location.href = '/profil'}>
            Profile Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-8 text-center">Güvenli Ödeme</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="text-[var(--brand-primary)]" />
                Kart Bilgileri
              </h2>
              <div className="space-y-4">
                <Input label="Kart Üzerindeki İsim" placeholder="Örn: Ali Yılmaz" />
                <Input label="Kart Numarası" placeholder="0000 0000 0000 0000" maxLength={19} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Son Kullanma Tarihi" placeholder="AA/YY" />
                  <Input label="CVC" placeholder="123" type="password" maxLength={3} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Fatura Adresi</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="İl" placeholder="İstanbul" />
                  <Input label="İlçe" placeholder="Kadıköy" />
                </div>
                <Input label="Açık Adres" placeholder="Mahalle, sokak, no..." />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-[var(--surface-secondary)] border-[var(--brand-primary-light)]">
              <h3 className="font-bold text-lg mb-4 border-b pb-4">Sipariş Özeti</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--foreground-muted)]">Profesyonel Paket</span>
                <span className="font-semibold">₺299.00</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-[var(--foreground-muted)]">
                <span>KDV (%20)</span>
                <span>₺59.80</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
                <span>Toplam</span>
                <span className="text-[var(--brand-primary)]">₺358.80</span>
              </div>

              <Button 
                fullWidth 
                variant="gradient" 
                className="mt-6" 
                onClick={handlePay}
                isLoading={loading}
              >
                Ödemeyi Tamamla
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--foreground-muted)]">
                <Lock size={12} />
                256-bit SSL ile güvenli ödeme (Iyzico)
              </div>
            </Card>

            <div className="flex items-center gap-3 p-4 rounded-xl border bg-green-50 text-green-700 border-green-200 text-sm">
              <ShieldCheck size={24} />
              <div>Sahiplendirme.com güvencesiyle 14 gün iade hakkı.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
