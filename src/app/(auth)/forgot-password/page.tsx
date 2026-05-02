'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const email = watch('email');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSent(true);
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center animate-scale-in">
        <div className="w-20 h-20 gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 shadow-brand animate-pulse-brand">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold font-display mb-3">E-posta Gönderildi!</h1>
        <p className="text-[var(--foreground-muted)] mb-2">
          <strong className="text-[var(--foreground)]">{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
        </p>
        <p className="text-sm text-[var(--foreground-muted)] mb-8">
          E-postayı göremiyorsanız spam/junk klasörünü kontrol edin.
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="gradient" fullWidth onClick={() => setSent(false)}>
            Farklı e-posta dene
          </Button>
          <Link href="/login">
            <Button variant="ghost" fullWidth leftIcon={<ArrowLeft size={16} />}>
              Girişe dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors mb-6">
        <ArrowLeft size={16} />
        Girişe dön
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-[var(--foreground)] mb-2">
          Şifreni mi unuttun? 🔑
        </h1>
        <p className="text-[var(--foreground-muted)]">
          E-posta adresini gir, sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          label="E-posta"
          placeholder="ornek@mail.com"
          autoComplete="email"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          required
          {...register('email')}
        />
        <Button type="submit" fullWidth size="lg" variant="gradient" isLoading={isLoading}>
          Sıfırlama Bağlantısı Gönder
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--foreground-muted)] mt-6">
        Hesabın yok mu?{' '}
        <Link href="/register" className="text-[var(--brand-primary)] font-semibold hover:underline">
          Üye Ol
        </Link>
      </p>
    </div>
  );
}
