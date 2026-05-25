'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Sparkles, ArrowRight, Shield, Zap, Store, Stethoscope, Scissors, Dog, Hotel, PersonStanding } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaketlerPage() {
  const router = useRouter();
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        if (data.packages) {
          setDbPackages(data.packages);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getUiDetails = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('mağaza') || n.includes('e-ticaret')) return { icon: <Store size={24} className="text-orange-500" />, color: 'border-orange-500', bgColor: 'bg-orange-50' };
    if (n.includes('veteriner')) return { icon: <Stethoscope size={24} className="text-blue-500" />, color: 'border-blue-500', bgColor: 'bg-blue-50' };
    if (n.includes('kuaför')) return { icon: <Scissors size={24} className="text-pink-500" />, color: 'border-pink-500', bgColor: 'bg-pink-50' };
    if (n.includes('eğitmen')) return { icon: <Dog size={24} className="text-emerald-500" />, color: 'border-emerald-500', bgColor: 'bg-emerald-50' };
    if (n.includes('otel') || n.includes('konaklama')) return { icon: <Hotel size={24} className="text-violet-500" />, color: 'border-violet-500', bgColor: 'bg-violet-50' };
    if (n.includes('gezdirici')) return { icon: <PersonStanding size={24} className="text-teal-500" />, color: 'border-teal-500', bgColor: 'bg-teal-50' };
    return { icon: <Sparkles size={24} className="text-purple-500" />, color: 'border-purple-500', bgColor: 'bg-purple-50' };
  };

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = dbPackages.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  const handleCheckout = () => {
    if (selectedServices.length === 0) {
      alert('Lütfen en az bir hizmet seçin.');
      return;
    }
    router.push(`/odeme?services=${selectedServices.join(',')}`);
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-16 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)]/10 px-4 py-1.5 rounded-full text-sm font-semibold text-[var(--brand-primary)] mb-4">
            <Sparkles size={14} /> Profesyonel Hesap
          </div>
          <h1 className="text-4xl sm:text-4xl font-bold font-display mb-4">
            Vermek İstediğiniz <span className="text-gradient">Hizmetleri Seçin</span>
          </h1>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            İhtiyacınız olan hizmetleri seçerek kendi paketinizi oluşturun. Seçtiğiniz modüllere göre satıcı paneliniz özelleştirilecektir.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-20 text-[var(--foreground-muted)]">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--brand-primary)] rounded-full animate-spin mx-auto mb-4"></div>
            Paketler yükleniyor...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {dbPackages.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              const ui = getUiDetails(service.name);
              
              // Get description from features json
              let desc = "Profesyonel hizmet paketi";
              try {
                const feats = JSON.parse(service.features);
                if (feats && feats.length > 0) desc = feats[0];
              } catch(e) {}

              return (
                <div 
                  key={service.id} 
                  onClick={() => toggleService(service.id)}
                  className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? `${ui.color} ${ui.bgColor} shadow-md scale-[1.02]` 
                      : 'border-[var(--border)] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                      {ui.icon}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? ui.color + ' bg-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check size={14} className="text-black" />}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-display mb-2">{service.name}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-4 h-10">{desc}</p>
                  <div className="font-bold text-2xl">
                    ₺{service.price} <span className="text-sm text-[var(--foreground-muted)] font-normal">/ ay</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}


      </div>

      {/* Floating Checkout Bar */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[var(--border)] shadow-2xl p-4 z-50 animate-fade-in">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--foreground-muted)] font-medium mb-1">Seçilen Hizmetler ({selectedServices.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedServices.map(id => (
                  <span key={id} className="text-xs bg-gray-100 px-2 py-1 rounded-md font-semibold">
                    {dbPackages.find(s => s.id === id)?.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="text-right">
                <p className="text-sm text-[var(--foreground-muted)]">Aylık Toplam</p>
                <p className="text-2xl font-bold font-display text-[var(--brand-primary)]">₺{totalPrice}</p>
              </div>
              <Button size="lg" variant="gradient" className="px-8 whitespace-nowrap flex-1 sm:flex-none" onClick={handleCheckout}>
                Ödemeye Geç <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
