'use client';

import { useState } from 'react';
import { Search, Sparkles, Home, Activity, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ListingCard from '@/components/ui/ListingCard';
import { mockListings } from '@/lib/mock-data';

export default function AiHayvanBulPage() {
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockListings | null>(null);

  const handleSearch = () => {
    if (!prompt.trim()) return;
    setIsSearching(true);
    setResults(null);
    setTimeout(() => {
      setIsSearching(false);
      setResults(mockListings.slice(0, 4));
    }, 2000);
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={16} /> AI Destekli Eşleştirme
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">Size En Uygun Dostunuzu Bulun</h1>
          <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Nasıl bir evde yaşıyorsunuz? Ne kadar aktifsiniz? Beklentilerinizi yazın, yapay zekamız platformdaki binlerce ilan arasından size en uygun olanları saniyeler içinde önersin.
          </p>
        </div>

        <Card className="p-4 mb-8 border-[var(--brand-primary-light)] shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" size={20} />
              <textarea 
                className="w-full h-24 pl-12 pr-4 pt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
                placeholder="Örn: Küçük bir apartman dairesinde yalnız yaşıyorum. Evden çalışıyorum ve günde 1 saat yürüyüş yapabilirim. Tüy dökmeyen, sakin bir köpek arıyorum..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>
            <div className="md:w-48 flex flex-col gap-2">
              <Button fullWidth variant="gradient" className="h-full min-h-12" onClick={handleSearch} isLoading={isSearching}>
                {!isSearching && <><Sparkles size={18} className="mr-2" /> Analiz Et</>}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[var(--foreground-muted)] mt-1.5 mr-2">Örnekler:</span>
            {[
              'Bahçeli evim var, çocuklarla iyi anlaşan enerjik bir köpek',
              'İlk defa kedi sahipleneceğim, uysal ve sevgi dolu olsun',
              'Çok seyahat ediyorum, evde yalnız kalabilen bağımsız bir tür'
            ].map(ex => (
              <button key={ex} onClick={() => setPrompt(ex)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors">
                {ex}
              </button>
            ))}
          </div>
        </Card>

        {isSearching && (
          <div className="text-center py-20 animate-pulse">
            <div className="w-16 h-16 gradient-brand rounded-full mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-200">
              <Sparkles size={28} className="animate-spin-slow" />
            </div>
            <h3 className="font-bold text-lg">Yapay Zekâ Analiz Ediyor...</h3>
            <p className="text-sm text-[var(--foreground-muted)]">İlanlar taranıyor, yaşam tarzınıza en uygun hayvanlar seçiliyor.</p>
          </div>
        )}

        {results && (
          <div className="animate-slide-up">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 flex gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <Check size={24} />
              </div>
              <div>
                <h3 className="font-bold text-green-800 mb-2">Yapay Zekâ Analiz Sonucu</h3>
                <p className="text-sm text-green-700 leading-relaxed mb-4">
                  Profilinize göre <strong>sakin karakterli, düşük egzersiz ihtiyacı olan küçük ırk köpekler</strong> (Örn: Pug, French Bulldog) veya <strong>bağımsız kediler</strong> (Örn: British Shorthair) size en uygunudur.
                </p>
                <div className="flex gap-4 text-xs font-bold text-green-800">
                  <span className="flex items-center gap-1"><Home size={14}/> Apartman Uygunluğu: %95</span>
                  <span className="flex items-center gap-1"><Activity size={14}/> Egzersiz İhtiyacı: Düşük</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold font-display mb-4">Önerilen İlanlar</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
