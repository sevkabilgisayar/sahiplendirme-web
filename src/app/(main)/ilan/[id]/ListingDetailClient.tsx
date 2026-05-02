'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ChevronRight, Heart, Share2, AlertTriangle, Phone, Mail, MapPin,
  CheckCircle, ShieldCheck, Eye, Flag, Clock, Award, Camera, Send,
  Sparkles, Bot, User, X, ChevronDown, ChevronUp, Zap, Star, Tag, Package2, ShoppingBag, Info,
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

type AiMessage = { role: 'user' | 'ai'; text: string };

const AI_QUICK_QUESTIONS = [
  'Bu hayvan bana uygun mu?',
  'Hangi yaşam koşullarına uyar?',
  'Bakım gereksinimleri neler?',
  'Çocuklarla geçinir mi?',
];

function getAIReply(question: string, listing: any): string {
  const q = question.toLowerCase();
  const name = listing.name || 'Bu hayvan';
  const breed = listing.breed || 'ırk';
  const animal = listing.animalType || 'hayvan';

  if (q.includes('uygun') || q.includes('bana')) {
    return `🐾 ${name} (${breed}), genel olarak aktif ve sevecen bir yapıya sahip. Eğer evcil hayvan deneyiminiz varsa ve vakit ayırabiliyorsanız harika bir seçim olabilir! Yaşam koşullarınız hakkında daha fazla bilgi verirseniz daha net bir değerlendirme yapabilirim.`;
  }
  if (q.includes('yaşam') || q.includes('koşul') || q.includes('ev') || q.includes('daire')) {
    return `🏠 ${name} için ideal ortam: Bahçeli ya da büyükçe bir ev tercih edilir. Ancak düzenli egzersiz ve oyun alanı sağlandığında apartman hayatına da adapte olabilir.`;
  }
  if (q.includes('bakım') || q.includes('gereksinim') || q.includes('beslen')) {
    return `🦴 ${name} için bakım: Günlük mama ve taze su, haftada en az 3 gün yürüyüş, düzenli tüy/tırnak bakımı ve yılda 2 kez veteriner kontrolü önerilir.`;
  }
  if (q.includes('çocuk') || q.includes('bebek')) {
    return `👶 ${name} genel olarak çocuklarla iyi geçinir. Yine de ilk tanışma aşamasında yetişkin gözetimi önerilir. Hayvanı tedrici şekilde aile üyeleriyle tanıştırın.`;
  }
  return `🤖 "${question}" sorunuz için: ${name} hakkında daha detaylı bilgi almak ister misiniz? Yaşam koşullarınızı (ev/daire, çocuk durumu, deneyim) paylaşırsanız kişiselleştirilmiş öneri sunabilirim.`;
}

export default function ListingDetailClient({ listing }: { listing: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isSightingModalOpen, setIsSightingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // AI Danışman state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const aiEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiOpen && aiMessages.length === 0) {
      setAiMessages([{ role: 'ai', text: `Merhaba! 🐾 **${listing.name}** ilanı hakkında merak ettiklerini sorabilirsin. Bu hayvanın sana uygun olup olmadığını, bakım gereksinimlerini veya yaşam koşullarını konuşabiliriz.` }]);
    }
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isAiOpen, aiMessages]);

  const sendAiMessage = (text: string) => {
    if (!text.trim() || aiLoading) return;
    const userMsg: AiMessage = { role: 'user', text };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'ai', text: getAIReply(text, listing) }]);
      setAiLoading(false);
    }, 900);
  };

  // Modal states
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(true); // Otomatik açılır
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('7gun');

  // Öne çıkarma planları
  const FEATURED_PLANS = [
    { id: '3gun', label: '3 Gün', price: 29, badge: '', desc: 'Hızlı görünürlük' },
    { id: '7gun', label: '7 Gün', price: 49, badge: '⭐ Popüler', desc: 'En çok tercih edilen' },
    { id: '30gun', label: '30 Gün', price: 149, badge: '🔥 Fırsat', desc: 'En uzun süre, en düşük günlük maliyet' },
  ];

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
  const isCiftlestirme = listing.type === 'ciftlestirme';

  const listingTypeBadge = ({
    sahiplendirme: { label: '🏠 Sahiplendirme İlanı', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    kayip: { label: '🔍 Kayıp Hayvan İlanı', color: 'bg-red-100 text-red-700 border-red-200' },
    ciftlestirme: { label: '💕 Çiftleştirme İlanı', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  } as Record<string, { label: string; color: string }>)[listing.type] || { label: 'İlan', color: 'bg-gray-100 text-gray-700 border-gray-200' };

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
              {/* Ana fotoğraf */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl mb-4 overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--surface-secondary)]">
                {listing.photos?.[activeImage] ? (
                  <img
                    src={listing.photos[activeImage]}
                    alt={`${listing.name} - fotoğraf ${activeImage + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=${encodeURIComponent(listing.name)}`; }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${listing.imageColor || 'from-orange-100 to-amber-200'} flex items-center justify-center`}>
                    <span className="text-9xl">{listing.emoji}</span>
                  </div>
                )}
              </div>
              {/* Thumbnail'lar */}
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {(listing.photos && listing.photos.length > 0 ? listing.photos : [listing.imageColor]).map((photo: string, idx: number) => (
                  <button key={idx} onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all snap-start ${
                      activeImage === idx ? 'border-[var(--brand-primary)] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}>
                    {listing.photos?.[idx] ? (
                      <img src={listing.photos[idx]} alt={`Fotoğraf ${idx + 1}`} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${photo} flex items-center justify-center`}>
                        <span className="text-4xl">{listing.emoji}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Title + Meta */}
            <div className="mb-8">
              {/* İlan Türü Badge - büyük ve belirgin */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border-2 ${listingTypeBadge.color}`}>
                  {listingTypeBadge.label}
                </span>
              </div>
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
                <span className="ml-auto text-[10px] font-mono bg-[var(--surface-secondary)] border border-[var(--border)] px-2 py-0.5 rounded-md text-[var(--foreground-muted)] select-all cursor-pointer" title="İlan numarası">
                  #İlan {String(listing.id).padStart(5, '0')}
                </span>
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
            <div className="sticky top-24 flex flex-col gap-6 max-h-[calc(100vh-7rem)] overflow-y-auto pb-4 pr-1">

              {/* Action Card */}
              <Card className="p-6 border-[var(--border)] shadow-md">
                {/* İlan No */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--foreground-muted)] font-medium">İlan No</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(String(listing.id).padStart(5, '0'));
                      toast.success('İlan no kopyalandı!');
                    }}
                    className="font-mono text-sm font-bold text-[var(--brand-primary)] bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg hover:bg-orange-100 transition-colors"
                    title="Kopyalamak için tıkla"
                  >
                    #{String(listing.id).padStart(5, '0')}
                  </button>
                </div>
                <div className="mb-6">
                  {listing.reward ? (
                    <div>
                      <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">KAYIP ÖDÜLÜ</div>
                      <div className="text-4xl font-bold font-display text-[var(--foreground)]">₺{listing.reward}</div>
                    </div>
                  ) : isCiftlestirme ? (
                    <div>
                      <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">ÇİFTLEŞTİRME</div>
                      <div className="text-2xl font-bold font-display text-purple-600">💕 Eşleştirme İlanı</div>
                    </div>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-2 ${listingTypeBadge.color}`}>
                      <span className="text-lg font-bold">{listingTypeBadge.label}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {/* Öne Çıkar Butonu */}
                  <button
                    onClick={() => setIsFeaturedModalOpen(true)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 hover:border-yellow-400 transition-all"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                      <Zap size={14} className="text-yellow-500" /> İlanı Öne Çıkar
                    </span>
                    <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">₺29&apos;dan</span>
                  </button>

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

                  {/* AI Danışman Butonu + Panel - sadece sahiplendirme ve çiftleştirmede */}
                  {!isKayip && (
                    <>
                      <button
                        onClick={() => setIsAiOpen(!isAiOpen)}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-300 text-sm font-semibold ${
                          isAiOpen
                            ? 'border-[var(--brand-primary)] bg-orange-50 text-[var(--brand-primary)]'
                            : 'border-dashed border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--brand-primary-light)] hover:text-[var(--brand-primary)] hover:bg-orange-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                            isAiOpen ? 'gradient-brand text-white shadow-sm' : 'bg-[var(--surface-secondary)]'
                          }`}>
                            <Sparkles size={14} />
                          </span>
                          Bana Uygun mu? AI'ya Sor
                        </span>
                        {isAiOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {/* AI Chat Panel */}
                      {isAiOpen && (
                        <div className="animate-fade-in border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface-secondary)]">
                          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-[var(--border)]">
                            <div className="w-7 h-7 gradient-brand rounded-xl flex items-center justify-center">
                              <Bot size={14} className="text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[var(--foreground)]">AI Danışman</div>
                              <div className="text-[10px] text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Çevrimini
                              </div>
                            </div>
                          </div>
                          <div className="max-h-52 overflow-y-auto p-3 space-y-3">
                            {aiMessages.map((msg, i) => (
                              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-6 h-6 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-[10px] ${msg.role === 'ai' ? 'gradient-brand' : 'bg-slate-300'}`}>
                                  {msg.role === 'ai' ? <Bot size={11} /> : <User size={11} />}
                                </div>
                                <div className={`max-w-[85%] text-xs px-3 py-2 rounded-xl leading-relaxed ${msg.role === 'user' ? 'bg-[var(--brand-primary)] text-white rounded-tr-sm' : 'bg-white text-[var(--foreground)] border border-[var(--border)] rounded-tl-sm'}`}>
                                  {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                                </div>
                              </div>
                            ))}
                            {aiLoading && (
                              <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-xl gradient-brand flex items-center justify-center"><Bot size={11} className="text-white" /></div>
                                <div className="bg-white border border-[var(--border)] rounded-xl rounded-tl-sm px-3 py-2 flex gap-1 items-center">
                                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                </div>
                              </div>
                            )}
                            <div ref={aiEndRef} />
                          </div>
                          {aiMessages.length <= 1 && (
                            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                              {AI_QUICK_QUESTIONS.map((q) => (
                                <button key={q} onClick={() => sendAiMessage(q)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-full bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors">
                                  {q}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="px-3 pb-3 pt-1 flex gap-2">
                            <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAiMessage(aiInput)} placeholder="Sorunuzu yazın..." disabled={aiLoading} className="flex-1 h-9 px-3 rounded-xl border border-[var(--border)] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] placeholder:text-[var(--foreground-muted)]" />
                            <button onClick={() => sendAiMessage(aiInput)} disabled={!aiInput.trim() || aiLoading} className="w-9 h-9 rounded-xl gradient-brand text-white flex items-center justify-center disabled:opacity-40 flex-shrink-0 shadow-sm"><Send size={13} /></button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 gap-3 text-orange-800 text-sm hidden lg:flex flex-col shadow-sm">
                <div className="flex gap-3">
                  <AlertTriangle size={20} className="flex-shrink-0 text-orange-500 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="block mb-1">Güvenlik Uyarısı</strong>
                    Asla ön ödeme göndermeyin.
                  </div>
                </div>
                <div className="border-t border-orange-200 pt-3 text-[10px] text-orange-700 leading-relaxed space-y-1">
                  <div className="font-semibold text-[11px]">⚖️ 5199 Sayılı Hayvanları Koruma Kanunu</div>
                  <div>• Sahiplendirme ilanlarında ücret talep edilmesi yasaktır.</div>
                  <div>• Bu platform yalnızca aracılık hizmeti sunar.</div>
                  <div>• Ticari amaçlı hayvan satışı kanunen yasaktır.</div>
                  <button onClick={() => setIsLegalModalOpen(true)} className="text-orange-600 font-semibold hover:underline mt-1 block">Detaylı bilgi →</button>
                </div>
              </div>
              <button onClick={() => setIsReportModalOpen(true)} className="hidden lg:flex items-center justify-center gap-2 text-sm text-red-500 hover:underline">
                <Flag size={14} /> Bu ilanı şikayet et
              </button>

              {/* Şikayet altı reklam alanı */}
              <a href="/paketler" className="block group hidden lg:block">
                <div className="w-full h-[160px] bg-gradient-to-br from-violet-50 to-purple-100 border-2 border-dashed border-violet-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-violet-400 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={14} className="text-white" />
                  </div>
                  <div className="text-xs font-bold text-violet-600">REKLAM ALANI</div>
                  <div className="text-[10px] text-violet-400">300 × 160</div>
                  <div className="text-[9px] px-3 py-1 bg-violet-500 text-white font-bold rounded-full">Reklam Ver</div>
                </div>
              </a>

              {/* Yasal bilgilendirme linki */}
              <button
                onClick={() => setIsLegalModalOpen(true)}
                className="hidden lg:flex items-center justify-center gap-1.5 text-[10px] text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] transition-colors"
              >
                <Info size={11} /> Hayvan ticareti hakkında yasal bilgi
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== ÜRÜN ÖNERİLERİ ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 mb-6">
          <Package2 size={20} className="text-[var(--brand-primary)]" />
          <h2 className="text-xl font-bold font-display">Önerilen Ürünler</h2>
          <span className="text-xs text-[var(--foreground-muted)] ml-1">({listing.breed || listing.animalType} sahipleri için)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Premium Mama', brand: 'Royal Canin', price: '₺289', oldPrice: '₺350', img: '🥩', tag: '%17 İndirim' },
            { name: 'Oyun Halısı', brand: 'PetZone', price: '₺149', oldPrice: '', img: '🎯', tag: 'Yeni' },
            { name: 'Tasma & Gezdirme', brand: 'Flexi', price: '₺199', oldPrice: '₺249', img: '🦮', tag: '%20 İndirim' },
            { name: 'Vitamin Takviyesi', brand: 'NutriVet', price: '₺89', oldPrice: '', img: '💊', tag: '' },
            { name: 'Yatak & Yuva', brand: 'ComfyPet', price: '₺379', oldPrice: '₺450', img: '🛏️', tag: '%15 İndirim' },
          ].map((product, i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer">
              <div className="relative">
                <div className="w-full h-24 bg-[var(--surface-secondary)] rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  {product.img}
                </div>
                {product.tag && (
                  <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--brand-primary)] text-white">{product.tag}</span>
                )}
              </div>
              <div className="text-[10px] text-[var(--foreground-muted)] font-medium">{product.brand}</div>
              <div className="text-sm font-semibold text-[var(--foreground)] leading-tight">{product.name}</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-sm font-bold text-[var(--brand-primary)]">{product.price}</span>
                {product.oldPrice && <span className="text-xs line-through text-[var(--foreground-muted)]">{product.oldPrice}</span>}
              </div>
              <button className="w-full h-8 text-xs font-semibold rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all flex items-center justify-center gap-1">
                <Tag size={11} /> Sepete Ekle
              </button>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--foreground-muted)] text-center mt-4">
          Bu ürünler affiliate ortaklık kapsamında önerilmektedir. sahiplendirme.com, ürün satışı yapmamaktadır.
        </p>
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

      {/* ===== MODAL: Yasal Bilgilendirme ===== */}
      <Modal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} title="⚖️ Yasal Bilgilendirme">
        <div className="p-1 flex flex-col gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-blue-800 mb-1 text-sm">Hayvan Ticareti Yasağı</div>
              <p className="text-xs text-blue-700 leading-relaxed">
                5199 sayılı Hayvanları Koruma Kanunu ve ilgili mevzuat gereğince evcil hayvan alım-satımı kısıtlamalar kapsamındadır.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: '✅', text: 'Bu platform yalnızca ücretsiz sahiplendirme, kayıp hayvan ve çiftleştirme ilanlarına aracılık eder.' },
              { icon: '🚫', text: 'Ticari amaçlı hayvan satışı, platformumuzda kesinlikle yasaktır ve ilanlar moderatörler tarafından kaldırılır.' },
              { icon: '🏛️', text: 'sahiplendirme.com, hayvan alım-satışından hiçbir ticari çıkar sağlamamakta ve bu süreçte taraf tutmamaktadır.' },
              { icon: '⚠️', text: 'Sahiplendirme ilanlarında ücret talep edilmesi yasak olup şikayet edilmesi durumunda ilgili ilan derhal kaldırılır.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-[var(--foreground-muted)]">
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span className="leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-[var(--foreground-muted)] leading-relaxed border-t border-[var(--border)] pt-3">
            Daha fazla bilgi için: <a href="/kvkk" className="text-[var(--brand-primary)] hover:underline">KVKK</a> | <a href="/kullanim-sartlari" className="text-[var(--brand-primary)] hover:underline">Kullanım Şartları</a> | <a href="/gizlilik" className="text-[var(--brand-primary)] hover:underline">Gizlilik Politikası</a>
          </div>

          <Button variant="gradient" fullWidth onClick={() => setIsLegalModalOpen(false)}>Anladım, Devam Et</Button>
        </div>
      </Modal>

      {/* ===== MODAL: Öne Çıkar ===== */}
      <Modal isOpen={isFeaturedModalOpen} onClose={() => setIsFeaturedModalOpen(false)} title="⚡ İlanı Öne Çıkar">
        <div className="p-1 flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            İlanınızı öne çıkararak daha fazla kişiye ulaşın. Öne çıkan ilanlar listenin en üstünde 🌟 rozeti ile görünür.
          </p>

          <div className="flex flex-col gap-3">
            {FEATURED_PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-[var(--brand-primary)] bg-orange-50'
                    : 'border-[var(--border)] hover:border-[var(--brand-primary-light)]'
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--foreground)]">{plan.label}</span>
                    {plan.badge && <span className="text-[10px] font-bold px-2 py-0.5 bg-[var(--brand-primary)] text-white rounded-full">{plan.badge}</span>}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] mt-0.5">{plan.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[var(--brand-primary)]">{plan.price} ₺</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">{Math.round(plan.price / parseInt(plan.id))} ₺/gün</div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-[var(--surface-secondary)] p-3 rounded-xl border border-[var(--border)]">
            {["Arama sonuçlarında en üstte görünüm", "🌟 Öne Çıkan rozeti", "3x daha fazla görüntülenme", "Anlık aktivasyon"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] py-1">
                <Star size={10} className="text-yellow-500 flex-shrink-0" /> {f}
              </div>
            ))}
          </div>

          <Button
            variant="gradient"
            fullWidth
            size="lg"
            onClick={() => { setIsFeaturedModalOpen(false); toast.success('Ödeme sayfasına yönlendiriliyorsunuz...'); }}
            leftIcon={<Zap size={16} />}
          >
            {FEATURED_PLANS.find(p => p.id === selectedPlan)?.price} ₺ ile Öne Çıkar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
