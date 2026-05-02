'use client';

import { CheckCircle, Mail, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);

  const resend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
    toast.success('Doğrulama e-postası tekrar gönderildi!');
  };

  return (
    <div className="text-center animate-fade-in">
      {/* Icon */}
      <div className="w-24 h-24 mx-auto mb-6 relative">
        <div className="w-24 h-24 gradient-brand rounded-full flex items-center justify-center shadow-brand animate-pulse-brand">
          <Mail size={44} className="text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center border-2 border-[var(--background)]">
          <CheckCircle size={18} className="text-white" />
        </div>
      </div>

      <h1 className="text-3xl font-bold font-display mb-3">
        E-postanı doğrula ✉️
      </h1>
      <p className="text-[var(--foreground-muted)] mb-2 text-lg">
        Sana bir doğrulama linki gönderdik.
      </p>
      <p className="text-sm text-[var(--foreground-muted)] mb-8">
        E-postanı kontrol et ve hesabını aktifleştirmek için linke tıkla.
        Bulamazsan <strong>spam/junk</strong> klasörüne bak.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          fullWidth
          size="lg"
          isLoading={resending}
          onClick={resend}
          leftIcon={!resending ? <RefreshCw size={16} /> : undefined}
        >
          Tekrar Gönder
        </Button>

        <Link href="/login">
          <Button variant="ghost" fullWidth>
            Giriş sayfasına dön
          </Button>
        </Link>
      </div>

      <p className="text-xs text-[var(--foreground-muted)] mt-6">
        Sorun yaşıyorsan{' '}
        <a href="mailto:destek@sahiplendirme.com" className="text-[var(--brand-primary)] hover:underline">
          destek@sahiplendirme.com
        </a>{' '}
        ile iletişime geç.
      </p>
    </div>
  );
}
