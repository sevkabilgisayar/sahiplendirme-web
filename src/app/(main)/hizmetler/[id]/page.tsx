'use client';

import { useParams } from 'next/navigation';
import { Star, MapPin, Phone, Mail, Globe, CheckCircle, Shield, Award, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HizmetProviderDetayPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Cover & Header */}
      <div className="h-64 bg-slate-200 relative">
        <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <Card className="p-6 md:p-8 border-0 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Vet+Life&background=0D8ABC&color=fff&size=128" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold font-display">VetLife Veteriner Kliniği</h1>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                      <CheckCircle size={12} /> Onaylı Uzman
                    </span>
                  </div>
                  <p className="text-[var(--foreground-muted)] flex items-center gap-2 mb-3">
                    <MapPin size={16} /> İstanbul, Kadıköy
                  </p>
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Star size={16} className="fill-orange-500" /> 4.9 (128 Değerlendirme)
                    </div>
                    <div className="text-green-600">Açık - 22:00'a kadar</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[var(--border)] pt-6">
                <h2 className="text-xl font-bold mb-4">Hakkımızda</h2>
                <p className="text-[var(--foreground-muted)] leading-relaxed">
                  10 yılı aşkın tecrübemizle can dostlarınızın sağlığı için 7/24 hizmetinizdeyiz. Tam donanımlı kliniğimizde röntgen, ultrason, laboratuvar ve cerrahi operasyon hizmetleri sunmaktayız. Uzman kadromuzla yanınızdayız.
                </p>
              </div>

              <div className="mt-8 border-t border-[var(--border)] pt-6">
                <h2 className="text-xl font-bold mb-4">Hizmetlerimiz</h2>
                <div className="flex flex-wrap gap-2">
                  {['Genel Muayene', 'Aşılama', 'Cerrahi Operasyon', 'Röntgen/Ultrason', 'Diş Bakımı', 'Laboratuvar', '7/24 Acil'].map(s => (
                    <span key={s} className="bg-[var(--surface-secondary)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-sm">{s}</span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Yorumlar */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Değerlendirmeler</h2>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border-b border-[var(--border)] last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Ayşe D.</div>
                      <div className="flex items-center gap-1 text-orange-500 text-xs">
                        {Array(5).fill(0).map((_, i) => <Star key={i} size={12} className="fill-orange-500" />)}
                        <span className="text-slate-400 ml-2">2 gün önce</span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)]">Kedimizin kısırlaştırma operasyonunu burada yaptırdık. Çok ilgililer, her aşamada bilgi verdiler. Tavsiye ederim.</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" fullWidth className="mt-4">Tüm Değerlendirmeleri Gör</Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">İletişim Bilgileri</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--foreground-muted)] mt-0.5" />
                  <div className="text-sm text-[var(--foreground)]">Caferağa Mah. Moda Cad. No: 123 Kadıköy / İstanbul</div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[var(--foreground-muted)]" />
                  <a href="tel:02160000000" className="text-sm font-semibold hover:text-[var(--brand-primary)]">0216 000 00 00</a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-[var(--foreground-muted)]" />
                  <a href="#" className="text-sm hover:text-[var(--brand-primary)]">www.vetlife.com.tr</a>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="gradient" fullWidth leftIcon={<Phone size={16} />}>Hemen Ara</Button>
                <Button variant="outline" className="w-12 p-0 flex items-center justify-center"><Mail size={16} /></Button>
              </div>
            </Card>

            <Card className="p-6 bg-orange-50 border-orange-100">
              <div className="flex items-center gap-2 font-bold text-orange-800 mb-2">
                <Shield size={18} /> Sahiplendirme Güvencesi
              </div>
              <p className="text-xs text-orange-700 leading-relaxed">
                Bu işletme Sahiplendirme.com ekibi tarafından belgesel olarak doğrulanmış profesyonel bir hizmet sağlayıcıdır.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={16} /> Çalışma Saatleri</h3>
              <ul className="text-sm space-y-2 text-[var(--foreground-muted)]">
                <li className="flex justify-between"><span>Pazartesi - Cuma</span><span className="font-medium text-[var(--foreground)]">09:00 - 22:00</span></li>
                <li className="flex justify-between"><span>Cumartesi</span><span className="font-medium text-[var(--foreground)]">10:00 - 20:00</span></li>
                <li className="flex justify-between text-red-500"><span>Pazar</span><span>Acil Vaka Sadece</span></li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
