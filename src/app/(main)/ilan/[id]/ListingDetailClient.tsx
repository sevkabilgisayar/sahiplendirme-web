'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ChevronRight, Heart, Share2, AlertTriangle, Phone, Mail, MapPin,
  CheckCircle, ShieldCheck, Eye, Flag, Clock, Award, Camera, Send,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { HOUSING_OPTIONS, LOSS_TIME_OPTIONS, CITIES } from '@/constants';

const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl border border-[var(--border)]" />,
});

// Mock sightings
const mockSightings = [
  { id: '1', user: 'Mehmet K.', time: 'Dün', location: 'Kadıköy, İstanbul', note: 'Parkta gördüm, tasması yoktu.', createdAt: '2 saat önce' },
  { id: '2', user: 'Ayşe T.', time: '2 Gün Önce', location: 'Beşiktaş, İstanbul', note: 'Sokakta koşuyordu.', createdAt: '5 saat önce' },
];

export default function ListingDetailClient({ listing }: { listing: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isSightingModalOpen, setIsSightingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Başvuru formu state
  const [appMessage, setAppMessage] = useState('');
  const [appCity, setAppCity] = useState('');
  const [appHousing, setAppHousing] = useState('');
  const [appConsent, setAppConsent] = useState(false);

  // Gördüm formu state
  const [sightTime, setSightTime] = useState('');
  const [sightLocation, setSightLocation] = useState('');
  const [sightNote, setSightNote] = useState('');

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Bağlantı kopyalandı!');
  };

  const handleAdopt = () => {
    if (!appMessage || !appCity || !appHousing || !appConsent) {
      toast.error('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setIsAdoptModalOpen(false);
    toast.success('Sahiplenme talebiniz iletildi. İlan sahibi sizinle iletişime geçecektir.', { duration: 5000 });
    setAppMessage(''); setAppCity(''); setAppHousing(''); setAppConsent(false);
  };

  const handleSighting = () => {
    if (!sightTime || !sightLocation) {
      toast.error('Zaman ve konum alanları zorunludur.');
      return;
    }
    setIsSightingModalOpen(false);
    toast.success('İhbarınız iletildi! İlan sahibi bilgilendirilecek.', { duration: 5000 });
    setSightTime(''); setSightLocation(''); setSightNote('');
  };

  const handleReport = () => {
    setIsReportModalOpen(false);
    toast.success('Şikayetiniz alındı. Ekibimiz inceleyecektir.');
  };

  const isKayip = listing.type === 'kayip';
  const isSahiplendirme = listing.type === 'sahiplendirme';

  return (
    <div className="bg-[var(--background)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--brand-primary)]">Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href="/ilanlar" className="hover:text-[var(--brand-primary)]">İlanlar</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--foreground)] truncate font-medium">{listing.name} - {listing.breed}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <div className="mb-8">
              <div className={`w-full aspect-[4/3] sm:aspect-[16/9] bg-gradient-to-br ${listing.gallery[activeImage]} rounded-3xl mb-4 flex items-center justify-center border border-[var(--border)] shadow-sm transition-all duration-500`}>
                <span className="text-9xl animate-float">{listing.emoji}</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {listing.gallery.map((bg: string, idx: number) => (
                  <button key={idx} onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gradient-to-br ${bg} rounded-2xl flex items-center justify-center border-2 transition-all snap-start ${
                      activeImage === idx ? 'border-[var(--brand-primary)] scale-100 shadow-md' : 'border-transparent scale-95 opacity-70 hover:opacity-100'
                    }`}>
                    <span className="text-4xl">{listing.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title + Meta */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)]">
                  {listing.name} - {listing.breed}
                </h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={handleShare} className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary-light)] transition-colors bg-[var(--surface)]">
                    <Share2 size={18} />
                  </button>
                  <button onClick={() => { setIsFav(!isFav); toast.success(isFav ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi'); }}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors bg-[var(--surface)] ${isFav ? 'border-red-300 text-red-500 bg-red-50' : 'border-[var(--border)] text-[var(--foreground-muted)] hover:text-red-500 hover:border-red-200'}`}>
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[var(--foreground-muted)] font-medium flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={16} className="text-[var(--brand-primary)]" />{listing.location.address}</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {listing.viewCount || 124} görüntülenme</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {listing.createdAt || '2 gün önce'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-xl font-bold font-display mb-4">Açıklama</h2>
              <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] text-[var(--foreground)] leading-relaxed">
                {listing.description}
              </div>
            </div>

            {/* Attributes */}
            <div className="mb-10">
              <h2 className="text-xl font-bold font-display mb-4">Özellikler</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listing.attributes.map((attr: any, idx: number) => (
                  <div key={idx} className="bg-[var(--surface-secondary)] p-4 rounded-2xl border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--foreground-muted)] mb-1">{attr.label}</div>
                    <div className="font-semibold text-sm">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kayıp: Gördüm İhbarları (Madde 6.1) */}
            {isKayip && (
              <div className="mb-10">
                <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                  📍 Gördüm İhbarları <span className="text-sm font-normal text-[var(--foreground-muted)]">({mockSightings.length})</span>
                </h2>
                <div className="space-y-3">
                  {mockSightings.map((s) => (
                    <div key={s.id} className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {s.user.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{s.user}</span>
                          <span className="text-xs text-[var(--foreground-muted)]">{s.createdAt}</span>
                        </div>
                        <div className="text-xs text-[var(--foreground-muted)] mb-1">
                          📍 {s.location} · ⏰ {s.time}
                        </div>
                        <p className="text-sm">{s.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Embed (Madde 5.A.2) */}
            {listing.videoLink && (
              <div className="mb-10">
                <h2 className="text-xl font-bold font-display mb-4">Video</h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm bg-slate-900">
                  <iframe
                    src={listing.videoLink.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="İlan videosu"
                  />
                </div>
              </div>
            )}

            {/* Map — Yaklaşık/Tam Konum Toggle (Madde 5.D) */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-display">
                  Konum
                </h2>
                <div className="flex items-center gap-1 bg-[var(--surface-secondary)] rounded-xl p-1 text-xs border border-[var(--border)]">
                  <button className="px-3 py-1.5 rounded-lg bg-white shadow-sm font-semibold text-[var(--foreground)]">
                    Yaklaşık
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors font-medium">
                    Tam Konum
                  </button>
                </div>
              </div>
              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-sm border border-[var(--border)]">
                <Map center={[listing.location.lat, listing.location.lng]} popupText={listing.city} zoom={12} />
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mt-2 flex items-center gap-1">
                <MapPin size={12} /> Haritada yaklaşık konum gösterilmektedir. Tam adres için ilan sahibiyle iletişime geçin.
              </p>
            </div>

            {/* Şikayet + Güvenlik (Mobile) */}
            <div className="flex flex-col gap-3 mb-8 lg:hidden">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-3 text-orange-800 text-sm">
                <AlertTriangle size={20} className="flex-shrink-0 text-orange-500" />
                <div><strong>Güvenlik Uyarısı:</strong> Asla ön ödeme göndermeyin.</div>
              </div>
              <button onClick={() => setIsReportModalOpen(true)} className="flex items-center justify-center gap-2 text-sm text-red-500 hover:underline">
                <Flag size={14} /> Bu ilanı şikayet et
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">

              {/* Action Card */}
              <Card className="p-6 border-[var(--border)] shadow-md">
                <div className="mb-6">
                  {listing.reward ? (
                    <div>
                      <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Kayıp Ödülü</div>
                      <div className="text-4xl font-bold font-display text-[var(--foreground)]">₺{listing.reward}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Sahiplendirme Ücreti</div>
                      <div className="text-4xl font-bold font-display text-green-500">Ücretsiz</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {isSahiplendirme && (
                    <Button size="lg" variant="gradient" fullWidth className="h-14 text-base" onClick={() => setIsAdoptModalOpen(true)}>
                      Sahiplenme Talebi Gönder
                    </Button>
                  )}
                  {isKayip && (
                    <Button size="lg" variant="gradient" fullWidth className="h-14 text-base" onClick={() => setIsSightingModalOpen(true)}
                      leftIcon={<Eye size={20} />}>
                      Gördüm! İhbar Et
                    </Button>
                  )}
                  {!isSahiplendirme && !isKayip && (
                    <Button size="lg" variant="gradient" fullWidth className="h-14 text-base">
                      İletişime Geç
                    </Button>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 h-12" leftIcon={<Phone size={18} />}>Ara</Button>
                    <Button variant="outline" className="flex-1 h-12" leftIcon={<Mail size={18} />}>Mesaj</Button>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                  <ShieldCheck size={14} className="text-green-500" /> Editör onaylı ilan
                </div>
              </Card>

              {/* Owner Info */}
              <Card className="p-5 border-[var(--border)] bg-[var(--surface-secondary)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    {listing.owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--foreground)] flex items-center gap-1">
                      {listing.owner.name} <CheckCircle size={14} className="text-blue-500" />
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">{listing.ownerType === 'sahibinde' ? 'Bireysel Üye' : 'Kurumsal / Barınak'}</div>
                    <div className="text-xs text-[var(--foreground-muted)] mt-0.5">Üyelik: {listing.owner.memberSince}</div>
                  </div>
                </div>
                <Link href="#" className="text-sm font-semibold text-[var(--brand-primary)] hover:underline block text-center mt-2">
                  Kullanıcının diğer ilanları →
                </Link>
              </Card>

              {/* Warning + Report Desktop */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 gap-3 text-orange-800 text-sm hidden lg:flex shadow-sm">
                <AlertTriangle size={20} className="flex-shrink-0 text-orange-500 mt-0.5" />
                <div className="leading-relaxed"><strong className="block mb-1">Güvenlik Uyarısı</strong> Asla ön ödeme göndermeyin.</div>
              </div>
              <button onClick={() => setIsReportModalOpen(true)} className="hidden lg:flex items-center justify-center gap-2 text-sm text-red-500 hover:underline">
                <Flag size={14} /> Bu ilanı şikayet et
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== MODAL: Sahiplenme Başvurusu (Madde 5.B) ===== */}
      <Modal isOpen={isAdoptModalOpen} onClose={() => setIsAdoptModalOpen(false)} title="Sahiplenme Talebi">
        <div className="p-1 flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            <strong>{listing.name}</strong> için sahiplenme talebi göndereceksiniz.
          </p>

          {/* Şehir (Madde 5.B) */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Bulunduğunuz Şehir *</label>
            <select value={appCity} onChange={(e) => setAppCity(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]">
              <option value="">Şehir seçin</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Ev/Yaşam Koşulu (Madde 5.B) */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Yaşam Koşulunuz *</label>
            <select value={appHousing} onChange={(e) => setAppHousing(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]">
              <option value="">Seçin</option>
              {HOUSING_OPTIONS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Kendinizden bahsedin *</label>
            <textarea value={appMessage} onChange={(e) => setAppMessage(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none h-28"
              placeholder="Örn: Evliyim, bahçeli bir evde yaşıyorum. Daha önce köpek tecrübem oldu..." />
          </div>

          {/* Onay */}
          <div className="bg-[var(--surface-secondary)] p-3 rounded-xl border border-[var(--border)]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={appConsent} onChange={(e) => setAppConsent(e.target.checked)}
                className="mt-1 rounded accent-[var(--brand-primary)]" />
              <span className="text-xs text-[var(--foreground-muted)]">İletişim bilgilerimin ilan sahibiyle paylaşılmasına onay veriyorum.</span>
            </label>
          </div>

          <Button variant="gradient" fullWidth size="lg" onClick={handleAdopt}>Talebi Gönder</Button>
        </div>
      </Modal>

      {/* ===== MODAL: Gördüm İhbarı (Madde 6.1) ===== */}
      <Modal isOpen={isSightingModalOpen} onClose={() => setIsSightingModalOpen(false)} title="Gördüm İhbarı">
        <div className="p-1 flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            <strong>{listing.name}</strong> adlı kayıp hayvanı gördüyseniz bilgi verin.
          </p>

          {/* Görülme zamanı */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Ne zaman gördünüz? *</label>
            <select value={sightTime} onChange={(e) => setSightTime(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]">
              <option value="">Seçin</option>
              {LOSS_TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Görülme konumu */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Nerede gördünüz? *</label>
            <input type="text" value={sightLocation} onChange={(e) => setSightLocation(e.target.value)}
              placeholder="örn: Kadıköy Moda Parkı yakını"
              className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
          </div>

          {/* Not */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Ek Not</label>
            <textarea value={sightNote} onChange={(e) => setSightNote(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none h-20"
              placeholder="Hayvanın durumu, yönü vb..." />
          </div>

          {/* Fotoğraf (opsiyonel) */}
          <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors rounded-xl p-4 flex items-center justify-center gap-3 text-center cursor-pointer bg-[var(--surface-secondary)]">
            <input type="file" accept="image/*" className="hidden" />
            <Camera size={20} className="text-[var(--brand-primary)]" />
            <span className="text-sm text-[var(--foreground-muted)]">Fotoğraf ekle (opsiyonel)</span>
          </label>

          <Button variant="gradient" fullWidth size="lg" onClick={handleSighting} leftIcon={<Send size={16} />}>
            İhbarı Gönder
          </Button>
        </div>
      </Modal>

      {/* ===== MODAL: Şikayet ===== */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="İlanı Şikayet Et">
        <div className="p-1 flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">Bu ilanı neden şikayet ediyorsunuz?</p>
          <div className="flex flex-col gap-2">
            {['Sahte ilan', 'Tekrarlayan ilan', 'Uygunsuz içerik', 'Aldatıcı bilgi', 'Diğer'].map((r) => (
              <label key={r} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer hover:bg-[var(--surface-secondary)] transition-colors">
                <input type="radio" name="report" className="accent-[var(--brand-primary)]" />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
          <Button variant="danger" fullWidth onClick={handleReport}>Şikayeti Gönder</Button>
        </div>
      </Modal>
    </div>
  );
}
