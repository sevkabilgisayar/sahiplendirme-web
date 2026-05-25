'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, MapPin, Phone, Mail, Globe, CheckCircle, Shield, Clock, ArrowLeft, ChevronRight, Share2, Image as ImageIcon, Play, X } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SERVICE_CATEGORIES } from '@/constants';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/Map'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-400 animate-pulse">Harita Yükleniyor...</div>
});

export default function HizmetProviderDetayPage() {
  const params = useParams();
  const id = params.id as string;
  const [service, setService] = useState<any>(null);
  const [similarServices, setSimilarServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const found = d.services.find((s:any) => s.id === id) || d.services[0];
          setService(found);
          setSimilarServices(d.services.filter((s:any) => s.category === found.category && s.id !== found.id).slice(0, 3));
        }
      });
  }, [id]);

  if (!service) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  const catInfo = SERVICE_CATEGORIES.find(c => c.value === service.category);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  return (
    <div className="bg-[var(--background)] min-h-screen">

      {/* Cover */}
      <div className="h-52 sm:h-64 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1400&auto=format&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Back */}
        <Link href="/hizmetler" className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={14} /> Hizmetler
        </Link>
        {/* Breadcrumb */}
        <div className="absolute bottom-4 left-4 text-white/70 text-xs flex items-center gap-1">
          <Link href="/" className="hover:text-white">Ana Sayfa</Link>
          <ChevronRight size={10} />
          <Link href="/hizmetler" className="hover:text-white">Hizmetler</Link>
          <ChevronRight size={10} />
          <span className="text-white font-medium truncate max-w-[180px]">{service.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main */}
          <div className="flex-1 space-y-6">

            {/* Profile Header Card */}
            <Card className="p-6 sm:p-8 border-0 shadow-md">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${service.color} flex items-center justify-center text-5xl flex-shrink-0 shadow-sm`}>
                  {service.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold font-display">{service.name}</h1>
                    {service.verified && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle size={11} /> Onaylı
                      </span>
                    )}
                    {service.featured && (
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">
                        ⭐ Öne Çıkan
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--foreground-muted)] flex items-center gap-1.5 text-sm mb-2">
                    <MapPin size={14} /> {service.district}, {service.city}
                  </p>
                  <div className="flex items-center gap-4 text-sm font-semibold flex-wrap">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Star size={14} className="fill-orange-500" /> {service.rating}
                      <span className="font-normal text-[var(--foreground-muted)] text-xs">({service.reviews} değerlendirme)</span>
                    </div>
                    <span className="text-emerald-600 text-sm font-bold">{service.price}</span>
                    <span className="text-xs text-[var(--brand-primary)] font-bold uppercase">{catInfo?.emoji} {catInfo?.label}</span>
                  </div>
                </div>
                <button className="p-2 rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors text-[var(--foreground-muted)]">
                  <Share2 size={18} />
                </button>
              </div>

              {/* About */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h2 className="text-lg font-bold mb-3">Hakkında</h2>
                <p className="text-[var(--foreground-muted)] leading-relaxed text-sm">{service.about}</p>
              </div>

              {/* Services */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h2 className="text-lg font-bold mb-3">Sunduğu Hizmetler</h2>
                <div className="flex flex-wrap gap-2">
                  {service.services.map(s => (
                    <span key={s} className="bg-[var(--surface-secondary)] border border-[var(--border)] text-sm px-3 py-1.5 rounded-xl font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Görsel & Video Galerisi */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-[var(--brand-primary)]" /> Fotoğraf & Videolar
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {/* Görseller */}
                  {[
                    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1000&auto=format&fit=crop',
                  ].map((src, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedMedia(src)}
                      className="aspect-square rounded-2xl overflow-hidden border border-[var(--border)] hover:scale-[1.02] transition-transform cursor-pointer shadow-sm"
                    >
                      <img src={src} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {/* Video Thumbnail */}
                  <div 
                    onClick={() => setSelectedMedia('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1000&auto=format&fit=crop')}
                    className="aspect-square rounded-2xl overflow-hidden border border-[var(--border)] relative hover:scale-[1.02] transition-transform cursor-pointer shadow-sm group"
                  >
                    <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop" alt="Video" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play size={16} className="text-[var(--brand-primary)] fill-[var(--brand-primary)] ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">0:42</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Star size={18} className="text-orange-400 fill-orange-400" /> Değerlendirmeler
              </h2>
              <div className="space-y-5">
                {[
                  { name: 'Ayşe D.', text: 'Çok ilgililer, her aşamada bilgi verdiler. Kesinlikle tavsiye ederim.', rating: 5, time: '2 gün önce' },
                  { name: 'Mert K.', text: 'Köpeğim çok mutlu oldu, tekrar geleceğiz.', rating: 5, time: '1 hafta önce' },
                  { name: 'Selin Y.', text: 'Profesyonel ve temiz ortam. Fiyat performans çok iyi.', rating: 4, time: '2 hafta önce' },
                ].map((r, i) => (
                  <div key={i} className="border-b border-[var(--border)] last:border-0 pb-5 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm">{r.name}</div>
                      <div className="flex items-center gap-1 text-orange-400 text-xs">
                        {Array(r.rating).fill(0).map((_, j) => <Star key={j} size={11} className="fill-orange-400" />)}
                        <span className="text-slate-400 ml-2">{r.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)]">{r.text}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" fullWidth className="mt-4">Tüm Değerlendirmeleri Gör</Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-5">

            {/* Contact & Map */}
            <Card className="p-6 shadow-sm overflow-hidden flex flex-col">
              <h3 className="font-bold text-base mb-4">İletişim Bilgileri</h3>
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[var(--foreground-muted)] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[var(--foreground)]">{service.address}</div>
                </div>
                {service.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-[var(--foreground-muted)] flex-shrink-0" />
                    <a href={`tel:${service.phone}`} className="text-sm font-semibold hover:text-[var(--brand-primary)]">{service.phone}</a>
                  </div>
                )}
                {service.web && (
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-[var(--foreground-muted)] flex-shrink-0" />
                    <a href={`https://${service.web}`} target="_blank" rel="noreferrer" className="text-sm hover:text-[var(--brand-primary)] truncate">{service.web}</a>
                  </div>
                )}
              </div>
              
              {/* Harita */}
              {service.latitude && service.longitude && (
                <div className="h-48 rounded-xl border border-[var(--border)] overflow-hidden mb-5 -mx-2">
                  <Map center={[service.latitude, service.longitude]} zoom={14} popupText={service.name} />
                </div>
              )}

              <div className="mt-auto flex gap-2">
                <Button variant="gradient" fullWidth leftIcon={<Phone size={15} />}>Hemen Ara</Button>
                <Button variant="outline" className="w-12 p-0 flex items-center justify-center flex-shrink-0"><Mail size={16} /></Button>
              </div>
            </Card>

            {/* Hours */}
            <Card className="p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm"><Clock size={15} /> Çalışma Saatleri</h3>
              <ul className="text-sm space-y-2">
                <li className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Pzt – Cum</span>
                  <span className="font-semibold">{service.hours?.hafta || '09:00 - 18:00'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">Cumartesi</span>
                  <span className="font-semibold">{service.hours?.cumartesi || '09:00 - 14:00'}</span>
                </li>
                <li className="flex justify-between">
                  <span className={service.hours?.pazar === 'Kapalı' ? 'text-red-500' : 'text-[var(--foreground-muted)]'}>Pazar</span>
                  <span className={`font-semibold ${service.hours?.pazar === 'Kapalı' ? 'text-red-500' : ''}`}>{service.hours?.pazar || 'Kapalı'}</span>
                </li>
              </ul>
            </Card>

            {/* Trust Badge */}
            <Card className="p-5 bg-orange-50 border-orange-100">
              <div className="flex items-center gap-2 font-bold text-orange-800 mb-2 text-sm">
                <Shield size={16} /> Sahiplendirme Güvencesi
              </div>
              <p className="text-xs text-orange-700 leading-relaxed">
                Bu işletme Sahiplendirme.com ekibi tarafından belgesel olarak doğrulanmış ve onaylanmış profesyonel bir hizmet sağlayıcıdır.
              </p>
            </Card>

            {/* Other services */}
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-4">Benzer Hizmetler</h3>
              <div className="space-y-3">
                {similarServices.map(s => (
                  <Link key={s.id} href={`/hizmetler/${s.id}`} className="flex items-center gap-3 hover:bg-[var(--surface-secondary)] rounded-xl p-2 -mx-2 transition-colors">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl flex-shrink-0`}>{s.emoji}</div>
                    <div>
                      <div className="text-xs font-semibold line-clamp-1">{s.name}</div>
                      <div className="text-[10px] text-[var(--foreground-muted)]">{s.district}, {s.city}</div>
                    </div>
                    <div className="ml-auto text-[10px] flex items-center gap-0.5 text-orange-500">
                      <Star size={9} className="fill-orange-500" />{s.rating}
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedMedia(null)}>
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setSelectedMedia(null)}
          >
            <X size={24} />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedMedia} 
              alt="Büyük Görsel" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
