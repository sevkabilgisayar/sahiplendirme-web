'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, List, Heart, MessageSquare, Settings, LogOut, 
  BarChart3, Eye, Calendar, MapPin, Edit, Trash2, ShieldCheck,
  Plus, Bell, Phone, Lock, ClipboardList, Check, X, ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockListings } from '@/lib/mock-data';
import ListingCard from '@/components/ui/ListingCard';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

type TabType = 'dashboard' | 'ilanlarim' | 'favoriler' | 'basvurular' | 'mesajlar' | 'ayarlar';

const mockApplications = [
  { id: '1', listing: 'Pamuk - Karışık/Melez', applicant: 'Ali Demir', city: 'İstanbul', housing: 'Bahçeli Ev', message: 'Kedilerle tecrübem var, bahçeli evde yaşıyorum.', status: 'beklemede', date: '2 saat önce' },
  { id: '2', listing: 'Max - Labrador', applicant: 'Zeynep Ak', city: 'Ankara', housing: 'Apartman Dairesi', message: 'Geniş bir dairede yaşıyorum, parklar yakın.', status: 'onaylandi', date: '1 gün önce' },
  { id: '3', listing: 'Karamel - Golden', applicant: 'Burak Ş.', city: 'İzmir', housing: 'Müstakil Ev', message: 'Daha önce Golden tecrübem oldu.', status: 'reddedildi', date: '3 gün önce' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const myFavorites = mockListings.slice(0, 3);
  const myListings = mockListings.slice(3, 5);

  const TABS = [
    { id: 'dashboard', label: 'Özet', icon: <User size={18} /> },
    { id: 'ilanlarim', label: 'İlanlarım', icon: <List size={18} /> },
    { id: 'basvurular', label: 'Başvurular', icon: <ClipboardList size={18} />, badge: 1 },
    { id: 'favoriler', label: 'Favorilerim', icon: <Heart size={18} /> },
    { id: 'mesajlar', label: 'Mesajlarım', icon: <MessageSquare size={18} />, badge: 2 },
    { id: 'ayarlar', label: 'Ayarlar', icon: <Settings size={18} /> },
  ];

  return (
    <div className="bg-[var(--background)] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sticky top-24">
              
              <div className="flex flex-col items-center text-center pb-6 border-b border-[var(--border)] mb-4">
                <div className="w-20 h-20 rounded-full gradient-brand text-white flex items-center justify-center text-3xl font-bold mb-3 shadow-md">
                  A
                </div>
                <h2 className="font-bold font-display text-lg">Ayşe Yılmaz</h2>
                <div className="flex items-center justify-center gap-1 text-xs text-[var(--brand-primary)] mt-1 font-semibold">
                  <ShieldCheck size={14} /> Doğrulanmış Hesap
                </div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">
                  Ekim 2023'ten beri üye
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                        : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    
                    {tab.id === 'mesajlar' && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        2
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm font-medium text-red-500 hover:bg-red-50">
                  <LogOut size={18} />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in space-y-6">
                <h1 className="text-2xl font-bold font-display">Hesap Özeti</h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-5 flex items-center gap-4 bg-[var(--surface)]">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <List size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-display">2</div>
                      <div className="text-xs text-[var(--foreground-muted)] font-medium">Aktif İlanım</div>
                    </div>
                  </Card>
                  
                  <Card className="p-5 flex items-center gap-4 bg-[var(--surface)]">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Eye size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-display">1.2K</div>
                      <div className="text-xs text-[var(--foreground-muted)] font-medium">İlan Görüntülenmesi</div>
                    </div>
                  </Card>

                  <Card className="p-5 flex items-center gap-4 bg-[var(--surface)]">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                      <Heart size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-display">24</div>
                      <div className="text-xs text-[var(--foreground-muted)] font-medium">Favoriye Eklenme</div>
                    </div>
                  </Card>
                </div>

                {/* Profile Details */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
                    <h2 className="text-lg font-bold font-display">Kişisel Bilgiler</h2>
                    <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}>Düzenle</Button>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">Ad Soyad</div>
                      <div className="font-semibold text-sm">Ayşe Yılmaz</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">E-posta</div>
                      <div className="font-semibold text-sm">ayse.yilmaz@example.com</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">Telefon</div>
                      <div className="font-semibold text-sm">+90 555 123 4567</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">Konum</div>
                      <div className="font-semibold text-sm flex items-center gap-1">
                        <MapPin size={14} className="text-[var(--brand-primary)]" /> İstanbul, Kadıköy
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* TAB: İLANLARIM */}
            {activeTab === 'ilanlarim' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold font-display">İlanlarım</h1>
                  <Link href="/ilan-ver">
                    <Button variant="gradient" size="sm" leftIcon={<Plus size={16} />}>Yeni İlan Ver</Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <Card key={listing.id} className="p-4 flex flex-col sm:flex-row items-center gap-5 hover:border-[var(--brand-primary-light)] transition-colors">
                      <div className={`w-24 h-24 rounded-xl flex-shrink-0 bg-gradient-to-br ${listing.imageColor} flex items-center justify-center text-4xl`}>
                        {listing.emoji}
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Aktif</span>
                          <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-1">
                            <Calendar size={12} /> {listing.createdAt}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg">{listing.name} - {listing.breed}</h3>
                        <div className="text-sm text-[var(--foreground-muted)] mt-1">
                          {listing.city} • {listing.type === 'sahiplendirme' ? 'Sahiplendirme' : 'Kayıp'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link href={`/ilan/${listing.id}`} className="flex-1 sm:flex-none">
                          <Button variant="outline" size="sm" className="w-full">Görüntüle</Button>
                        </Link>
                        <Button variant="outline" size="sm" className="px-3 text-red-500 hover:bg-red-50 border-[var(--border)]" title="Sil">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FAVORİLER */}
            {activeTab === 'favoriler' && (
              <div className="animate-fade-in space-y-6">
                <h1 className="text-2xl font-bold font-display mb-2">Favorilerim</h1>
                <p className="text-[var(--foreground-muted)] text-sm mb-6">Kaydettiğiniz ilanlar ({myFavorites.length})</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myFavorites.map((listing) => (
                    <div key={listing.id} className="h-full">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BAŞVURULAR */}
            {activeTab === 'basvurular' && (
              <div className="animate-fade-in space-y-6">
                <h1 className="text-2xl font-bold font-display">Gelen Başvurular</h1>
                <div className="space-y-4">
                  {mockApplications.map((app) => (
                    <Card key={app.id} className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              app.status === 'beklemede' ? 'bg-yellow-100 text-yellow-700'
                              : app.status === 'onaylandi' ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                            }`}>{app.status === 'beklemede' ? 'Beklemede' : app.status === 'onaylandi' ? 'Onaylandı' : 'Reddedildi'}</span>
                            <span className="text-xs text-[var(--foreground-muted)]">{app.date}</span>
                          </div>
                          <h3 className="font-bold">{app.applicant} <span className="font-normal text-sm text-[var(--foreground-muted)]">→ {app.listing}</span></h3>
                          <p className="text-sm text-[var(--foreground-muted)] mt-1">{app.city} · {app.housing}</p>
                          <p className="text-sm mt-2 bg-[var(--surface-secondary)] p-2 rounded-lg">&quot;{app.message}&quot;</p>
                        </div>
                        {app.status === 'beklemede' && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button variant="gradient" size="sm" leftIcon={<Check size={14} />} onClick={() => toast.success('Başvuru onaylandı!')}>Onayla</Button>
                            <Button variant="outline" size="sm" leftIcon={<X size={14} />} className="text-red-500" onClick={() => toast.success('Başvuru reddedildi')}>Reddet</Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MESAJLAR */}
            {activeTab === 'mesajlar' && (
              <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} />
                </div>
                <h2 className="text-xl font-bold font-display mb-2">Mesajlarınız</h2>
                <p className="text-[var(--foreground-muted)] max-w-md mb-4">Tam mesajlaşma deneyimi için ayrı sayfaya gidin.</p>
                <Link href="/profil/mesajlar">
                  <Button variant="gradient" rightIcon={<ArrowRight size={16} />}>Mesajlara Git</Button>
                </Link>
              </div>
            )}

            {/* TAB: AYARLAR */}
            {activeTab === 'ayarlar' && (
              <div className="animate-fade-in space-y-8">
                <h1 className="text-2xl font-bold font-display">Hesap Ayarları</h1>

                {/* Profil Bilgileri */}
                <Card className="p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Edit size={18} /> Profil Bilgileri</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Ad" defaultValue="Ayşe" />
                    <Input label="Soyad" defaultValue="Yılmaz" />
                    <Input label="E-posta" type="email" defaultValue="ayse@mail.com" />
                    <Input label="Telefon" defaultValue="532 XXX XX XX" />
                  </div>
                  <Button variant="gradient" size="sm" className="mt-4" onClick={() => toast.success('Bilgiler güncellendi!')}>Kaydet</Button>
                </Card>

                {/* Şifre Değiştirme */}
                <Card className="p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Lock size={18} /> Şifre Değiştir</h2>
                  <div className="flex flex-col gap-4 max-w-md">
                    <Input label="Mevcut Şifre" type="password" placeholder="••••••••" />
                    <Input label="Yeni Şifre" type="password" placeholder="En az 8 karakter" />
                    <Input label="Yeni Şifre Tekrar" type="password" placeholder="••••••••" />
                  </div>
                  <Button variant="gradient" size="sm" className="mt-4" onClick={() => toast.success('Şifre değiştirildi!')}>Şifreyi Güncelle</Button>
                </Card>

                {/* Bildirim Tercihleri */}
                <Card className="p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell size={18} /> Bildirim Tercihleri</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Yeni mesaj bildirimleri', desc: 'Biri size mesaj gönderdiğinde' },
                      { label: 'Başvuru bildirimleri', desc: 'İlanınıza başvuru yapıldığında' },
                      { label: 'Kayıp ilan uyarıları', desc: 'Yakınınızda kayıp ilan olduğunda' },
                      { label: 'E-posta bildirimleri', desc: 'Önemli güncellemeler e-posta ile' },
                      { label: 'Kampanya bildirimleri', desc: 'İndirim ve yenilikler' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div className="text-xs text-[var(--foreground-muted)]">{item.desc}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[var(--brand-primary)] rounded-full peer-focus:ring-2 peer-focus:ring-[var(--brand-primary)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Telefon Doğrulama */}
                <Card className="p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Phone size={18} /> Telefon Doğrulama</h2>
                  <p className="text-sm text-[var(--foreground-muted)] mb-4">Telefon numaranızı doğrulayarak hesap güvenliğinizi artırın.</p>
                  <Button variant="outline" size="sm" onClick={() => toast.success('Doğrulama kodu gönderildi!')}>Doğrulama Kodu Gönder</Button>
                </Card>

                {/* Hesap İşlemleri */}
                <Card className="p-6 border-red-200">
                  <h2 className="font-bold text-lg mb-4 text-red-600">Tehlikeli Bölge</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-300">Hesabı Dondur</Button>
                    <Button variant="danger" size="sm">Hesabı Sil</Button>
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] mt-2">Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir.</p>
                </Card>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
