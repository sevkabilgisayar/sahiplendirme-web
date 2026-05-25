'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Upload, X, Check, Save, Loader2, ImagePlus, Trash2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  ANIMAL_TYPES, GENDER_OPTIONS, AGE_OPTIONS,
  DOG_BREEDS, CAT_BREEDS, BIRD_BREEDS, OTHER_BREEDS,
  CITIES, DISTRICTS_BY_CITY, LOSS_TIME_OPTIONS,
  PHOTO_MAX, DESCRIPTION_MIN_CHARS,
} from '@/constants';
import { toast } from 'sonner';

function getBreedsByAnimal(animal: string) {
  if (animal === 'kopek') return DOG_BREEDS;
  if (animal === 'kedi') return CAT_BREEDS;
  if (animal === 'kus') return BIRD_BREEDS;
  if (animal === 'diger') return OTHER_BREEDS;
  return [];
}

function parsePhotos(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
    if (typeof parsed === 'string') {
      const again = JSON.parse(parsed);
      if (Array.isArray(again)) return again.filter(Boolean);
    }
    return [];
  } catch { return []; }
}

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    title: '', name: '', animal: '', breed: '', age: '', gender: '',
    description: '', city: '', district: '',
    lossTime: '', hasReward: false, rewardAmount: '',
    type: '',
  });

  // Mevcut (sunucudan gelen) fotoğraflar — URL string[]
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  // Yeni eklenen fotoğraflar — File[]
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  const [districts, setDistricts] = useState<string[]>([]);

  const update = (key: string, value: any) =>
    setFormData(p => ({ ...p, [key]: value }));

  // Şehir değişince ilçe yükle
  const handleCityChange = async (cityName: string) => {
    setFormData(p => ({ ...p, city: cityName, district: '' }));
    if (!cityName) { setDistricts([]); return; }
    setDistricts(['Yükleniyor...']);
    try {
      const res = await fetch(`https://turkiyeapi.dev/api/v1/provinces?name=${cityName}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const found = data.data?.[0];
      if (found?.districts) {
        setDistricts(found.districts.map((d: any) => d.name));
      } else {
        // @ts-ignore
        setDistricts(DISTRICTS_BY_CITY[cityName] || ['Merkez']);
      }
    } catch {
      // @ts-ignore
      setDistricts(DISTRICTS_BY_CITY[cityName] || ['Merkez']);
    }
  };

  // İlan verilerini yükle
  useEffect(() => {
    if (!listingId) return;
    fetch(`/api/listings/${listingId}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.listing) {
          setNotFound(true);
          return;
        }
        const l = data.listing;
        setFormData({
          title: l.title || '',
          name: l.name || '',
          animal: l.animal || '',
          breed: l.breed || '',
          age: l.age || '',
          gender: l.gender || '',
          description: l.description || '',
          city: l.city || '',
          district: l.district || '',
          lossTime: l.lossTime || '',
          hasReward: l.hasReward || false,
          rewardAmount: l.rewardAmount || '',
          type: l.type || '',
        });
        setExistingPhotos(parsePhotos(l.photos));
        // İlçeleri de yükle
        if (l.city) handleCityChange(l.city);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [listingId]);

  // Yeni fotoğraf ekle
  const handleNewPhotos = useCallback((files: FileList | null) => {
    if (!files) return;
    const totalCurrent = existingPhotos.length + newPhotoFiles.length;
    const remaining = PHOTO_MAX - totalCurrent;
    if (remaining <= 0) {
      toast.error(`Maksimum ${PHOTO_MAX} fotoğraf yükleyebilirsiniz.`);
      return;
    }
    const added = Array.from(files).slice(0, remaining);
    const updatedFiles = [...newPhotoFiles, ...added];
    setNewPhotoFiles(updatedFiles);
    setNewPhotoPreviews(updatedFiles.map(f => URL.createObjectURL(f)));
  }, [existingPhotos, newPhotoFiles]);

  // Mevcut fotoğrafı sil
  const removeExistingPhoto = (idx: number) => {
    setExistingPhotos(p => p.filter((_, i) => i !== idx));
  };

  // Yeni fotoğrafı sil (henüz yüklenmedi)
  const removeNewPhoto = (idx: number) => {
    const updated = newPhotoFiles.filter((_, i) => i !== idx);
    setNewPhotoFiles(updated);
    setNewPhotoPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const totalPhotoCount = existingPhotos.length + newPhotoFiles.length;

  const handleSubmit = async () => {
    if (formData.description.length < DESCRIPTION_MIN_CHARS) {
      toast.error(`Açıklama en az ${DESCRIPTION_MIN_CHARS} karakter olmalıdır.`);
      return;
    }
    if (totalPhotoCount === 0) {
      toast.error('En az 1 fotoğraf eklemelisiniz.');
      return;
    }

    setSaving(true);
    try {
      let uploadedNewUrls: string[] = [];

      // Yeni fotoğrafları yükle
      if (newPhotoFiles.length > 0) {
        const uploadData = new FormData();
        newPhotoFiles.forEach(f => uploadData.append('file', f));
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        if (!uploadRes.ok) throw new Error('Fotoğraflar yüklenemedi');
        const uploadResult = await uploadRes.json();
        uploadedNewUrls = uploadResult.urls || [];
      }

      // Tüm fotoğraflar = mevcut (silinmeyenler) + yeni yüklenenler
      const allPhotos = [...existingPhotos, ...uploadedNewUrls];

      const payload = { ...formData, photos: allPhotos };

      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Güncelleme başarısız');
      }

      toast.success('İlan başarıyla güncellendi!');
      router.push('/profil');
    } catch (error) {
      toast.error('Hata: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const breeds = getBreedsByAnimal(formData.animal);
  const isKayip = formData.type === 'kayip';

  // --- STATES ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[var(--brand-primary)]" size={40} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] gap-4">
        <p className="text-lg font-bold text-[var(--foreground)]">İlan bulunamadı veya düzenleme yetkiniz yok.</p>
        <Link href="/profil"><Button variant="outline" leftIcon={<ArrowLeft size={16} />}>Profil'e Dön</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pt-28 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/profil">
            <button className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-secondary)] transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display">İlanı Düzenle</h1>
            <p className="text-sm text-[var(--foreground-muted)]">Bilgilerinizi güncelleyin ve kaydedin</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Temel Bilgiler */}
          <Card className="p-6 sm:p-8 border-[var(--border)] shadow-sm bg-[var(--surface)]">
            <h2 className="text-lg font-bold font-display mb-5 pb-3 border-b border-[var(--border)]">📋 Temel Bilgiler</h2>

            <div className="space-y-5">
              <Input
                label="İlan Başlığı *"
                value={formData.title}
                onChange={e => update('title', e.target.value)}
                placeholder="örn: Güzel Kızımıza Ücretsiz Yuva"
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Hayvanın Adı"
                  value={formData.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="örn: Pamuk"
                />
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)]">Hayvan Türü</label>
                  <select
                    className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    value={formData.animal}
                    onChange={e => { update('animal', e.target.value); update('breed', ''); }}
                  >
                    <option value="">Seçiniz</option>
                    {ANIMAL_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)]">Irkı</label>
                  <select
                    className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    value={formData.breed}
                    onChange={e => update('breed', e.target.value)}
                  >
                    <option value="">Irk seçin</option>
                    {breeds.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)]">Yaşı</label>
                  <select
                    className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    value={formData.age}
                    onChange={e => update('age', e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    {AGE_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Cinsiyet */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)]">Cinsiyet</label>
                <div className="flex gap-2">
                  {GENDER_OPTIONS.map(g => (
                    <button key={g.value} type="button" onClick={() => update('gender', g.value)}
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

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground)] flex justify-between">
                  Açıklama *
                  <span className={`text-xs font-normal ${formData.description.length >= DESCRIPTION_MIN_CHARS ? 'text-green-500' : 'text-[var(--foreground-muted)]'}`}>
                    {formData.description.length}/{DESCRIPTION_MIN_CHARS} min
                  </span>
                </label>
                <textarea
                  className="w-full rounded-xl border border-[var(--border)] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none h-36 bg-[var(--background)]"
                  placeholder={`Hayvanın özellikleri, sağlık durumu, alışkanlıkları... (min ${DESCRIPTION_MIN_CHARS} karakter)`}
                  value={formData.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>

              {/* Kayıp Bilgileri */}
              {isKayip && (
                <div className="border-t border-[var(--border)] pt-5 space-y-4">
                  <h3 className="font-bold text-sm">🔍 Kayıp Bilgileri</h3>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Kayıp Zamanı</label>
                    <select
                      className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                      value={formData.lossTime}
                      onChange={e => update('lossTime', e.target.value)}
                    >
                      <option value="">Ne zaman kayboldu?</option>
                      {LOSS_TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Fotoğraflar */}
          <Card className="p-6 sm:p-8 border-[var(--border)] shadow-sm bg-[var(--surface)]">
            <h2 className="text-lg font-bold font-display mb-2 pb-3 border-b border-[var(--border)]">📸 Fotoğraflar</h2>
            <p className="text-sm text-[var(--foreground-muted)] mb-5">
              Mevcut fotoğrafları silebilir veya yeni fotoğraf ekleyebilirsiniz. (Max: {PHOTO_MAX})
            </p>

            {/* Mevcut Fotoğraflar */}
            {existingPhotos.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
                  Mevcut Fotoğraflar ({existingPhotos.length})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {existingPhotos.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[var(--border)] group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 text-[9px] bg-[var(--brand-primary)] text-white px-1.5 py-0.5 rounded font-bold">Kapak</span>
                      )}
                      <button
                        onClick={() => removeExistingPhoto(idx)}
                        className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Fotoğrafı Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yeni Fotoğraf Ekle */}
            {totalPhotoCount < PHOTO_MAX && (
              <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--surface-secondary)]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => handleNewPhotos(e.target.files)}
                />
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                  <ImagePlus size={20} className="text-[var(--brand-primary)]" />
                </div>
                <p className="text-sm font-semibold">Yeni Fotoğraf Ekle</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                  PNG, JPG, WEBP — Max 5MB/adet — {totalPhotoCount}/{PHOTO_MAX}
                </p>
              </label>
            )}

            {/* Yeni Fotoğraf Önizlemeleri */}
            {newPhotoPreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
                  Eklenecek Yeni Fotoğraflar ({newPhotoPreviews.length})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {newPhotoPreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[var(--brand-primary)] group">
                      <img src={src} alt="" className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-[var(--brand-primary)]/10" />
                      <span className="absolute bottom-1 left-1 text-[9px] bg-[var(--brand-primary)] text-white px-1.5 py-0.5 rounded font-bold">Yeni</span>
                      <button
                        onClick={() => removeNewPhoto(idx)}
                        className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </Card>

          {/* Konum */}
          <Card className="p-6 sm:p-8 border-[var(--border)] shadow-sm bg-[var(--surface)]">
            <h2 className="text-lg font-bold font-display mb-5 pb-3 border-b border-[var(--border)]">📍 Konum</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5">İl *</label>
                <select
                  className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  value={formData.city}
                  onChange={e => handleCityChange(e.target.value)}
                >
                  <option value="">İl Seçin</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">İlçe</label>
                <select
                  className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  value={formData.district}
                  onChange={e => update('district', e.target.value)}
                  disabled={districts.length === 0}
                >
                  <option value="">İlçe Seçin</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </Card>

          {/* Kaydet Butonu */}
          <div className="flex items-center justify-between pt-2">
            <Link href="/profil">
              <Button variant="ghost" leftIcon={<ArrowLeft size={16} />}>İptal</Button>
            </Link>
            <Button
              variant="gradient"
              onClick={handleSubmit}
              isLoading={saving}
              leftIcon={!saving ? <Save size={16} /> : undefined}
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
