'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // TODO: API call
      await new Promise((r) => setTimeout(r, 1200));
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      router.push('/');
    } catch {
      toast.error('E-posta veya şifre hatalı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-[var(--foreground)] mb-2">
          Tekrar hoş geldin 👋
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Hesabına giriş yap ve devam et.
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

        <Input
          id="password"
          type="password"
          label="Şifre"
          placeholder="••••••••"
          autoComplete="current-password"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          required
          {...register('password')}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground-muted)]">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-[var(--brand-primary)]"
            />
            Beni hatırla
          </label>
          <Link
            href="/forgot-password"
            className="text-[var(--brand-primary)] hover:underline font-medium"
          >
            Şifremi unuttum
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          variant="gradient"
          isLoading={isLoading}
          className="mt-2"
          rightIcon={!isLoading ? <ArrowRight size={18} /> : undefined}
        >
          Giriş Yap
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs text-[var(--foreground-muted)]">veya</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Social login - placeholder */}
      <button
        type="button"
        disabled
        className="w-full h-11 flex items-center justify-center gap-3 border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] transition-colors opacity-50 cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google ile Giriş Yap (Yakında)
      </button>

      {/* Register link */}
      <p className="text-center text-sm text-[var(--foreground-muted)] mt-6">
        Hesabın yok mu?{' '}
        <Link href="/register" className="text-[var(--brand-primary)] font-semibold hover:underline">
          Ücretsiz Üye Ol
        </Link>
      </p>
    </div>
  );
}
