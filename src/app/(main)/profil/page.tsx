'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User, List, Heart, MessageSquare, Settings, LogOut,
  ShoppingBag, Star, Tag, Bell, Package, ClipboardList,
  Check, X, Edit, MapPin, ShieldCheck, Plus, Trash2,
  Calendar, Eye, Lock, Phone, ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockListings, mockStoreProducts } from '@/lib/mock-data';
import ListingCard from '@/components/ui/ListingCard';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';
import ProductCard from '@/components/ui/ProductCard';

const MOCK_USER = {
  name: 'Ayşe Yılmaz',
  email: 'ayse.yilmaz@example.com',
  phone: '+90 555 123 4567',
  city: 'İstanbul, Kadıköy',
  avatar: 'A',
  since: 'Ekim 2023',
};

const MOCK_ORDERS = [
  { id: 'SP-20240101', product: 'Royal Canin Medium Adult 3KG', date: '12 Ocak 2024', price: 289, status: 'teslim', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&auto=format&fit=crop' },
  { id: 'SP-20240205', product: 'Purina Pro Plan Kedi 1.5KG', date: '5 Şubat 2024', price: 199, status: 'kargoda', img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&auto=format&fit=crop' },
  { id: 'SP-20240318', product: 'Ortopedik Köpek Yatağı', date: '18 Mart 2024', price: 379, status: 'hazirlaniyor', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&auto=format&fit=crop' },
];

const MOCK_REVIEWS = [
  { id: 1, product: 'Royal Canin Medium Adult', rating: 5, text: 'Köpeğim çok beğendi, kesinlikle tavsiye ederim.', date: '10 Ocak 2024' },
  { id: 2, product: 'Purina Pro Plan Kedi', rating: 4, text: 'Kaliteli ürün, kargoda biraz geç geldi.', date: '3 Şubat 2024' },
];

const MOCK_COUPONS = [
  { code: 'HOSGELDIN10', desc: '%10 indirim - İlk sipariş', expiry: '31 Mayıs 2024', used: false },
  { code: 'KARGO0', desc: 'Ücretsiz kargo kuponu', expiry: '15 Haziran 2024', used: false },
  { code: 'YAZA20', desc: '%20 yaz indirimi', expiry: '1 Temmuz 2024', used: true },
];

const MOCK_APPLICATIONS = [
  { id: '1', listing: 'Pamuk - Karışık/Melez', applicant: 'Ali Demir', city: 'İstanbul', status: 'beklemede', date: '2 saat önce', message: 'Kedilerle tecrübem var.' },
  { id: '2', listing: 'Max - Labrador', applicant: 'Zeynep Ak', city: 'Ankara', status: 'onaylandi', date: '1 gün önce', message: 'Geniş dairede yaşıyorum.' },
];

type Tab = 'ozet' | 'siparisler' | 'ilanlarim' | 'favoriler' | 'degerlendirmeler' | 'kuponlar' | 'basvurular' | 'ayarlar';

const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: 'ozet', label: 'Hesabım', icon: <User size={16} /> },
  { id: 'siparisler', label: 'Siparişlerim', icon: <Package size={16} /> },
  { id: 'ilanlarim', label: 'İlanlarım', icon: <List size={16} /> },
  { id: 'basvurular', label: 'Başvurularım', icon: <ClipboardList size={16} />, badge: 1 },
  { id: 'favoriler', label: 'Beğendiklerim', icon: <Heart size={16} /> },
  { id: 'degerlendirmeler', label: 'Değerlendirmelerim', icon: <Star size={16} /> },
  { id: 'kuponlar', label: 'Kuponlarım', icon: <Tag size={16} /> },
  { id: 'ayarlar', label: 'Kullanıcı Bilgilerim', icon: <Settings size={16} /> },
];

const statusMap: Record<string, { label: string; color: string }> = {
  teslim: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  kargoda: { label: 'Kargoda', color: 'bg-blue-100 text-blue-700' },
  hazirlaniyor: { label: 'Hazırlanıyor', color: 'bg-yellow-100 text-yellow-700' },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('ozet');
  const myFavorites = mockListings.slice(0, 3);
  const myListings = mockListings.slice(3, 5);
  const favProducts = mockStoreProducts.slice(0, 4);

  return (
    <div className="bg-[var(--background)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── SOL PANEL ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-4 sticky top-20 shadow-sm">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center pb-5 border-b border-[var(--border)] mb-3">
                <div className="w-20 h-20 rounded-full gradient-brand text-white flex items-center justify-center text-3xl font-bold mb-3 shadow-md">
                  {MOCK_USER.avatar}
                </div>
                <h2 className="font-bold text-base">{MOCK_USER.name}</h2>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 font-semibold">
                  <ShieldCheck size={12} /> Doğrulanmış Hesap
                </div>
                <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{MOCK_USER.since}'den beri üye</div>
              </div>

              {/* Nav */}
              <nav className="flex flex-col gap-0.5">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                        : 'text-[var(--foreground-muted)] hover:bg-gray-50 hover:text-[var(--foreground)]'
                    }`}>
                    {tab.icon}
                    <span className="flex-1 text-left">{tab.label}</span>
                    {tab.badge && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
                    {activeTab !== tab.id && <ChevronRight size={14} className="opacity-30" />}
                  </button>
                ))}
              </nav>

              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <button onClick={() => toast.success('Çıkış yapıldı')}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                  <LogOut size={16} /> Çıkış Yap
                </button>
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* ÖZET */}
            {activeTab === 'ozet' && (
              <div className="space-y-5">
                <h1 className="text-xl font-bold">Hesabım</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: <Package size={20} />, label: 'Siparişlerim', val: '3', color: 'bg-blue-50 text-blue-600', tab: 'siparisler' as Tab },
                    { icon: <List size={20} />, label: 'İlanlarım', val: '2', color: 'bg-orange-50 text-orange-600', tab: 'ilanlarim' as Tab },
                    { icon: <Heart size={20} />, label: 'Beğendiklerim', val: '7', color: 'bg-pink-50 text-pink-600', tab: 'favoriler' as Tab },
                    { icon: <Tag size={20} />, label: 'Kuponlarım', val: '2', color: 'bg-purple-50 text-purple-600', tab: 'kuponlar' as Tab },
                  ].map(s => (
                    <button key={s.label} onClick={() => setActiveTab(s.tab)}
                      className="bg-white border border-[var(--border)] rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[var(--brand-primary)] transition-colors shadow-sm text-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                      <div className="text-xl font-bold">{s.val}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">{s.label}</div>
                    </button>
                  ))}
                </div>

                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-4">
                    <h2 className="font-bold">Kişisel Bilgiler</h2>
                    <Button variant="outline" size="sm" leftIcon={<Edit size={13} />} onClick={() => setActiveTab('ayarlar')}>Düzenle</Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {[['Ad Soyad', MOCK_USER.name], ['E-posta', MOCK_USER.email], ['Telefon', MOCK_USER.phone], ['Konum', MOCK_USER.city]].map(([k, v]) => (
                      <div key={k}><div className="text-xs text-[var(--foreground-muted)] mb-0.5">{k}</div><div className="font-semibold">{v}</div></div>
                    ))}
                  </div>
                </Card>

                {/* Son Sipariş */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold">Son Siparişlerim</h2>
                    <button onClick={() => setActiveTab('siparisler')} className="text-xs text-[var(--brand-primary)] font-semibold hover:underline">Tümünü Gör</button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_ORDERS.slice(0, 2).map(o => (
                      <div key={o.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <img src={o.img} alt={o.product} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{o.product}</div>
                          <div className="text-xs text-[var(--foreground-muted)]">{o.date}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusMap[o.status].color}`}>{statusMap[o.status].label}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* SİPARİŞLER */}
            {activeTab === 'siparisler' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Siparişlerim</h1>
                {MOCK_ORDERS.map(o => (
                  <div key={o.id} className="bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
                      <div className="text-xs text-[var(--foreground-muted)]">Sipariş No: <span className="font-bold text-[var(--foreground)]">{o.id}</span></div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusMap[o.status].color}`}>{statusMap[o.status].label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <img src={o.img} alt={o.product} className="w-16 h-16 rounded-xl object-cover border border-[var(--border)]" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{o.product}</div>
                        <div className="text-xs text-[var(--foreground-muted)] mt-0.5">{o.date}</div>
                        <div className="text-base font-bold text-emerald-600 mt-1">₺{o.price}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">Detay</Button>
                        {o.status === 'teslim' && <Button size="sm" variant="outline" leftIcon={<Star size={12} />}>Değerlendir</Button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* İLANLARIM */}
            {activeTab === 'ilanlarim' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">İlanlarım</h1>
                  <Link href="/ilan-ver"><Button size="sm" variant="gradient" leftIcon={<Plus size={14} />}>Yeni İlan</Button></Link>
                </div>
                {myListings.map(listing => (
                  <Card key={listing.id} className="p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className={`w-20 h-20 rounded-xl flex-shrink-0 bg-gradient-to-br ${listing.imageColor} flex items-center justify-center text-4xl`}>{listing.emoji}</div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Aktif</span>
                        <span className="text-xs text-[var(--foreground-muted)]">{listing.createdAt}</span>
                      </div>
                      <h3 className="font-bold">{listing.name} - {listing.breed}</h3>
                      <div className="text-sm text-[var(--foreground-muted)]">{listing.city}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/ilan/${listing.id}`}><Button size="sm" variant="outline">Görüntüle</Button></Link>
                      <Button size="sm" variant="outline" className="px-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* BAŞVURULAR */}
            {activeTab === 'basvurular' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Gelen Başvurular</h1>
                {MOCK_APPLICATIONS.map(app => (
                  <Card key={app.id} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${app.status === 'beklemede' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {app.status === 'beklemede' ? 'Beklemede' : 'Onaylandı'}
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)]">{app.date}</span>
                        </div>
                        <h3 className="font-bold">{app.applicant} <span className="font-normal text-sm text-[var(--foreground-muted)]">→ {app.listing}</span></h3>
                        <p className="text-sm text-[var(--foreground-muted)] mt-1">{app.city}</p>
                        <p className="text-sm mt-2 bg-gray-50 p-2 rounded-lg">"{app.message}"</p>
                      </div>
                      {app.status === 'beklemede' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="gradient" leftIcon={<Check size={13} />} onClick={() => toast.success('Onaylandı!')}>Onayla</Button>
                          <Button size="sm" variant="outline" leftIcon={<X size={13} />} className="text-red-500" onClick={() => toast.error('Reddedildi')}>Reddet</Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* BEĞENDİKLERİM */}
            {activeTab === 'favoriler' && (
              <div className="space-y-5">
                <h1 className="text-xl font-bold">Beğendiklerim</h1>
                <div>
                  <h2 className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">İlanlar</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {myFavorites.map(l => <ListingCard key={l.id} listing={l} />)}
                  </div>
                  <h2 className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">Mağaza Ürünleri</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {favProducts.map((p, i) => <ProductCard key={`${p.id}-${i}`} product={p} size="small" />)}
                  </div>
                </div>
              </div>
            )}

            {/* DEĞERLENDİRMELERİM */}
            {activeTab === 'degerlendirmeler' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Değerlendirmelerim</h1>
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-sm">{r.product}</div>
                        <div className="text-xs text-[var(--foreground-muted)]">{r.date}</div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)] bg-gray-50 p-3 rounded-xl">{r.text}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" leftIcon={<Edit size={12} />}>Düzenle</Button>
                      <Button size="sm" variant="outline" leftIcon={<Trash2 size={12} />} className="text-red-500 hover:bg-red-50">Sil</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* KUPONLAR */}
            {activeTab === 'kuponlar' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Kuponlarım</h1>
                {MOCK_COUPONS.map(c => (
                  <div key={c.code} className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4 ${c.used ? 'border-gray-200 opacity-60' : 'border-[var(--brand-primary)] border-dashed'}`}>
                    <div className="bg-emerald-50 text-emerald-700 font-bold text-lg px-6 py-4 rounded-xl tracking-widest border border-dashed border-emerald-300 select-all">
                      {c.code}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="font-semibold text-sm">{c.desc}</div>
                      <div className="text-xs text-[var(--foreground-muted)] mt-0.5">Son kullanım: {c.expiry}</div>
                    </div>
                    {c.used
                      ? <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">Kullanıldı</span>
                      : <Button size="sm" onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Kupon kopyalandı!'); }}>Kopyala</Button>
                    }
                  </div>
                ))}
              </div>
            )}

            {/* AYARLAR */}
            {activeTab === 'ayarlar' && (
              <div className="space-y-5">
                <h1 className="text-xl font-bold">Kullanıcı Bilgilerim</h1>
                <Card className="p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2"><Edit size={16} /> Kişisel Bilgiler</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Ad" defaultValue="Ayşe" />
                    <Input label="Soyad" defaultValue="Yılmaz" />
                    <Input label="E-posta" type="email" defaultValue={MOCK_USER.email} />
                    <Input label="Telefon" defaultValue="555 123 4567" />
                  </div>
                  <Button variant="gradient" size="sm" className="mt-4" onClick={() => toast.success('Bilgiler güncellendi!')}>Kaydet</Button>
                </Card>
                <Card className="p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2"><Lock size={16} /> Şifre Değiştir</h2>
                  <div className="flex flex-col gap-3 max-w-md">
                    <Input label="Mevcut Şifre" type="password" placeholder="••••••••" />
                    <Input label="Yeni Şifre" type="password" placeholder="En az 8 karakter" />
                    <Input label="Yeni Şifre Tekrar" type="password" placeholder="••••••••" />
                  </div>
                  <Button variant="gradient" size="sm" className="mt-4" onClick={() => toast.success('Şifre değiştirildi!')}>Güncelle</Button>
                </Card>
                <Card className="p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2"><Bell size={16} /> Bildirim Tercihleri</h2>
                  <div className="space-y-4">
                    {['Yeni mesaj bildirimleri', 'Başvuru bildirimleri', 'E-posta bildirimleri', 'Kampanya bildirimleri'].map(item => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[var(--brand-primary)] rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
