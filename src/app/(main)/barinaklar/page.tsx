'use client';

import { useState } from 'react';
import { MapPin, Search, CheckCircle, Heart, ChevronDown, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CITIES } from '@/constants';
import Link from 'next/link';

import { useEffect } from 'react';

export default function BarınaklarPage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [search, setSearch] = useState('');
  const [allShelters, setAllShelters] = useState<any[]>([]);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  useEffect(() => {
    fetch('/api/shelters')
      .then(r => r.json())
      .then(data => {
        if (data.success) setAllShelters(data.shelters);
      })
      .catch(console.error);
  }, []);

  const filtered = allShelters.filter(s => {
    if (selectedCity && s.city !== selectedCity) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (showOnlyVerified && !s.verified) return false;
    return true;
  });

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-[var(--border)] pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 gradient-brand rounded-2xl flex items-center justify-center text-2xl shadow-sm">🏛️</div>
            <div>
              <h1 className="text-3xl font-bold font-display">Barınaklar &amp; Vakıflar</h1>
              <p className="text-sm text-[var(--foreground-muted)]">Türkiye genelinde doğrulanmış hayvan barınakları ve STK&apos;lar</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {[
              { emoji: '🏛️', value: `${allShelters.length}+`, label: 'Barınak' },
              { emoji: '📋', value: `${allShelters.reduce((a, s) => a + (s.activeListings || 0), 0)}+`, label: 'Aktif İlan' },
              { emoji: '❤️', value: `${allShelters.reduce((a, s) => a + (s.adopted || 0), 0)}+`, label: 'Sahiplenme' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-white/80 border border-[var(--border)] rounded-xl px-4 py-2 shadow-sm">
                <span className="text-xl">{s.emoji}</span>
                <div>
                  <div className="font-bold text-sm leading-none">{s.value}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex-1 min-w-56 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input type="text" placeholder="Barınak veya vakıf ara..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm" />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                className="h-12 pl-9 pr-8 appearance-none rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm">
                <option value="">Tüm Şehirler</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
            </div>
            <label className="flex items-center gap-2 px-4 h-12 bg-white border border-[var(--border)] rounded-xl text-sm cursor-pointer hover:bg-[var(--surface-secondary)] transition-colors shadow-sm">
              <input type="checkbox" checked={showOnlyVerified} onChange={e => setShowOnlyVerified(e.target.checked)}
                className="w-4 h-4 accent-[var(--brand-primary)]" />
              <Shield size={14} className="text-blue-500" />
              Sadece Doğrulanmış
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          <strong className="text-[var(--foreground)]">{filtered.length}</strong> barınak listeleniyor
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((shelter) => (
            <Card key={shelter.id} className="p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Top */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-2xl flex-shrink-0">
                  🏛️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    {shelter.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle size={10} /> Doğrulandı
                      </span>
                    )}
                    {shelter.official && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                        <Shield size={10} /> Resmi Kurum
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm leading-tight line-clamp-2">{shelter.name}</h3>
                </div>
              </div>

              <p className="text-xs text-[var(--foreground-muted)] flex items-center gap-1 mb-3">
                <MapPin size={12} /> {shelter.district}, {shelter.city}
              </p>

              <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2 flex-1">{shelter.about}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-5 text-xs font-semibold">
                <span className="flex items-center gap-1 text-[var(--brand-primary)]">📋 {shelter.activeListings} ilan</span>
                <span className="flex items-center gap-1 text-green-600">
                  <Heart size={12} className="fill-green-600" /> {shelter.adopted} sahiplenme
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Link href={`/ilanlar?sehir=${encodeURIComponent(shelter.city)}`} className="flex-1">
                  <Button variant="gradient" size="sm" fullWidth>İlanlarını Gör</Button>
                </Link>
                <Link href={`/barinaklar/${shelter.id}`}>
                  <Button variant="outline" size="sm" className="px-3">Profil</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-lg font-bold font-display mb-2">Barınak bulunamadı</h3>
            <p className="text-sm text-[var(--foreground-muted)]">Filtreleri değiştirerek tekrar deneyin.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-3">Barınağınızı Platforma Ekleyin</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Vakıf ve barınaklar için ücretsiz. Hayvanlarınızı binlerce hayvan sever ile buluşturun.</p>
          <Link href="/register?tip=barinak">
            <Button variant="outline" size="lg" className="bg-white text-blue-600 border-white hover:bg-blue-50 font-bold">
              Barınak Hesabı Aç
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
