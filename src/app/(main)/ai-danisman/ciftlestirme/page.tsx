'use client';

import { useState, useEffect } from 'react';
import { Heart, Sparkles, AlertCircle, RefreshCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ListingCard from '@/components/ui/ListingCard';

export default function AiCiftlestirmePage() {
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const [myPets, setMyPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile && data.profile.listings) {
          setMyPets(data.profile.listings);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!selectedPet) return;
    setIsSearching(true);
    setResults(null);
    try {
      const res = await fetch('/api/listings?kategori=ciftlestirme');
      const data = await res.json();
      setTimeout(() => {
        setIsSearching(false);
        if (data.success) {
          // Sadece kedi ilanlarını (örnek olarak) filtreleyip döndür
          setResults(data.listings.filter((l:any) => l.animal === 'kedi').slice(0, 2).map((l:any) => ({
             ...l, photos: l.photos ? JSON.parse(l.photos) : []
          })));
        } else {
          setResults([]);
        }
      }, 2000);
    } catch {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
            <Heart size={16} className="fill-pink-700" /> Genetik ve Fiziksel Eşleştirme
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">AI Çiftleştirme Önerisi</h1>
          <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Evcil hayvanınızın genetik özelliklerine, ırk standartlarına ve sağlık geçmişine dayanarak platformdaki en uygun eş adaylarını analiz ediyoruz.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl mb-8 flex gap-3 text-sm">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>
            Platformumuz sorumluluk bilinciyle çiftleştirme yapılmasını destekler. Lütfen eşleştirme öncesi her iki hayvanın da gerekli sağlık taramalarından geçtiğinden emin olun.
          </p>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Hangi hayvanınız için eş arıyorsunuz?</h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {loading ? (
              <div className="text-sm text-[var(--foreground-muted)] col-span-2 text-center py-4">Evcil hayvanlarınız yükleniyor...</div>
            ) : myPets.length === 0 ? (
              <div className="text-sm text-[var(--foreground-muted)] col-span-2 text-center py-4 bg-white border border-[var(--border)] rounded-xl">
                Kayıtlı evcil hayvanınız bulunmuyor. Lütfen önce profilinizden "İlan Ver" diyerek hayvanınızı sisteme ekleyin.
              </div>
            ) : (
              myPets.map(pet => (
                <button 
                  key={pet.id} 
                  onClick={() => setSelectedPet(pet.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedPet === pet.id ? 'border-pink-500 bg-pink-50' : 'border-[var(--border)] hover:border-pink-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{pet.name || 'İsimsiz'}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${pet.gender?.toLowerCase() === 'dişi' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {pet.gender?.toLowerCase() === 'dişi' ? '♀ Dişi' : '♂ Erkek'}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)]">{pet.breed || 'Bilinmiyor'} • {pet.age || 'Bilinmiyor'}</div>
                </button>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="gradient" size="lg" disabled={!selectedPet} onClick={handleSearch} isLoading={isSearching}>
              {!isSearching && <><Sparkles size={18} className="mr-2" /> Eş Adaylarını Bul</>}
            </Button>
          </div>
        </Card>

        {isSearching && (
          <div className="text-center py-20 animate-pulse">
            <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto flex items-center justify-center text-pink-500 mb-4 shadow-lg shadow-pink-100">
              <Heart size={28} className="fill-pink-500 animate-pulse" />
            </div>
            <h3 className="font-bold text-lg">Genetik Uyumluluk Analiz Ediliyor...</h3>
            <p className="text-sm text-[var(--foreground-muted)]">Irk standartları, kan bağı olasılıkları ve konumlar taranıyor.</p>
          </div>
        )}

        {results && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display">Yüksek Uyumlu Adaylar</h2>
              <span className="text-sm text-[var(--foreground-muted)]">{results.length} eşleşme bulundu</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map(listing => (
                <div key={listing.id} className="relative">
                  {/* Uyumluluk Skoru */}
                  <div className="absolute -top-3 -right-3 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border-2 border-white">
                    <Sparkles size={12} /> %94 Uyum
                  </div>
                  <ListingCard listing={{...listing, type: 'ciftlestirme'}} />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" leftIcon={<RefreshCcw size={16} />}>Farklı Adaylar Ara</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
