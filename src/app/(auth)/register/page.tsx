'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, User, ArrowRight, Check, Eye, EyeOff,
  MapPin, Phone, Building2, Shield, Users,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { CITIES, ACCOUNT_TYPES, SERVICE_CATEGORIES } from '@/constants';

const schema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  city: z.string().min(1, 'Lütfen bir il seçin'),
  accountType: z.enum(['bireysel', 'barinak', 'profesyonel'], {
    message: 'Hesap türü seçmelisiniz',
  }),
  serviceType: z.string().optional(),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  passwordConfirm: z.string(),
  terms: z.boolean().refine((v) => v, 'Kullanım şartlarını kabul etmelisiniz'),
  marketing: z.boolean().optional(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Şifreler eşleşmiyor',
  path: ['passwordConfirm'],
}).refine((d) => {
  if (d.accountType === 'profesyonel' && !d.serviceType) return false;
  return true;
}, {
  message: 'Hizmet türü seçmelisiniz',
  path: ['serviceType'],
});

type FormData = z.infer<typeof schema>;

const accountTypeIcons: Record<string, React.ReactNode> = {
  bireysel: <Users size={28} />,
  barinak: <Shield size={28} />,
  profesyonel: <Building2 size={28} />,
};

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Fiyatlandırma
  const isYearly = billingCycle === 'yearly';
  const UNIT_PRICE = isYearly ? 159 : 199; // TL/ay per kategori
  const DISCOUNT_THRESHOLD = 2; // 2+ kategoride indirim
  const DISCOUNT_RATE = 0.20; // %20

  const totalFull = selectedServices.length * UNIT_PRICE;
  const hasDiscount = selectedServices.length >= DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? Math.round(totalFull * DISCOUNT_RATE) : 0;
  const totalFinal = totalFull - discountAmount;

  const toggleService = (value: string) => {
    setSelectedServices(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountType: 'bireysel',
      marketing: false,
      terms: false,
    },
  });

  const password = watch('password', '');
  const accountType = watch('accountType');

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];
  const strengthLabels = ['', 'Zayıf', 'Orta', 'İyi', 'Güçlü'];

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      toast.success('Üyelik oluşturuldu! E-postanızı doğrulayın.');
      router.push('/verify-email');
    } catch {
      toast.error('Kayıt sırasında hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    'w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display text-[var(--foreground)] mb-2">
          Hesap Oluştur
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-[var(--brand-primary)] font-semibold hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Ad + Soyad */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                placeholder="Ad"
                className={`${inputBase} pl-10`}
                {...register('firstName')}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-[var(--danger)] mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                placeholder="Soyad"
                className={`${inputBase} pl-10`}
                {...register('lastName')}
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-[var(--danger)] mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* E-posta */}
        <div>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="email"
              placeholder="E-posta adresi"
              autoComplete="email"
              className={`${inputBase} pl-10`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[var(--danger)] mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Telefon */}
        <div>
          <div className="relative flex">
            <div className="flex items-center gap-1.5 h-12 px-3.5 rounded-l-xl border border-r-0 border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-medium text-[var(--foreground)] select-none">
              <span className="text-base">🇹🇷</span>
              <span>+90</span>
            </div>
            <input
              type="tel"
              placeholder="5XX XXX XX XX"
              autoComplete="tel"
              className={`${inputBase} rounded-l-none border-l-0`}
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-[var(--danger)] mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* İl Seçimi */}
        <div>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <select
              className={`${inputBase} pl-10 appearance-none cursor-pointer`}
              {...register('city')}
              defaultValue=""
            >
              <option value="" disabled>İl seçin</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          {errors.city && (
            <p className="text-xs text-[var(--danger)] mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Hesap Türü */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-[var(--foreground)]">
            Hesap Türü
          </label>
          <div className="grid grid-cols-3 gap-3">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  setValue('accountType', type.value as FormData['accountType'], { shouldValidate: true });
                  if (type.value !== 'profesyonel') {
                    setValue('serviceType', undefined);
                  }
                }}
                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-2 transition-all duration-200 hover:border-[var(--brand-primary-light)] ${
                  accountType === type.value
                    ? 'border-[var(--brand-primary)] bg-[var(--surface-secondary)] shadow-sm'
                    : 'border-[var(--border)] bg-[var(--surface)]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  accountType === type.value
                    ? 'text-[var(--brand-primary)]'
                    : 'text-[var(--foreground-muted)]'
                }`}>
                  {accountTypeIcons[type.value]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[var(--foreground)]">{type.label}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)] leading-tight mt-0.5">
                    {type.description}
                  </div>
                </div>
                <span className={`text-xs font-bold ${type.priceColor}`}>
                  {type.price}
                </span>
              </button>
            ))}
          </div>
          {errors.accountType && (
            <p className="text-xs text-[var(--danger)] mt-1">{errors.accountType.message}</p>
          )}
        </div>

        {/* Hizmet Türü — Profesyonel seçilince */}
        {accountType === 'profesyonel' && (
          <div className="animate-slide-up space-y-4">
            
            {/* Yıllık/Aylık Toggle */}
            <div className="flex justify-center mb-1">
              <div className="bg-[var(--surface-secondary)] p-1 rounded-xl flex items-center border border-[var(--border)] w-fit mx-auto">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    !isYearly ? 'bg-white shadow-sm text-[var(--foreground)] border border-[var(--border)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-transparent'
                  }`}
                >
                  Aylık
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    isYearly ? 'bg-[var(--brand-primary)] text-white shadow-brand border border-transparent' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-transparent'
                  }`}
                >
                  Yıllık 
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${isYearly ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'}`}>
                    %20 İndirim
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-[var(--foreground)]">
                Hizmet Kategorileri
              </label>
              <p className="text-xs text-[var(--foreground-muted)] mb-3">
                Birden fazla kategori seçebilirsiniz — 2+ kategoride <span className="text-green-600 font-semibold">ekstra %20 indirim</span> uygulanır.
              </p>
              <div className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-2xl p-4">
                <div className="grid grid-cols-3 gap-2">
                  {SERVICE_CATEGORIES.map((svc) => {
                    const isSelected = selectedServices.includes(svc.value);
                    return (
                      <button
                        key={svc.value}
                        type="button"
                        onClick={() => toggleService(svc.value)}
                        className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-[var(--brand-primary)] text-white shadow-brand'
                            : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--brand-primary-light)]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                        <span className="text-2xl">{svc.emoji}</span>
                        <span className="text-[10px] font-medium text-center leading-tight">{svc.label}</span>
                        <span className={`text-[9px] font-bold ${isSelected ? 'text-orange-200' : 'text-[var(--foreground-muted)]'}`}>
                          +₺{UNIT_PRICE}/ay
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fiyat Özeti */}
            {selectedServices.length > 0 && (
              <div className="animate-fade-in bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-[var(--foreground)] mb-2">Fiyat Özeti</div>

                {/* Seçilen kategoriler */}
                {selectedServices.map(sv => {
                  const svc = SERVICE_CATEGORIES.find(s => s.value === sv);
                  return (
                    <div key={sv} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                        <span>{svc?.emoji}</span> {svc?.label}
                      </span>
                      <span className="font-medium text-[var(--foreground)]">₺{UNIT_PRICE}/ay</span>
                    </div>
                  );
                })}

                <div className="border-t border-orange-200 my-2" />

                {/* Normal toplam */}
                {hasDiscount && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--foreground-muted)]">Toplam ({selectedServices.length} kategori)</span>
                    <span className="line-through text-[var(--foreground-muted)]">₺{totalFull}/ay</span>
                  </div>
                )}

                {/* İndirim satırı */}
                {hasDiscount && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      🎉 %20 Çoklu Kategori İndirimi
                    </span>
                    <span className="text-green-600 font-bold">-₺{discountAmount}/ay</span>
                  </div>
                )}

                {/* Final fiyat */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--foreground)]">Toplam</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-[var(--brand-primary)]">₺{isYearly ? totalFinal * 12 : totalFinal}</span>
                    <span className="text-xs text-[var(--foreground-muted)]">/{isYearly ? 'yıl' : 'ay'}</span>
                  </div>
                </div>

                {isYearly && (
                  <div className="text-[10px] text-[var(--foreground-muted)] text-right -mt-1 font-medium">
                    (Aylık ₺{totalFinal}'ye denk gelir)
                  </div>
                )}

                {hasDiscount && (
                  <div className="text-[10px] text-green-600 font-medium text-center pt-1">
                    ✅ Aylık ₺{discountAmount} tasarruf ediyorsunuz!
                  </div>
                )}

                {selectedServices.length === 1 && (
                  <div className="text-[10px] text-orange-500 text-center pt-1">
                    💡 1 kategori daha ekleyerek %20 indirim kazan!
                  </div>
                )}
              </div>
            )}

            {selectedServices.length === 0 && (
              <p className="text-xs text-[var(--danger)]">Lütfen en az bir hizmet kategorisi seçin.</p>
            )}
          </div>
        )}

        {/* Şifre */}
        <div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre (en az 8 karakter)"
              autoComplete="new-password"
              className={`${inputBase} pl-10 pr-11`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[var(--danger)] mt-1">{errors.password.message}</p>
          )}
          {/* Password strength */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength ? strengthColors[strength] : 'bg-[var(--border)]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                Şifre gücü:{' '}
                <span className={`font-medium ${strength >= 3 ? 'text-green-500' : strength === 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {strengthLabels[strength]}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Şifre Tekrar */}
        <div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Şifre Tekrar"
              autoComplete="new-password"
              className={`${inputBase} pl-10 pr-11`}
              {...register('passwordConfirm')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className="text-xs text-[var(--danger)] mt-1">{errors.passwordConfirm.message}</p>
          )}
        </div>

        {/* Kullanım Şartları */}
        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded accent-[var(--brand-primary)] flex-shrink-0"
              {...register('terms')}
            />
            <span className="text-sm text-[var(--foreground-muted)]">
              <Link href="/kullanim-sartlari" className="text-[var(--brand-primary)] hover:underline font-medium">
                Kullanım Şartları
              </Link>
              {' '}ve{' '}
              <Link href="/gizlilik" className="text-[var(--brand-primary)] hover:underline font-medium">
                Gizlilik Politikası
              </Link>
              &apos;nı okudum ve kabul ediyorum.
              <span className="text-[var(--danger)]"> *</span>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-[var(--danger)] -mt-1">{errors.terms.message}</p>
          )}

          {/* Kampanya bildirim */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded accent-[var(--brand-primary)] flex-shrink-0"
              {...register('marketing')}
            />
            <span className="text-sm text-[var(--foreground-muted)]">
              Kampanya ve bildirimlerden haberdar olmak istiyorum.
            </span>
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          variant="gradient"
          isLoading={isLoading}
          className="mt-2 h-14"
          rightIcon={!isLoading ? <ArrowRight size={18} /> : undefined}
        >
          Hesap Oluştur
        </Button>
      </form>

      {/* Benefits */}
      <div className="mt-5 p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
        <p className="text-xs font-semibold text-[var(--foreground)] mb-2">Bireysel üyelik tamamen ücretsiz:</p>
        <div className="flex flex-col gap-1.5">
          {[
            'Sınırsız ilan görüntüleme',
            'Sahiplendirme başvurusu',
            'Yapay zekâ danışman kullanımı',
            'Kayıp hayvan ihbarı',
          ].map((b) => (
            <div key={b} className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
              <Check size={12} className="text-green-500 flex-shrink-0" />
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
