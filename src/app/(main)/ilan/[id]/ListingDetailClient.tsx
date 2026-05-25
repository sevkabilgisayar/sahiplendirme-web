'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ChevronRight, ChevronLeft, Heart, Share2, AlertTriangle, Phone, Mail, MapPin,
  CheckCircle, ShieldCheck, Eye, Flag, Clock, Award, Camera, Send,
  Sparkles, Bot, User, X, ChevronDown, ChevronUp, Zap, Star, Tag, Package2, ShoppingBag, Info, Building2
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

type AiMessage = { role: 'user' | 'ai'; text: string };
type Sighting = { id: string; note: string; location: string; seenAt: string; contactInfo?: string; reporter?: { firstName: string; lastName: string }; createdAt: string };

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

function formatDate(dateStr: string) {
  if (!dateStr) return 'Bilinmiyor';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// UUID'den kısa ilan no: ilk 8 karakter büyük harf
function shortId(id: string) {
  return String(id).replace(/-/g, '').toUpperCase().slice(0, 8);
}

export default function ListingDetailClient({ listing }: { listing: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isSightingModalOpen, setIsSightingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Sayfa açılınca favoride mi kontrol et
  useEffect(() => {
    fetch('/api/favorites')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const ids = (d.listings || []).map((l: any) => l.id);
          setIsFav(ids.includes(listing.id));
        }
      })
      .catch(() => {});
  }, [listing.id]);

  const handleFav = async () => {
    setFavLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFav(data.action === 'added');
        toast.success(data.action === 'added' ? 'Favorilere eklendi!' : 'Favorilerden çıkarıldı.');
      } else if (res.status === 401) {
        toast.error('Favorilere eklemek için giriş yapmalısınız.');
      }
    } catch {
      toast.error('Bir hata oluştu.');
    } finally {
      setFavLoading(false);
    }
  };

  // Dinamik Harita Konumu (Eğer koordinat girilmediyse Ankara yerine İl/İlçe bazlı geocoding)
  const [mapCenter, setMapCenter] = useState<[number, number]>([listing.location.lat, listing.location.lng]);

  useEffect(() => {
    // 39.9334 ve 32.8597 bizim default Ankara koordinatımız
    if (listing.location.lat === 39.9334 && listing.location.lng === 32.8597 && listing.city) {
      const query = `${listing.neighborhood ? listing.neighborhood + ', ' : ''}${listing.district ? listing.district + ', ' : ''}${listing.city}, Turkey`;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.length > 0) {
            setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        })
        .catch(() => {});
    }
  }, [listing.location.lat, listing.location.lng, listing.city, listing.district, listing.neighborhood]);

  // AI Danışman state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
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
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [dontShowLegalAgain, setDontShowLegalAgain] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hidden = localStorage.getItem('hideLegalWarning');
      if (!hidden) setIsLegalModalOpen(true);
    }
  }, []);

  const handleLegalClose = () => {
    if (dontShowLegalAgain) {
      localStorage.setItem('hideLegalWarning', 'true');
    }
    setIsLegalModalOpen(false);
  };

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
  const [sightContact, setSightContact] = useState('');
  const [sightLoading, setSightLoading] = useState(false);

  // Gerçek ihbar verileri
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [sightingsLoading, setSightingsLoading] = useState(false);

  // Şikayet state
  const [reportReason, setReportReason] = useState('Uygunsuz içerik');
  const [reportLoading, setReportLoading] = useState(false);

  // Kayıp ilanı ise ihbarları çek
  useEffect(() => {
    if (listing.type !== 'kayip') return;
    setSightingsLoading(true);
    fetch(`/api/sightings?listingId=${listing.id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSightings(d.sightings); })
      .catch(console.error)
      .finally(() => setSightingsLoading(false));
  }, [listing.id, listing.type]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Bağlantı kopyalandı!');
  };

  const handleAdopt = async () => {
    if (!appMessage || !appCity || !appHousing || !appConsent) {
      toast.error('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          message: `Şehir: ${appCity}\nYaşam Koşulu: ${appHousing}\n\nAçıklama:\n${appMessage}`
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Başvuru yapılamadı');
      }

      setIsAdoptModalOpen(false);
      toast.success('Sahiplenme talebiniz iletildi. İlan sahibi sizinle iletişime geçecektir.', { duration: 5000 });
      setAppMessage(''); setAppCity(''); setAppHousing(''); setAppConsent(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSighting = async () => {
    if (!sightTime || !sightLocation) {
      toast.error('Zaman ve konum alanları zorunludur.');
      return;
    }
    setSightLoading(true);
    try {
      const res = await fetch('/api/sightings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          note: sightNote || 'Not belirtilmedi.',
          location: sightLocation,
          seenAt: sightTime,
          contactInfo: sightContact || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İhbar gönderilemedi');

      // Listeye ekle (sayfa yenilemeden)
      setSightings(prev => [data.sighting, ...prev]);
      setIsSightingModalOpen(false);
      toast.success('İhbarınız kaydedildi! İlan sahibi bilgilendirildi.', { duration: 5000 });
      setSightTime(''); setSightLocation(''); setSightNote(''); setSightContact('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSightLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Lütfen bir şikayet sebebi seçin.');
      return;
    }
    setReportLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, reason: reportReason, detail: '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Şikayet gönderilemedi');
      
      setIsReportModalOpen(false);
      toast.success('Şikayetiniz alındı. Ekibimiz en kısa sürede inceleyecektir.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setReportLoading(false);
    }
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
    <div className="bg-[var(--background)] min-h-screen pt-4 sm:pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-3">
          <Link href="/" className="hover:text-[var(--brand-primary)]">Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href={`/ilanlar?kategori=${listing.type}`} className="hover:text-[var(--brand-primary)] capitalize">
            {listing.type === 'kayip' ? 'Kayıp' : listing.type === 'ciftlestirme' ? 'Çiftleştirme' : 'Sahiplendirme'} İlanları
          </Link>
          <ChevronRight size={14} />
          <span className="text-[var(--foreground)] truncate font-medium">{listing.name || 'İlan'} - {listing.breed || 'Bilinmiyor'}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <div className="mb-8 flex flex-col-reverse sm:flex-row gap-4">
              
              {/* Thumbnail'lar (Mobil'de altta yatay, Masaüstünde solda dikey) */}
              {(listing.photos && listing.photos.length > 0) && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto pb-2 sm:pb-0 sm:w-20 lg:w-24 flex-shrink-0" style={{ maxHeight: '600px' }}>
                  {listing.photos.map((photo: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all w-20 h-20 sm:w-full sm:h-20 lg:h-24 ${
                        activeImage === idx
                          ? 'border-[var(--brand-primary)] ring-2 ring-orange-200'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Fotoğraf ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Ana fotoğraf */}
              <div className="relative flex-1 min-w-0">
                <div 
                  className="w-full rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--surface-secondary)] cursor-zoom-in relative" 
                  style={{ aspectRatio: '4/3' }}
                  onClick={() => setIsGalleryOpen(true)}
                >
                  {listing.photos?.[activeImage] ? (
                    <img
                      src={listing.photos[activeImage]}
                      alt={`${listing.name} - fotoğraf ${activeImage + 1}`}
                      className="w-full h-full object-cover object-center transition-all duration-500"
                      onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/800x600/f3f4f6/9ca3af?text=${encodeURIComponent(listing.name)}`; }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${listing.imageColor || 'from-orange-100 to-amber-200'} flex items-center justify-center`}>
                      <span className="text-9xl">{listing.emoji}</span>
                    </div>
                  )}
                </div>

                {/* Ok İşaretleri */}
                {listing.photos && listing.photos.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev > 0 ? prev - 1 : listing.photos.length - 1); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev < listing.photos.length - 1 ? prev + 1 : 0); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
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
                  <button onClick={handleFav} disabled={favLoading}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors bg-[var(--surface)] ${isFav ? 'border-red-300 text-red-500 bg-red-50' : 'border-[var(--border)] text-[var(--foreground-muted)] hover:text-red-500 hover:border-red-200'} disabled:opacity-50`}>
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[var(--foreground-muted)] font-medium flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={16} className="text-[var(--brand-primary)]" />
                  {listing.neighborhood && `${listing.neighborhood}, `}{listing.location.address}
                </span>
                <span className="flex items-center gap-1"><Eye size={14} /> {listing.viewCount || 124} görüntülenme</span>
                    <span className="ml-auto text-[10px] font-mono bg-[var(--surface-secondary)] border border-[var(--border)] px-2 py-0.5 rounded-md text-[var(--foreground-muted)] select-all cursor-pointer" title="İlan numarası">
                  #İlan {shortId(listing.id)}
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

            {/* Kayıp: Gördüm İhbarları — Gerçek Veritabanı */}
            {isKayip && (
              <div className="mb-10">
                <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                  📍 Gördüm İhbarları <span className="text-sm font-normal text-[var(--foreground-muted)]">
                    ({sightingsLoading ? '...' : sightings.length})
                  </span>
                </h2>
                {sightingsLoading ? (
                  <div className="space-y-3">
                    {[1,2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
                  </div>
                ) : sightings.length === 0 ? (
                  <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] text-center text-[var(--foreground-muted)] text-sm">
                    Henüz bu ilan için ihbar bulunmuyor. Gördüysanız lütfen bildirin!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sightings.map((s) => (
                      <div key={s.id} className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {s.reporter ? s.reporter.firstName.charAt(0) : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {s.reporter ? `${s.reporter.firstName} ${s.reporter.lastName.charAt(0)}.` : 'Anonim'}
                            </span>
                            <span className="text-xs text-[var(--foreground-muted)]">
                              {new Date(s.createdAt).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <div className="text-xs text-[var(--foreground-muted)] mb-1">
                            📍 {s.location} · ⏰ {s.seenAt}
                          </div>
                          <p className="text-sm">{s.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

            {/* Map */}
            <div className="mb-10">
              <h2 className="text-xl font-bold font-display mb-4">
                Konum
              </h2>
              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-sm border border-[var(--border)]">
                <Map center={mapCenter} popupText={listing.neighborhood ? `${listing.neighborhood}, ${listing.district}, ${listing.city}` : (listing.district ? `${listing.district}, ${listing.city}` : listing.city)} zoom={13} />
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mt-2 flex items-center gap-1">
                <MapPin size={12} /> 
                Haritada belirtilen bölge gösterilmektedir. Kesin adres için ilan sahibiyle iletişime geçin.
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
            <div className="flex flex-col gap-6">

              {/* Action Card */}
              <Card className="p-6 border-[var(--border)] shadow-md">
                
                {/* 1. İlan Tipi Rozeti (En üstte) */}
                <div className="mb-5">
                  {listing.hasReward && listing.rewardAmount ? (
                    <div className="flex flex-col gap-3">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-2 ${listingTypeBadge.color} w-fit`}>
                        <span className="text-lg font-bold">{listingTypeBadge.label}</span>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 inline-block w-fit">
                        <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">KAYIP ÖDÜLÜ</div>
                        <div className="text-3xl font-bold font-display text-yellow-700">₺{listing.rewardAmount}</div>
                      </div>
                    </div>
                  ) : isCiftlestirme ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-2 bg-purple-100 text-purple-700 border-purple-200">
                      <span className="text-lg font-bold">💕 Eşleştirme İlanı</span>
                    </div>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-2 ${listingTypeBadge.color}`}>
                      <span className="text-lg font-bold">{listingTypeBadge.label}</span>
                    </div>
                  )}
                </div>

                {/* İlan Tarihi */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border-subtle)] text-sm">
                  <span className="text-[var(--foreground-muted)] font-semibold flex items-center gap-1.5"><Clock size={14} /> İlan Tarihi</span>
                  <span className="font-bold text-[var(--foreground)]">{formatDate(listing.createdAt || '2 gün önce')}</span>
                </div>
                {/* İlan No */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border-subtle)]">
                  <span className="text-sm text-[var(--foreground-muted)] font-semibold">İlan No</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(shortId(listing.id));
                      toast.success('İlan no kopyalandı!');
                    }}
                    className="font-mono text-xl font-black text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 px-4 py-1.5 rounded-xl hover:bg-[var(--brand-primary)]/20 transition-all shadow-sm"
                    title="Kopyalamak için tıkla"
                  >
                    #{shortId(listing.id)}
                  </button>
                </div>
                {/* Hayvan Adı */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border-subtle)]">
                  <span className="text-sm text-[var(--foreground-muted)] font-semibold">Adı</span>
                  <span className="font-bold text-[var(--foreground)]">{listing.animalName || '-'}</span>
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
                  {/* Owner Info (Moved inside action card) */}
                  <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] my-2">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {listing.owner.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--foreground)] flex items-center gap-1 text-sm">
                          {listing.owner.name} <CheckCircle size={14} className="text-blue-500" />
                        </div>
                        <div className="text-[11px] text-[var(--foreground-muted)]">{listing.owner.isGhost ? 'Dış Kaynak' : (listing.ownerType === 'sahibinde' ? 'Bireysel Üye' : 'Kurumsal / Barınak')}</div>
                        <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Üyelik: {listing.owner.memberSince}</div>
                      </div>
                    </div>
                    {!listing.owner.isGhost && (
                      <Link href={`/profil/${listing.owner.id}`} className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline block text-center mb-4">
                        Kullanıcının diğer ilanları →
                      </Link>
                    )}
                    
                    {/* ARA VE MESAJ BUTONLARI */}
                    <div className="grid grid-cols-2 gap-2">
                      <a href={`tel:${listing.owner.phone}`} className="w-full block" onClick={() => setShowPhone(true)}>
                        <Button variant="outline" className="h-11 text-xs w-full rounded-xl transition-all" leftIcon={<Phone size={14} />}>
                          {showPhone ? (listing.owner.phone || 'Gizli') : 'Ara'}
                        </Button>
                      </a>
                      
                      <Link href={`/profil/mesajlar?to=${listing.owner.id}&listingId=${listing.id}`} className="w-full block">
                        <Button variant="outline" className="w-full h-11 text-xs rounded-xl" leftIcon={<Mail size={14} />}>
                          Mesaj
                        </Button>
                      </Link>
                    </div>
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

              {/* Owner Info removed from here */}

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

          {/* İletişim (opsiyonel) */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">İletişim (opsiyonel)</label>
            <input type="text" value={sightContact} onChange={(e) => setSightContact(e.target.value)}
              placeholder="Telefon veya e-posta — anonim ihbar için boş bırakabilirsiniz"
              className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
          </div>

          <Button variant="gradient" fullWidth size="lg" onClick={handleSighting} isLoading={sightLoading} leftIcon={<Send size={16} />}>
            İhbarı Kaydet
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
                <input type="radio" name="report" value={r} checked={reportReason === r} onChange={(e) => setReportReason(e.target.value)} className="accent-[var(--brand-primary)]" />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
          <Button variant="danger" fullWidth onClick={handleReport} isLoading={reportLoading}>Şikayeti Gönder</Button>
        </div>
      </Modal>

      {/* ===== MODAL: Yasal Bilgilendirme ===== */}
      <Modal isOpen={isLegalModalOpen} onClose={handleLegalClose} title="⚖️ Yasal Bilgilendirme">
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

          <div className="flex items-center gap-2 mt-1 px-1">
            <input 
              type="checkbox" 
              id="dontShowLegalAgain"
              checked={dontShowLegalAgain}
              onChange={(e) => setDontShowLegalAgain(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
            />
            <label htmlFor="dontShowLegalAgain" className="text-sm text-[var(--foreground-muted)] cursor-pointer select-none">Bir daha gösterme</label>
          </div>

          <Button variant="gradient" fullWidth onClick={handleLegalClose}>Anladım, Devam Et</Button>
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

      {/* ===== FULLSCREEN GALLERY MODAL ===== */}
      {isGalleryOpen && listing.photos && listing.photos.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={() => setIsGalleryOpen(false)}>
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          {listing.photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev === 0 ? listing.photos.length - 1 : prev - 1); }}
                className="absolute left-4 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev === listing.photos.length - 1 ? 0 : prev + 1); }}
                className="absolute right-4 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={listing.photos[activeImage]}
              alt={`${listing.name} - büyük fotoğraf`}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            {listing.photos.length > 1 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                {activeImage + 1} / {listing.photos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
