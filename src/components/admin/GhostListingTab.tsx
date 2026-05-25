'use client';

import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';

import { CITIES, DISTRICTS_BY_CITY, DOG_BREEDS, CAT_BREEDS, BIRD_BREEDS, OTHER_BREEDS, AGE_OPTIONS } from '@/constants';

export default function GhostListingTab() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('kopek');
  const [districts, setDistricts] = useState<string[]>([]);
  const [ghostPhotos, setGhostPhotos] = useState<File[]>([]);
  const [ghostPreviews, setGhostPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const breeds = 
    selectedAnimal === 'kopek' ? DOG_BREEDS :
    selectedAnimal === 'kedi' ? CAT_BREEDS :
    selectedAnimal === 'kus' ? BIRD_BREEDS : OTHER_BREEDS;

  const handleCityChange = async (cityName: string) => {
    setSelectedCity(cityName);
    setDistricts(['Yükleniyor...']);
    
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
      // API fail fallback
      // @ts-ignore
      setDistricts(DISTRICTS_BY_CITY[cityName] || ['Merkez']);
    }
  };

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10 - ghostPhotos.length);
    const updated = [...ghostPhotos, ...newFiles].slice(0, 10);
    setGhostPhotos(updated);
    setGhostPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const removePhoto = (idx: number) => {
    const updated = ghostPhotos.filter((_, i) => i !== idx);
    setGhostPhotos(updated);
    setGhostPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());

    try {
      let uploadedPhotos: string[] = [];
      if (ghostPhotos.length > 0) {
        const uploadData = new FormData();
        ghostPhotos.forEach(f => uploadData.append('file', f));
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedPhotos = uploadResult.urls;
        } else {
          alert('Fotoğraflar yüklenirken hata oluştu (R2/S3)');
          setSubmitting(false);
          return;
        }
      }

      const res = await fetch('/api/admin/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          photos: uploadedPhotos.length > 0
            ? uploadedPhotos
            : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop']
        })
      });

      if (res.ok) {
        alert('İlan başarıyla oluşturuldu ve yayına alındı!');
        formElement.reset();
        setSelectedCity('');
        setDistricts([]);
        setGhostPhotos([]);
        setGhostPreviews([]);
      } else {
        const err = await res.json();
        alert('Hata: ' + err.error);
      }
    } catch {
      alert('Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-bold mb-4">Hızlı İlan Ekle (Sisteme Kayıtsız Kullanıcı İçin)</h3>
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* İlan Tipi + Hayvan Türü */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">İlan Tipi *</label>
              <select name="type" required className="w-full border rounded-lg p-2 bg-gray-50">
                <option value="sahiplendirme">Sahiplendirme</option>
                <option value="kayip">Kayıp</option>
                <option value="ciftlestirme">Çiftleştirme</option>
                <option value="diger">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Hayvan Türü *</label>
              <select name="animal" required value={selectedAnimal} onChange={e => setSelectedAnimal(e.target.value)} className="w-full border rounded-lg p-2 bg-gray-50">
                <option value="kopek">Köpek</option>
                <option value="kedi">Kedi</option>
                <option value="kus">Kuş</option>
                <option value="diger">Diğer</option>
              </select>
            </div>
          </div>

          {/* Başlık ve Hayvan Adı */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Başlık *</label>
              <input type="text" name="title" required className="w-full border rounded-lg p-2 bg-gray-50" placeholder="Örn: 2 Aylık Golden Yavrusu" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Adı (Opsiyonel)</label>
              <input type="text" name="name" className="w-full border rounded-lg p-2 bg-gray-50" placeholder="Örn: Pamuk" />
            </div>
          </div>

          {/* İletişim */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">İlan Sahibi Adı</label>
              <input type="text" name="contactName" className="w-full border rounded-lg p-2 bg-gray-50" placeholder="Ahmet Yılmaz" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Telefon</label>
              <input type="text" name="contactPhone" className="w-full border rounded-lg p-2 bg-gray-50" placeholder="0555 555 5555" />
            </div>
          </div>

          {/* Şehir / İlçe (API'den) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">İl *</label>
              <select
                name="city"
                required
                value={selectedCity}
                onChange={e => handleCityChange(e.target.value)}
                className="w-full border rounded-lg p-2 bg-gray-50"
              >
                <option value="">-- İl Seçin --</option>
                {CITIES.map(cityName => (
                  <option key={cityName} value={cityName}>{cityName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">İlçe</label>
              <select
                name="district"
                className="w-full border rounded-lg p-2 bg-gray-50"
                disabled={districts.length === 0}
              >
                <option value="">-- İlçe Seçin --</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Irk + Yaş + Cinsiyet */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Irk</label>
              <select name="breed" className="w-full border rounded-lg p-2 bg-gray-50" required>
                <option value="">Irk Seçin</option>
                {breeds.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Yaş</label>
              <select name="age" className="w-full border rounded-lg p-2 bg-gray-50" required>
                <option value="">Seçiniz</option>
                {AGE_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Cinsiyet</label>
              <select name="gender" className="w-full border rounded-lg p-2 bg-gray-50">
                <option value="bilinmiyor">Bilinmiyor</option>
                <option value="erkek">Erkek</option>
                <option value="disi">Dişi</option>
              </select>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-bold mb-1">Açıklama *</label>
            <textarea name="description" required rows={4} className="w-full border rounded-lg p-2 bg-gray-50" placeholder="İlan detayları..." />
          </div>

          {/* Fotoğraf yükleme */}
          <div>
            <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--surface-secondary)]">
              <input type="file" multiple accept="image/*" className="hidden" onChange={e => handlePhotos(e.target.files)} />
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                <Upload size={22} className="text-[var(--brand-primary)]" />
              </div>
              <h3 className="font-bold mb-1 text-sm">Fotoğrafları sürükleyin veya seçin</h3>
              <p className="text-xs text-[var(--foreground-muted)]">PNG, JPG veya WEBP · Max 5MB/adet · {ghostPhotos.length}/10</p>
            </label>

            {ghostPreviews.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                {ghostPreviews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                    {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-[var(--brand-primary)] text-white px-1.5 py-0.5 rounded font-bold">Kapak</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" variant="gradient" fullWidth className="py-3 mt-4" isLoading={submitting}>
            İlanı Doğrudan Yayına Al
          </Button>
        </form>
      </div>
    </div>
  );
}
