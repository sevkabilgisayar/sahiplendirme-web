'use client';

import { useState } from 'react';
import { ArrowRight, Send, CheckCircle, Megaphone, TrendingUp, Users, Target } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ReklamVerPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to an API endpoint
    // For now, we simulate a successful submission
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[var(--background)] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[var(--border)] p-10 text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold font-display mb-4">Talebiniz Alındı!</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Reklam talebiniz başarıyla ekibimize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
          </p>
          <Button variant="gradient" fullWidth onClick={() => window.location.href = '/'}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 py-16 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-sm mb-6">
            <Megaphone size={16} />
            Reklam Çözümleri
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-6">Doğru Kitleye Ulaşın</h1>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Türkiye'nin en aktif evcil hayvan platformunda markanızı binlerce hayvansevere tanıtın. 
            Banner reklamlar, sponsorlu içerikler ve daha fazlası.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side - Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold font-display mb-6">Neden Bizimle Çalışmalısınız?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Nokta Atışı Hedef Kitle</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Kullanıcılarımızın %100'ü evcil hayvan sahibi veya sahiplenmek isteyen hayvanseverlerden oluşur. 
                    Ürünlerinizi doğrudan alıcı kitlesine sunun.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Aylık 150.000+ Tekil Ziyaretçi</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Her gün binlerce kişi yeni bir can dostu bulmak veya hizmet almak için platformumuzu ziyaret ediyor.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Yüksek Dönüşüm Oranı</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Kullanıcılar platformumuzda vakit geçirdiği için reklamlara tıklama ve alışverişe dönüşme oranı sektör ortalamasının çok üzerindedir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-xl mb-4">Reklam Seçeneklerimiz</h3>
            <ul className="space-y-3 text-sm text-[var(--foreground-muted)]">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[var(--brand-primary)]" />
                Ana Sayfa Manşet Banner (970x90, 728x90)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[var(--brand-primary)]" />
                İlan Detay Sayfası Yan Banner (300x250)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[var(--brand-primary)]" />
                Arama Sonuçları Sponsorlu Gösterim
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[var(--brand-primary)]" />
                E-Bülten Reklamları
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-lg sticky top-24">
          <h2 className="text-2xl font-bold font-display mb-2">Reklam Talebi Oluştur</h2>
          <p className="text-sm text-[var(--foreground-muted)] mb-6">
            Detayları doldurun, kurumsal satış ekibimiz sizinle iletişime geçsin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1.5 text-slate-700">Adınız Soyadınız *</label>
                <input type="text" required className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" placeholder="Örn: Ahmet Yılmaz" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5 text-slate-700">Firma / Marka Adı *</label>
                <input type="text" required className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" placeholder="Örn: Petshop A.Ş." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1.5 text-slate-700">E-posta Adresiniz *</label>
                <input type="email" required className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" placeholder="ornek@firma.com" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5 text-slate-700">Telefon Numaranız *</label>
                <input type="tel" required className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" placeholder="0555 555 5555" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700">İlgilendiğiniz Reklam Türü</label>
              <select className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all">
                <option value="banner">Banner Reklamı (Ana Sayfa & Kategoriler)</option>
                <option value="sponsor">Sponsorlu İlan Gösterimi</option>
                <option value="mail">E-Bülten Sponsorluğu</option>
                <option value="other">Diğer Kampanyalar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700">Kampanya Detayları ve Hedefleriniz</label>
              <textarea rows={4} className="w-full p-4 rounded-xl border border-[var(--border)] bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all resize-none" placeholder="Ne tarz bir reklam çalışması düşünüyorsunuz? Hedef kitleniz kimler?"></textarea>
            </div>

            <Button type="submit" size="lg" variant="gradient" fullWidth rightIcon={<Send size={18} />} className="mt-2 h-14 text-base">
              Talebi Gönder
            </Button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Göndererek gizlilik politikasını kabul etmiş olursunuz.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
