'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SERVICE_CATEGORIES, CITIES } from '@/constants';

const PLANS = [
  { name: 'Başlangıç', price: 199, color: 'border-slate-200 hover:border-slate-400', badge: '', features: ['1 Hizmet İlanı', 'Temel Profil', 'Mesaj Alma', 'Şehir Listesi'] },
  { name: 'Profesyonel', price: 399, color: 'border-orange-400 bg-orange-50/50', badge: 'Popüler', features: ['3 Hizmet İlanı', '⭐ Öne Çıkan Rozet', 'Fotoğraf Galerisi', 'Yorum Toplama', 'Arama Önceliği'] },
  { name: 'Premium', price: 699, color: 'border-violet-400 bg-violet-50/50', badge: 'En İyi Değer', features: ['Sınırsız İlan', '✓ Doğrulanmış Rozet', 'Ana Sayfa Görünümü', 'Analitik Panel', '7/24 Destek'] },
];

const STEPS = ['Kategori', 'İşletme Bilgileri', 'Hizmetler', 'Abonelik Planı'];

export default function HizmetKayitPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: '',
    name: '',
    city: '',
    district: '',
    phone: '',
    web: '',
    about: '',
    services: [] as string[],
    plan: 1,
  });

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 py-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* Back */}
        <Link href="/hizmetler" className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] mb-8 transition-colors w-fit">
          <ArrowLeft size={14} /> Hizmetlere Dön
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            <Zap size={14} /> Hizmet Sağlayıcı Kaydı
          </div>
          <h1 className="text-3xl font-bold font-display">Hizmet İlanı Oluştur</h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-2">Sahiplendirme.com üzerinden binlerce hayvan severine ulaş.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  i < step ? 'bg-emerald-500 border-emerald-500 text-white' :
                  i === step ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white' :
                  'border-[var(--border)] text-[var(--foreground-muted)] bg-white'
                }`}>
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${i === step ? 'text-[var(--brand-primary)]' : 'text-[var(--foreground-muted)]'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 -mt-5 transition-all ${i < step ? 'bg-emerald-400' : 'bg-[var(--border)]'}`} />}
            </div>
          ))}
        </div>

        <Card className="p-8 shadow-sm">

          {/* Step 0 — Kategori */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Hangi alanda hizmet veriyorsunuz?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                    className={`flex flex-col items-center gap-2 py-5 px-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                      form.category === cat.value
                        ? 'border-[var(--brand-primary)] bg-orange-50 text-[var(--brand-primary)] scale-105 shadow-sm'
                        : 'border-[var(--border)] hover:border-[var(--brand-primary-light)]'
                    }`}
                  >
                    <span className="text-3xl">{cat.emoji}</span>
                    <span className="text-xs leading-tight text-center">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — İşletme Bilgileri */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6">İşletme Bilgileriniz</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block">İşletme / Uzman Adı *</label>
                  <input
                    type="text"
                    placeholder="Örn: VetLife Veteriner Kliniği"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Şehir *</label>
                    <select
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] appearance-none bg-white"
                    >
                      <option value="">Şehir seçin</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">İlçe *</label>
                    <input
                      type="text"
                      placeholder="Örn: Kadıköy"
                      value={form.district}
                      onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Telefon *</label>
                  <input
                    type="tel"
                    placeholder="0212 000 00 00"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Web Sitesi (isteğe bağlı)</label>
                  <input
                    type="url"
                    placeholder="www.isletmeniz.com"
                    value={form.web}
                    onChange={e => setForm(f => ({ ...f, web: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Hakkınızda</label>
                  <textarea
                    placeholder="İşletmenizi veya kendinizi kısaca tanıtın..."
                    value={form.about}
                    onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Hizmetler */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Sunduğunuz Hizmetleri Girin</h2>
              <p className="text-sm text-[var(--foreground-muted)] mb-6">Virgülle ayırarak ekleyin. Örn: Genel Muayene, Aşılama, Diş Bakımı</p>
              <textarea
                placeholder="Hizmet 1, Hizmet 2, Hizmet 3..."
                rows={5}
                onChange={e => setForm(f => ({ ...f, services: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                defaultValue={form.services.join(', ')}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none mb-4"
              />
              {form.services.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground-muted)] mb-2">Eklenen hizmetler:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.services.map(s => (
                      <span key={s} className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Plan Seçimi */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Abonelik Planı Seçin</h2>
              <div className="space-y-4 mb-8">
                {PLANS.map((plan, i) => (
                  <button
                    key={plan.name}
                    onClick={() => setForm(f => ({ ...f, plan: i }))}
                    className={`w-full text-left border-2 rounded-2xl p-5 transition-all ${
                      form.plan === i
                        ? 'border-[var(--brand-primary)] bg-orange-50'
                        : plan.color
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.plan === i ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]' : 'border-slate-300'}`}>
                          {form.plan === i && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <span className="font-bold">{plan.name}</span>
                          {plan.badge && <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 1 ? 'bg-orange-500 text-white' : 'bg-violet-600 text-white'}`}>{plan.badge}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-[var(--foreground)]">₺{plan.price}</span>
                        <span className="text-xs text-[var(--foreground-muted)]">/ay</span>
                      </div>
                    </div>
                    <ul className="ml-8 grid grid-cols-2 gap-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                          <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
                🔒 Ödeme sistemi yakında aktif olacak. Şimdilik bilgilerinizi kayıt edip erken erişim listesine katılın.
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <Button variant="outline" onClick={prev} disabled={step === 0} leftIcon={<ArrowLeft size={15} />}>
              Geri
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                variant="gradient"
                onClick={next}
                disabled={step === 0 && !form.category}
                rightIcon={<ArrowRight size={15} />}
              >
                Devam Et
              </Button>
            ) : (
              <Link href="/hizmetler">
                <Button variant="gradient" rightIcon={<CheckCircle size={15} />}>
                  Kaydı Tamamla
                </Button>
              </Link>
            )}
          </div>
        </Card>

        <p className="text-center text-xs text-[var(--foreground-muted)] mt-6">
          Kaydı tamamlayarak{' '}
          <Link href="/kullanim-sartlari" className="underline hover:text-[var(--brand-primary)]">Kullanım Şartları</Link>'nı kabul etmiş sayılırsınız.
        </p>
      </div>
    </div>
  );
}
