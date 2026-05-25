'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, MapPin, Phone, Mail, Share2, Shield, Info, CheckCircle, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ListingCard from '@/components/ui/ListingCard';

export default function BarinakDetayPage() {
  const params = useParams();
  const id = params.id as string;

  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setListings(data.listings.slice(0, 3));
        }
      });
  }, []);

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Cover Image */}
      <div className="h-72 bg-slate-800 relative">
        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex items-end gap-6">
            <div className="w-32 h-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden flex-shrink-0">
              <img src="https://ui-avatars.com/api/?name=Umut+Barinagi&background=ea580c&color=fff&size=200" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-white pb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <CheckCircle size={10} /> Resmi Kurum
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-sm">Vakıf</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2 drop-shadow-md">Umut Hayvan Barınağı</h1>
              <p className="flex items-center gap-2 text-white/90 text-sm">
                <MapPin size={16} /> Beşiktaş, İstanbul
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-[var(--brand-primary)] mb-1">1,250+</div>
                <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide font-semibold">Sahiplendirilen</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">120</div>
                <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide font-semibold">Aktif İlan</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">15 Yıl</div>
                <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide font-semibold">Hizmet</div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Hakkımızda</h2>
              <div className="prose prose-sm text-[var(--foreground-muted)]">
                <p>Umut Hayvan Barınağı, 2010 yılından bu yana sokak hayvanlarına sıcak bir yuva bulmak için faaliyet gösteren kar amacı gütmeyen bir sivil toplum kuruluşudur.</p>
                <p>Amacımız; terk edilmiş, yaralı veya yardıma muhtaç canları rehabilite ederek onları sevgi dolu kalıcı yuvalarına kavuşturmaktır. Tesisimizde veteriner hekimlerimiz gözetiminde bakım hizmetleri verilmektedir.</p>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Barınaktaki Canlar (120)</h2>
                <Button variant="outline" size="sm">Tümünü Gör</Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={{ 
                    ...listing, 
                    ownerType: 'barinakta',
                    photos: listing.photos ? JSON.parse(listing.photos) : [] 
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">İletişim</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--foreground-muted)] shrink-0" />
                  <span className="text-[var(--foreground)]">Yıldız Mah. Barbaros Bulvarı No:123 Beşiktaş / İstanbul</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[var(--foreground-muted)] shrink-0" />
                  <a href="tel:02120000000" className="hover:text-[var(--brand-primary)]">0212 000 00 00</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[var(--foreground-muted)] shrink-0" />
                  <a href="mailto:info@umutbarinagi.org" className="hover:text-[var(--brand-primary)]">info@umutbarinagi.org</a>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink size={18} className="text-[var(--foreground-muted)] shrink-0" />
                  <a href="#" className="hover:text-[var(--brand-primary)] text-[var(--brand-primary)]">Resmi Web Sitesi</a>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button fullWidth variant="gradient" leftIcon={<Heart size={16} />}>Bağış Yap</Button>
                <Button fullWidth variant="outline" leftIcon={<Share2 size={16} />}>Sayfayı Paylaş</Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-100 text-blue-900">
              <div className="flex gap-3 items-start">
                <Info size={20} className="shrink-0 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-bold mb-1">Sahiplendirme Prosedürü</h4>
                  <p className="text-blue-800/80 mb-2">Bu barınak sahiplendirme öncesi ev ziyareti ve form doldurma şartı aramaktadır. Tüm işlemler ücretsizdir.</p>
                </div>
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
