import { Metadata } from 'next';
import { Heart, Shield, Sparkles, Users, Globe, Award } from 'lucide-react';

export const metadata: Metadata = { title: 'Hakkımızda — Sahiplendirme.com' };

export default function HakkimizdaPage() {
  const stats = [
    { value: '12.000+', label: 'Mutlu Hayvan', icon: '🐾' },
    { value: '45.000+', label: 'Aktif Üye', icon: '👥' },
    { value: '200+', label: 'Barınak & Vakıf', icon: '🏛️' },
    { value: '81', label: 'İl Genelinde', icon: '📍' },
  ];

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">Hakkımızda</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Sahiplendirme.com, Türkiye&apos;nin yapay zekâ destekli ilk hayvan sahiplendirme platformudur. Amacımız her hayvana sıcak bir yuva bulmak.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold font-display">{s.value}</div>
              <div className="text-sm text-[var(--foreground-muted)]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold font-display mb-4">🎯 Misyonumuz</h2>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              Teknoloji ve yapay zekânın gücünü hayvan refahı için kullanarak, sahiplendirme süreçlerini hızlandırmak, kayıp hayvanları bulma oranını artırmak ve profesyonel hizmet sağlayıcıları hayvan severlerle buluşturmak.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-6">🚀 Neler Sunuyoruz?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🏠', title: 'Sahiplendirme', desc: 'Köpek, kedi ve kuş sahiplendirme ilanlarıyla hayvanların sıcak yuvalara kavuşmasını sağlıyoruz.' },
                { icon: '🔍', title: 'Kayıp Hayvan Ağı', desc: 'Gördüm ihbar sistemi ile kayıp hayvanları hızlıca bulmak için topluluk gücünü kullanıyoruz.' },
                { icon: '🤖', title: 'AI Danışman', desc: 'Yapay zekâ destekli danışmanımız; hayvan bakımı, ırk seçimi ve sağlık konularında yardımcı oluyor.' },
              ].map((item) => (
                <div key={item.title} className="bg-[var(--surface-secondary)] rounded-2xl p-6 border border-[var(--border)]">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display mb-4">📧 İletişim</h2>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-2 text-sm">
              <p>E-posta: <a href="mailto:destek@sahiplendirme.com" className="text-[var(--brand-primary)] font-medium hover:underline">destek@sahiplendirme.com</a></p>
              <p>KVKK: <a href="mailto:kvkk@sahiplendirme.com" className="text-[var(--brand-primary)] font-medium hover:underline">kvkk@sahiplendirme.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
