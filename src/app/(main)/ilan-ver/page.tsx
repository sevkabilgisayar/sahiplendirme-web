'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, ArrowLeft, Upload, MapPin, Sparkles, X, Clock, Award, Eye, Lock } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  ANIMAL_TYPES, GENDER_OPTIONS, LISTING_TYPES, AGE_OPTIONS,
  DOG_BREEDS, CAT_BREEDS, BIRD_BREEDS, OTHER_BREEDS, CITIES, DISTRICTS_BY_CITY, LOSS_TIME_OPTIONS,
  PHOTO_MAX, PHOTO_MIN, DESCRIPTION_MIN_CHARS,
} from '@/constants';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/Map'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-400 animate-pulse">Harita Yükleniyor...</div>
});

const STEPS = [
  { id: 1, title: 'Kategori' },
  { id: 2, title: 'Temel Bilgiler' },
  { id: 3, title: 'Medya' },
  { id: 4, title: 'Konum' },
  { id: 5, title: 'Önizleme' },
];

function getBreedsByAnimal(animal: string) {
  if (animal === 'kopek') return DOG_BREEDS;
  if (animal === 'kedi') return CAT_BREEDS;
  if (animal === 'kus') return BIRD_BREEDS;
  if (animal === 'diger') return OTHER_BREEDS;
  return [];
}

export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '', animal: '', name: '', breed: '', age: '', gender: '',
    description: '',
    // Kayıp ek alanları (Madde 6.1)
    lossTime: '', hasReward: false, rewardAmount: '', lastSeenNote: '',
    // Medya
    photos: [] as File[], videoLink: '',
    // Konum
    city: '', district: '', neighborhood: '', locationPrivacy: 'yaklasik' as 'yaklasik' | 'tam',
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.0082, 28.9784]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userAccountType, setUserAccountType] = useState('bireysel');

  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setUserAccountType(data.profile.accountType);
        }
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  const geocodeLocation = async (city: string, district: string, neighborhood: string = '') => {
    if (!city) return;
    const query = `${neighborhood ? neighborhood + ' Mahallesi, ' : ''}${district ? district + ', ' : ''}${city}, Turkey`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleCityChange = async (cityName: string) => {
    setFormData(p => ({ ...p, city: cityName, district: '', neighborhood: '' }));
    setDistricts(['Yükleniyor...']);
    geocodeLocation(cityName, '');
    
    if (!cityName) {
      setDistricts([]);
      return;
    }

    try {
      const res = await fetch(`https://turkiyeapi.dev/api/v1/provinces?name=${cityName}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      const found = data.data?.[0];
      if (found && found.districts) {
        setDistricts(found.districts.map((d: any) => d.name));
      } else {
        // @ts-ignore
        setDistricts(DISTRICTS_BY_CITY[cityName] || ['Merkez']);
      }
    } catch (error) {
      // @ts-ignore
      setDistricts(DISTRICTS_BY_CITY[cityName] || ['Merkez']);
    }
  };

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, 6));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));
  const update = (key: string, value: any) => setFormData(p => ({ ...p, [key]: value }));

  const handlePhotos = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, PHOTO_MAX - formData.photos.length);
    const updatedPhotos = [...formData.photos, ...newFiles].slice(0, PHOTO_MAX);
    setFormData(p => ({ ...p, photos: updatedPhotos }));
    const previews = updatedPhotos.map(f => URL.createObjectURL(f));
    setPhotoPreviews(previews);
  }, [formData.photos]);

  const removePhoto = (idx: number) => {
    const updated = formData.photos.filter((_, i) => i !== idx);
    setFormData(p => ({ ...p, photos: updated }));
    setPhotoPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let uploadedPhotos: string[] = [];
      
      // Fotoğraf yükleme
      if (formData.photos && formData.photos.length > 0) {
        const uploadData = new FormData();
        formData.photos.forEach((file: File) => uploadData.append('file', file));
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedPhotos = uploadResult.urls;
        } else {
          throw new Error('Fotoğraflar yüklenemedi');
        }
      }

      // İlanı kaydet
      const generatedTitle = formData.title || `${displayName} - ${formData.breed} (${animalTypeLabel} ${typeLabel})`;

      const payload = { ...formData, photos: uploadedPhotos, title: generatedTitle };
      
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'İlan oluşturulamadı');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Hata oluştu: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breeds = getBreedsByAnimal(formData.animal);
  const isKayip = formData.type === 'kayip';

  // Step validations
  const animalTypeLabel = ANIMAL_TYPES.find(a => a.value === formData.animal)?.label || formData.animal;
  const typeLabel = LISTING_TYPES.find(t => t.value === formData.type)?.label || formData.type;
  
  // Sahiplendirme için isim opsiyonel
  const isNameRequired = formData.type !== 'sahiplendirme';
  const displayName = formData.name || 'İsimsiz';

  const step1Valid = formData.type && formData.animal;
  const step2Valid = formData.title && (!isNameRequired || formData.name) && formData.gender && formData.breed && formData.age
    && formData.description.length >= DESCRIPTION_MIN_CHARS
    && (!isKayip || formData.lossTime);
  const step3Valid = formData.photos.length >= PHOTO_MIN;
  const step4Valid = !!formData.city;

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[var(--background)] py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Check size={48} />
          </div>
          <h2 className="text-3xl font-bold font-display text-[var(--foreground)] mb-3">İlanınız Alındı!</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            İlanınız başarıyla oluşturuldu. Editör onayından geçtikten sonra yayına alınacaktır.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/ilanlar"><Button variant="gradient" fullWidth size="lg">İlanlara Dön</Button></Link>
            <Link href="/profil"><Button variant="outline" fullWidth size="lg">Profilime Git</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pt-28 pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Stepper */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-display mb-8">Yeni İlan Oluştur</h1>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--border)] rounded-full z-0" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--brand-primary)] rounded-full z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
            <div className="flex justify-between relative z-10">
              {STEPS.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2 ${
                    currentStep > step.id ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                    : currentStep === step.id ? 'bg-[var(--surface)] border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-muted)]'
                  }`}>
                    {currentStep > step.id ? <Check size={18} /> : step.id}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${currentStep >= step.id ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="p-6 sm:p-8 border-[var(--border)] shadow-sm bg-[var(--surface)]">

          {/* STEP 1: Kategori + Hayvan Türü */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold font-display mb-6 text-center">Ne tür bir ilan vermek istiyorsunuz?</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {LISTING_TYPES.map((t) => (
                  <button key={t.value} onClick={() => update('type', t.value)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:border-[var(--brand-primary-light)] ${
                      formData.type === t.value ? 'border-[var(--brand-primary)] bg-[var(--surface-secondary)]' : 'border-[var(--border)]'
                    }`}>
                    <span className="text-3xl">{t.value === 'sahiplendirme' ? '🏠' : t.value === 'kayip' ? '🔍' : t.value === 'ciftlestirme' ? '💕' : '🐾'}</span>
                    <span className="font-semibold text-sm">{t.label}</span>
                  </button>
                ))}
                
                {/* PRO HİZMET İLANI (Locked Suggestion) */}
                <button 
                  onClick={() => {
                    if (userAccountType !== 'profesyonel') {
                      toast.error('Bu özellik Profesyonel üyeliklere özeldir.', {
                        description: 'Eğitmen, Kuaför, Veteriner gibi hizmetler verebilmek için profilinizden üyeliğinizi yükseltebilirsiniz.',
                      });
                    } else {
                      window.location.href = '/hizmet-ilani-ver';
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 border-[var(--border)] flex flex-col items-center justify-center gap-2 transition-all hover:border-purple-300 relative overflow-hidden bg-gray-50/50`}>
                  {userAccountType !== 'profesyonel' && (
                    <div className="absolute top-3 right-3 text-gray-400"><Lock size={16} /></div>
                  )}
                  <span className="text-3xl grayscale opacity-80">🏢</span>
                  <span className="font-semibold text-sm text-gray-600">Hizmet İlanı</span>
                  {userAccountType !== 'profesyonel' && (
                    <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full font-bold">PRO Özellik</span>
                  )}
                </button>
              </div>
              {formData.type && (
                <div className="animate-slide-up">
                  <h3 className="text-base font-bold font-display mb-4">Hangi hayvan için?</h3>
                  <div className="grid sm:grid-cols-4 gap-4">
                    {ANIMAL_TYPES.map((a) => (
                      <button key={a.value} onClick={() => { update('animal', a.value); update('breed', ''); }}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:border-[var(--brand-primary-light)] ${
                          formData.animal === a.value ? 'border-[var(--brand-primary)] bg-[var(--surface-secondary)]' : 'border-[var(--border)]'
                        }`}>
                        <span className="text-3xl">{a.emoji}</span>
                        <span className="font-semibold text-sm">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Temel Bilgiler */}
          {currentStep === 2 && (
            <div className="animate-fade-in flex flex-col gap-5">
              <h2 className="text-xl font-bold font-display mb-2">Temel Bilgiler</h2>

              <div className="mb-5">
                <Input label="İlan Başlığı *" placeholder="örn: Güzel Kızımıza Ücretsiz Yuva - Melez" value={formData.title || ''} onChange={(e) => update('title', e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Input label={isNameRequired ? "Adı *" : "Adı (Opsiyonel)"} placeholder="örn: Pamuk" value={formData.name} onChange={(e) => update('name', e.target.value)} />
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)]">Irkı *</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    value={formData.breed} onChange={(e) => update('breed', e.target.value)}>
                    <option value="">Irk seçin</option>
                    {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)]">Yaşı *</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    value={formData.age} onChange={(e) => update('age', e.target.value)}>
                    <option value="">Seçiniz</option>
                    {AGE_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)]">Cinsiyet *</label>
                  <div className="flex gap-2">
                    {GENDER_OPTIONS.map((g) => (
                      <button key={g.value} onClick={() => update('gender', g.value)}
                        className={`flex-1 h-12 rounded-xl border-2 font-medium text-sm flex items-center justify-center transition-colors ${
                          formData.gender === g.value
                            ? g.value === 'erkek' ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : g.value === 'disi' ? 'border-pink-500 bg-pink-50 text-pink-700'
                              : 'border-gray-500 bg-gray-50 text-gray-700'
                            : 'border-[var(--border)] text-[var(--foreground-muted)]'
                        }`}>
                        {g.value === 'erkek' ? '♂' : g.value === 'disi' ? '♀' : '?'} {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)] flex justify-between">
                  Açıklama * <span className={`text-xs font-normal ${formData.description.length >= DESCRIPTION_MIN_CHARS ? 'text-green-500' : 'text-[var(--foreground-muted)]'}`}>
                    {formData.description.length}/{DESCRIPTION_MIN_CHARS} min
                  </span>
                </label>
                <textarea className="w-full rounded-xl border border-[var(--border)] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none h-32 bg-[var(--background)]"
                  placeholder={`Hayvanın özellikleri, sağlık durumu, alışkanlıkları hakkında detaylı bilgi verin... (min ${DESCRIPTION_MIN_CHARS} karakter)`}
                  value={formData.description} onChange={(e) => update('description', e.target.value)} />
              </div>

              {/* Kayıp İlanı Ek Alanları (Madde 6.1) */}
              {isKayip && (
                <div className="animate-slide-up border-t border-[var(--border)] pt-5 mt-2 space-y-5">
                  <h3 className="text-base font-bold font-display flex items-center gap-2">
                    <Clock size={18} className="text-red-500" /> Kayıp Bilgileri
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Kayıp Zamanı *</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                      value={formData.lossTime} onChange={(e) => update('lossTime', e.target.value)}>
                      <option value="">Ne zaman kayboldu?</option>
                      {LOSS_TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.hasReward ? 'bg-[var(--brand-primary)]' : 'bg-gray-300'}`}
                        onClick={() => update('hasReward', !formData.hasReward)}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${formData.hasReward ? 'left-[26px]' : 'left-0.5'}`} />
                      </div>
                      <span className="text-sm font-semibold flex items-center gap-1.5">
                        <Award size={16} className="text-yellow-500" /> Ödül var
                      </span>
                    </label>
                    {formData.hasReward && (
                      <div className="mt-3 animate-fade-in">
                        <Input label="Ödül Tutarı (₺)" type="number" placeholder="örn: 1000"
                          value={formData.rewardAmount} onChange={(e) => update('rewardAmount', e.target.value)} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Medya */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold font-display mb-2">Fotoğraf ve Video</h2>
              <p className="text-sm text-[var(--foreground-muted)] mb-6">
                En az {PHOTO_MIN}, en fazla {PHOTO_MAX} fotoğraf yükleyin. Video linki opsiyoneldir.
              </p>

              {/* Photo Upload */}
              <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--surface-secondary)]">
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => handlePhotos(e.target.files)} />
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                  <Upload size={22} className="text-[var(--brand-primary)]" />
                </div>
                <h3 className="font-bold mb-1 text-sm">Fotoğrafları sürükleyin veya seçin</h3>
                <p className="text-xs text-[var(--foreground-muted)]">PNG, JPG veya WEBP — Max 5MB/adet — {formData.photos.length}/{PHOTO_MAX}</p>
              </label>

              {/* Previews */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                  {photoPreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                      {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-[var(--brand-primary)] text-white px-1.5 py-0.5 rounded font-bold">Kapak</span>}
                    </div>
                  ))}
                </div>
              )}


            </div>
          )}

          {/* STEP 4: Konum */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold font-display mb-2">Konum Belirle</h2>
              <p className="text-sm text-[var(--foreground-muted)] mb-6">Hayvanın bulunduğu konumu seçin.</p>

              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">İl *</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    value={formData.city} onChange={(e) => handleCityChange(e.target.value)}>
                    <option value="">İl Seçin</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">İlçe</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    value={formData.district} 
                    onChange={(e) => {
                      update('district', e.target.value);
                      update('neighborhood', '');
                      geocodeLocation(formData.city, e.target.value);
                    }} 
                    disabled={districts.length === 0}>
                    <option value="">İlçe Seçin</option>
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">Mahalle (İsteğe Bağlı)</label>
                  <Input 
                    placeholder="Mahalle adı girin (örn: Caferağa)" 
                    value={formData.neighborhood || ''} 
                    onChange={(e) => update('neighborhood', e.target.value)}
                    onBlur={(e) => geocodeLocation(formData.city, formData.district, e.target.value)}
                  />
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">Girdiğiniz mahalle haritada otomatik işaretlenir.</p>
                </div>
              </div>



              {/* Harita Entegrasyonu */}
              <div className="h-64 rounded-2xl border border-[var(--border)] relative overflow-hidden z-0">
                <Map center={mapCenter} zoom={13} popupText="Seçilen Konum" />
              </div>
            </div>
          )}

          {/* STEP 5: Önizleme */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                <Eye size={20} /> İlan Önizlemesi
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'İlan Türü', value: LISTING_TYPES.find(t => t.value === formData.type)?.label },
                  { label: 'Hayvan Türü', value: ANIMAL_TYPES.find(a => a.value === formData.animal)?.label },
                  { label: 'Adı', value: formData.name },
                  { label: 'Irkı', value: formData.breed },
                  { label: 'Yaşı', value: AGE_OPTIONS.find(a => a.value === formData.age)?.label },
                  { label: 'Cinsiyet', value: GENDER_OPTIONS.find(g => g.value === formData.gender)?.label },
                  { label: 'Konum', value: `${formData.city}${formData.district ? `, ${formData.district}` : ''}${formData.neighborhood ? `, ${formData.neighborhood} Mah.` : ''}` },
                  { label: 'Fotoğraf', value: `${formData.photos.length} adet` },
                  ...(isKayip ? [
                    { label: 'Kayıp Zamanı', value: LOSS_TIME_OPTIONS.find(o => o.value === formData.lossTime)?.label },
                    { label: 'Ödül', value: formData.hasReward ? `₺${formData.rewardAmount}` : 'Yok' },
                  ] : []),
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                    <span className="text-sm text-[var(--foreground-muted)]">{item.label}</span>
                    <span className="text-sm font-semibold">{item.value || '—'}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <span className="text-sm text-[var(--foreground-muted)]">Açıklama</span>
                  <p className="text-sm mt-1 bg-[var(--surface-secondary)] p-3 rounded-xl">{formData.description || '—'}</p>
                </div>
                {photoPreviews.length > 0 && (
                  <div className="pt-2">
                    <span className="text-sm text-[var(--foreground-muted)] mb-2 block">Fotoğraflar</span>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {photoPreviews.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-[var(--border)]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1 || isSubmitting} leftIcon={<ArrowLeft size={16} />}>
            Geri
          </Button>
          {currentStep < 5 ? (
            <Button variant="gradient" onClick={nextStep}
              disabled={
                (currentStep === 1 && !step1Valid) ||
                (currentStep === 2 && !step2Valid) ||
                (currentStep === 3 && !step3Valid) ||
                (currentStep === 4 && !step4Valid)
              }
              rightIcon={<ChevronRight size={16} />}>
              Devam Et
            </Button>
          ) : (
            <Button variant="gradient" onClick={handleSubmit} isLoading={isSubmitting}
              leftIcon={!isSubmitting ? <Check size={16} /> : undefined}>
              İlanı Yayınla
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
