'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User, List, Heart, MessageSquare, Settings, LogOut,
  ShoppingBag, Star, Tag, Bell, Package, ClipboardList,
  Check, X, Edit, MapPin, ShieldCheck, Plus, Trash2,
  Calendar, Eye, Lock, Phone, ChevronRight, Search,
  FileUp, Upload, Store, Sparkles, CheckCircle, AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ListingCard from '@/components/ui/ListingCard';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';
import ProductCard from '@/components/ui/ProductCard';

type Tab = 'ozet' | 'siparisler' | 'ilanlarim' | 'favoriler' | 'degerlendirmeler' | 'kuponlar' | 'basvurular' | 'ayarlar';

const TABS = (pendingCount: number): { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] => [
  { id: 'ozet', label: 'Hesabım', icon: <User size={16} /> },
  { id: 'siparisler', label: 'Siparişlerim', icon: <Package size={16} /> },
  { id: 'ilanlarim', label: 'İlanlarım', icon: <List size={16} /> },
  { id: 'basvurular', label: 'Başvurularım', icon: <ClipboardList size={16} />, badge: pendingCount > 0 ? pendingCount : undefined },
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
  const [user, setUser] = useState<any>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favProducts, setFavProducts] = useState<any[]>([]);
  const [favListings, setFavListings] = useState<any[]>([]);
  const [favProductsFav, setFavProductsFav] = useState<any[]>([]);

  const [reviews, setReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

  // Settings form states
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
  const [notifications, setNotifications] = useState({
    notifyNewMessages: true,
    notifyApplications: true,
    notifyEmails: true,
    notifyCampaigns: true
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // XML Import
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlUploading, setXmlUploading] = useState(false);
  const [xmlResult, setXmlResult] = useState<{ success: boolean; imported?: number; failed?: number; message: string; errors?: string[] } | null>(null);

  // Gerçek veriden hesaplanan başvuru rozeti
  const pendingCount = myApplications.filter(a => !a.isSentByMe && a.status === 'pending').length;
  const tabs = TABS(pendingCount);

  // İlanlarım için arama ve sayfalama
  const [listingSearch, setListingSearch] = useState('');
  const [listingPage, setListingPage] = useState(1);
  const listingsPerPage = 5;

  const filteredListings = myListings.filter(l => {
    if (!listingSearch) return true;
    const term = listingSearch.toLowerCase();
    const safeId = String(l?.id || '');
    const shortId = safeId.split('-')[0].toLowerCase();
    return (l?.title || l?.name || '').toLowerCase().includes(term) || shortId.includes(term);
  });
  const totalPages = Math.max(1, Math.ceil(filteredListings.length / listingsPerPage));
  const currentListings = filteredListings.slice((listingPage - 1) * listingsPerPage, listingPage * listingsPerPage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as Tab;
      if (tabParam && ['ozet', 'siparisler', 'ilanlarim', 'favoriler', 'degerlendirmeler', 'kuponlar', 'basvurular', 'ayarlar'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data.profile);

          const parsePhotos = (raw: any): string[] => {
            if (!raw) return [];
            if (Array.isArray(raw)) return raw.filter(Boolean);
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) return parsed.filter(Boolean);
              // Double encoded: '["..."]' -> parse again
              if (typeof parsed === 'string') {
                const again = JSON.parse(parsed);
                if (Array.isArray(again)) return again.filter(Boolean);
              }
              return [];
            } catch { return []; }
          };

          const formattedListings = (data.profile.listings || []).map((l: any) => ({
            ...l,
            photos: parsePhotos(l.photos),
            animalType: l.animal
          }));
          setMyListings(formattedListings);

          const sent = (data.profile.applications || []).map((a: any) => ({ ...a, isSentByMe: true }));
          const received = (data.profile.receivedApplications || []).map((a: any) => ({ ...a, isSentByMe: false }));

          setMyApplications([...sent, ...received].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setMyOrders(data.profile.orders || []);
          setReviews(data.profile.reviews || []);
          setCoupons(data.profile.coupons || []);
          setFormData({
            firstName: data.profile.firstName || '',
            lastName: data.profile.lastName || '',
            email: data.profile.email || '',
            phone: data.profile.phone || ''
          });
          setNotifications({
            notifyNewMessages: data.profile.notifyNewMessages ?? true,
            notifyApplications: data.profile.notifyApplications ?? true,
            notifyEmails: data.profile.notifyEmails ?? true,
            notifyCampaigns: data.profile.notifyCampaigns ?? true
          });
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Favorileri çek (gerçek DB)
    fetch('/api/favorites')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setFavListings(d.listings || []);
          setFavProductsFav(d.products || []);
        }
      });

    fetch('/api/products').then(r => r.json()).then(d => {
      if (d.success) setFavProducts(d.products.slice(0, 4));
    });
  }, []);

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUser(data.user);
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error('Bir hata oluştu');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passData.newPassword !== passData.newPasswordConfirm) {
      return toast.error('Yeni şifreler eşleşmiyor!');
    }
    setIsUpdatingPass(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passData.currentPassword, newPassword: passData.newPassword })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setPassData({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error('Bir hata oluştu');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleUpdateNotifications = async (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Bildirim tercihleri güncellendi');
      } else {
        toast.error('Bildirim ayarı kaydedilemedi');
      }
    } catch (e) {
      toast.error('Bağlantı hatası');
    }
  };

  const handleXmlImport = async () => {
    if (!xmlFile) return toast.error('Lütfen bir XML dosyası seçin');
    setXmlUploading(true);
    setXmlResult(null);
    try {
      const formData = new FormData();
      formData.append('file', xmlFile);
      const res = await fetch('/api/products/xml-import', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setXmlResult({ success: true, imported: data.imported, failed: data.failed, message: data.message, errors: data.errors });
        toast.success(data.message);
        setXmlFile(null);
      } else {
        setXmlResult({ success: false, message: data.error || 'Bilinmeyen hata' });
        toast.error(data.error || 'İçe aktarma başarısız');
      }
    } catch (e) {
      toast.error('Bağlantı hatası');
    } finally {
      setXmlUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-10 h-10 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userInfo = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone || '-',
    city: user.city || '-',
    avatar: user.avatar || user.firstName.charAt(0),
    since: new Date(user.createdAt).getFullYear().toString()
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pt-28 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── SOL PANEL ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-4 sticky top-28 shadow-sm">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center pb-5 border-b border-[var(--border)] mb-3">
                <div className="w-20 h-20 rounded-full gradient-brand text-white flex items-center justify-center text-3xl font-bold mb-3 shadow-md">
                  {userInfo.avatar}
                </div>
                <h2 className="font-bold text-base">{userInfo.name}</h2>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 font-semibold">
                  <ShieldCheck size={12} /> Doğrulanmış Hesap
                </div>
                <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{userInfo.since}'den beri üye</div>
              </div>

              <nav className="flex flex-col gap-0.5">
                {tabs.map(tab => (
                  <div key={tab.id}>
                    <button onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === tab.id
                          ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                          : 'text-[var(--foreground-muted)] hover:bg-gray-50 hover:text-[var(--foreground)]'
                        }`}>
                      {tab.icon}
                      <span className="flex-1 text-left">{tab.label}</span>
                      {tab.badge && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
                      {activeTab !== tab.id && <ChevronRight size={14} className="opacity-30" />}
                    </button>
                    {/* İlanlarım sekmesinin altına Mağaza Aç (Ürünler) butonu ekleniyor */}
                    {tab.id === 'ilanlarim' && (!user.accountType || (user.accountType?.toLowerCase() !== 'profesyonel' && user.accountType?.toLowerCase() !== 'barinak')) && (
                      <Link href="/magaza-ac" className="block mt-1 mb-1 ml-4 border-l-2 border-orange-200 pl-2">
                        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors">
                          <Store size={15} /> Ürün Satışı Yap
                        </button>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <Link href="/ilan-ver" className="block mb-2">
                  <button className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] transition-colors shadow-sm">
                    <Plus size={16} /> Yeni İlan Ver
                  </button>
                </Link>
              </div>

              <div className="mt-2">
                <button onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/login';
                }}
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
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-xl font-bold">Hesabım</h1>
                  <Link href="/ilan-ver" className="sm:hidden">
                    <Button variant="gradient" size="sm" leftIcon={<Plus size={14} />}>İlan Ver</Button>
                  </Link>
                </div>

                {user.accountType === 'profesyonel' && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4">
                    <div>
                      <h3 className="font-bold text-indigo-900 mb-1 text-lg flex items-center flex-wrap gap-2">
                        Profesyonel Hizmet İlanı
                        {user.subscriptionEndsAt && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                            Geçerlilik: {new Date(user.subscriptionEndsAt).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-indigo-700">Veteriner, eğitmen veya kuaför hizmetlerinizi platformda binlerce kişiye ulaştırın.</p>
                    </div>
                    <Link href="/hizmet-ilani-ver">
                      <Button variant="gradient" className="whitespace-nowrap shadow-md">Hizmet İlanı Ver</Button>
                    </Link>
                  </div>
                )}

                {(!user.accountType || user.accountType.toLowerCase() === 'bireysel') && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4">
                    <div>
                      <h3 className="font-bold text-emerald-900 mb-1 text-lg flex items-center flex-wrap gap-2">
                        <Sparkles size={20} className="text-emerald-500" /> Profesyonel Üyeliğe Yükselt
                      </h3>
                      <p className="text-sm text-emerald-700">Veteriner, eğitmen veya kuaför hizmetlerinizi platformumuzda binlerce kişiye ulaştırın.</p>
                    </div>
                    <Link href="/abonelik-odeme?services=veteriner&cycle=monthly">
                      <Button variant="gradient" className="whitespace-nowrap shadow-md bg-gradient-to-r from-emerald-500 to-teal-600">Hemen Yükselt</Button>
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: <Package size={20} />, label: 'Siparişlerim', val: myOrders.length, color: 'bg-blue-50 text-blue-600', tab: 'siparisler' as Tab },
                    { icon: <List size={20} />, label: 'İlanlarım', val: myListings.length, color: 'bg-orange-50 text-orange-600', tab: 'ilanlarim' as Tab },
                    { icon: <ClipboardList size={20} />, label: 'Başvurularım', val: myApplications.length, color: 'bg-emerald-50 text-emerald-600', tab: 'basvurular' as Tab },
                    { icon: <Tag size={20} />, label: 'Kuponlarım', val: coupons.length, color: 'bg-purple-50 text-purple-600', tab: 'kuponlar' as Tab },
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
                    {[['Ad Soyad', userInfo.name], ['E-posta', userInfo.email], ['Telefon', userInfo.phone], ['Konum', userInfo.city]].map(([k, v]) => (
                      <div key={k}><div className="text-xs text-[var(--foreground-muted)] mb-0.5">{k}</div><div className="font-semibold">{v as string}</div></div>
                    ))}
                  </div>
                </Card>

                {/* XML YÜKLEME — sadece profesyonel/barinaklar için */}
                {(user.accountType?.toLowerCase() === 'profesyonel' || user.accountType?.toLowerCase() === 'barinak') && (
                  <div className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <FileUp size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">XML ile Toplu Ürün Yükle</h3>
                        <p className="text-xs text-[var(--foreground-muted)]">Ürün listenizi XML formatında mağazanıza aktarın</p>
                      </div>
                    </div>

                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        xmlFile ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-[var(--brand-primary)] hover:bg-orange-50'
                      }`}
                      onClick={() => document.getElementById('xml-file-input')?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const f = e.dataTransfer.files[0];
                        if (f && f.name.endsWith('.xml')) { setXmlFile(f); setXmlResult(null); }
                        else toast.error('Lütfen .xml uzantılı dosya seçin');
                      }}
                    >
                      <input
                        id="xml-file-input"
                        type="file"
                        accept=".xml,text/xml,application/xml"
                        className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) { setXmlFile(f); setXmlResult(null); }
                        }}
                      />
                      {xmlFile ? (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <FileUp size={20} />
                          <span className="font-semibold text-sm">{xmlFile.name}</span>
                          <span className="text-xs text-gray-400">({(xmlFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      ) : (
                        <div className="text-[var(--foreground-muted)]">
                          <Upload size={28} className="mx-auto mb-2 opacity-40" />
                          <p className="text-sm font-medium">XML dosyasını buraya sürükle veya tıkla</p>
                          <p className="text-xs mt-1 opacity-60">Her ürün &lt;product&gt; etiketi içinde olmalı</p>
                        </div>
                      )}
                    </div>

                    {/* Sonuç */}
                    {xmlResult && (
                      <div className={`mt-3 p-3 rounded-xl text-sm flex items-start gap-2 ${
                        xmlResult.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        {xmlResult.success
                          ? <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                          : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-semibold">{xmlResult.message}</p>
                          {xmlResult.errors && xmlResult.errors.length > 0 && (
                            <ul className="mt-1 text-xs opacity-80 list-disc list-inside">
                              {xmlResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 gap-3">
                      <details className="flex-1">
                        <summary className="text-xs text-[var(--foreground-muted)] cursor-pointer hover:text-[var(--foreground)] select-none">📄 XML format örneği</summary>
                        <pre className="mt-2 text-[10px] bg-gray-50 p-3 rounded-lg border overflow-x-auto text-gray-600">{`<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <name>Mama Kabı</name>
    <price>49.90</price>
    <stock>100</stock>
    <brand>PetBrand</brand>
    <category>Mama Kabları</category>
    <description>Paslanmaz çelik mama kabı</description>
    <image>https://example.com/resim.jpg</image>
  </product>
</products>`}</pre>
                      </details>
                      <button
                        onClick={handleXmlImport}
                        disabled={!xmlFile || xmlUploading}
                        className="flex items-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
                      >
                        {xmlUploading ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Yükleniyor...</>
                        ) : (
                          <><Upload size={16} /> Yükle</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Son Sipariş */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold">Son Siparişlerim</h2>
                    <button onClick={() => setActiveTab('siparisler')} className="text-xs text-[var(--brand-primary)] font-semibold hover:underline">Tümünü Gör</button>
                  </div>
                  <div className="space-y-3">
                    {myOrders.slice(0, 2).map(o => (
                      <div key={o.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <img src={o.items[0]?.product?.image} alt={o.items[0]?.product?.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{o.items[0]?.product?.name} {o.items.length > 1 ? `ve ${o.items.length - 1} ürün daha` : ''}</div>
                          <div className="text-xs text-[var(--foreground-muted)]">{new Date(o.createdAt).toLocaleDateString('tr-TR')}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusMap[o.status]?.color || 'bg-gray-100 text-gray-700'}`}>{statusMap[o.status]?.label || o.status}</span>
                      </div>
                    ))}
                    {myOrders.length === 0 && <div className="text-sm text-[var(--foreground-muted)] text-center py-4">Son siparişiniz bulunmuyor.</div>}
                  </div>
                </Card>
              </div>
            )}

            {/* SİPARİŞLER */}
            {activeTab === 'siparisler' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Siparişlerim</h1>
                {myOrders.map(o => (
                  <div key={o.id} className="bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
                      <div className="text-xs text-[var(--foreground-muted)]">Sipariş No: <span className="font-bold text-[var(--foreground)]">{o.id.slice(0, 8).toUpperCase()}</span></div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusMap[o.status]?.color || 'bg-gray-100 text-gray-700'}`}>{statusMap[o.status]?.label || o.status}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {o.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img src={item.product?.image} alt={item.product?.name} className="w-16 h-16 rounded-xl object-cover border border-[var(--border)]" />
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{item.product?.name}</div>
                            <div className="text-xs text-[var(--foreground-muted)] mt-0.5">{item.quantity} Adet</div>
                          </div>
                          <div className="text-base font-bold text-emerald-600">₺{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center">
                      <div className="text-sm text-[var(--foreground-muted)]">{new Date(o.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div className="text-lg font-bold">Toplam: ₺{o.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                {myOrders.length === 0 && (
                  <div className="text-sm text-[var(--foreground-muted)] text-center py-10 bg-white border border-[var(--border)] rounded-2xl">Henüz siparişiniz bulunmuyor.</div>
                )}
              </div>
            )}

            {/* İLANLARIM */}
            {activeTab === 'ilanlarim' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-xl font-bold">İlanlarım</h1>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="İlan No veya Başlık Ara..."
                        value={listingSearch}
                        onChange={e => { setListingSearch(e.target.value); setListingPage(1); }}
                        className="pl-9 pr-4 py-1.5 border rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                    <Link href="/ilan-ver"><Button size="sm" variant="gradient" leftIcon={<Plus size={14} />}>Yeni İlan</Button></Link>
                  </div>
                </div>

                {filteredListings.length === 0 && (
                  <div className="text-sm text-[var(--foreground-muted)] text-center py-10 bg-white border border-[var(--border)] rounded-2xl">
                    {listingSearch ? 'Aramanıza uygun ilan bulunamadı.' : 'Henüz ilanınız bulunmuyor.'}
                  </div>
                )}

                {currentListings.map(listing => {
                  const photos = listing.photos && listing.photos.length > 0 ? listing.photos : [];
                  const coverPhoto = photos[0];
                  // ID formatı (ilk 8 hane)
                  const safeId = String(listing?.id || '');
                  const shortId = safeId ? `#${safeId.split('-')[0].toUpperCase()}` : '#BİLİNMİYOR';

                  return (
                    <Card key={listing.id} className="p-4 flex flex-col sm:flex-row items-center gap-4">
                      {/* Görsel */}
                      <div className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                        {coverPhoto ? (
                          <img
                            src={coverPhoto}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                (e.target as HTMLImageElement).style.display = 'none';
                                parent.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;background:linear-gradient(135deg,#fed7aa,#fde68a)">🐾</div>';
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${listing.imageColor || 'from-orange-100 to-orange-200'} flex items-center justify-center text-3xl`}>
                            {listing.emoji || '🐾'}
                          </div>
                        )}
                      </div>

                      {/* Detay */}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            (listing.status === 'active' || listing.status === 'approved') ? 'bg-green-100 text-green-700' :
                            listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            listing.status === 'passive' ? 'bg-gray-100 text-gray-500' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {(listing.status === 'active' || listing.status === 'approved') ? 'Aktif' : listing.status === 'pending' ? 'Onay Bekliyor' : listing.status === 'passive' ? 'Pasif' : listing.status || 'Aktif'}
                          </span>
                          <span className="text-xs font-mono font-bold text-[var(--brand-primary)] bg-orange-50 px-1.5 py-0.5 rounded">
                            {shortId}
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)]">
                            {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <h3 className="font-bold">{listing.title || listing.name} {listing.breed ? `- ${listing.breed}` : ''}</h3>
                        <div className="text-sm text-[var(--foreground-muted)]">{listing.city} {listing.district ? `/${listing.district}` : ''}</div>
                      </div>

                      {/* Butonlar */}
                      <div className="flex gap-2 items-center flex-wrap justify-center sm:justify-end mt-3 sm:mt-0">
                        {listing.status === 'passive' && (
                          <Button 
                            size="sm" 
                            variant="gradient" 
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/listings/${listing.id}/reactivate`, { method: 'POST' });
                                const data = await res.json();
                                if (data.success) {
                                  toast.success(data.message);
                                  window.location.reload();
                                } else {
                                  toast.error(data.error || 'İşlem başarısız oldu');
                                }
                              } catch (e) {
                                toast.error('İşlem başarısız oldu');
                              }
                            }}
                          >
                            Tekrar Aktif Et
                          </Button>
                        )}
                        <Link href={`/ilan/${listing.id}`}>
                          <Button size="sm" variant="outline" leftIcon={<Eye size={14} />}>Görüntüle</Button>
                        </Link>
                        <Link href={`/ilan-duzenle/${listing.id}`}><Button size="sm" variant="outline" leftIcon={<Edit size={14} />}>Düzenle</Button></Link>
                        <Button size="sm" variant="outline" className="px-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></Button>
                      </div>
                    </Card>
                  );
                })}

                {/* Sayfalama */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => setListingPage(p => Math.max(1, p - 1))}
                      disabled={listingPage === 1}
                      className="p-1 rounded bg-gray-100 disabled:opacity-50"
                    >
                      &lt;
                    </button>
                    <span className="text-sm font-bold mx-2">
                      Sayfa {listingPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setListingPage(p => Math.min(totalPages, p + 1))}
                      disabled={listingPage === totalPages}
                      className="p-1 rounded bg-gray-100 disabled:opacity-50"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'basvurular' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Gelen/Giden Başvurular</h1>
                {myApplications.map(app => (
                  <Card key={app.id} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {app.status === 'pending' ? 'Beklemede' : app.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)]">{new Date(app.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <h3 className="font-bold">
                          {app.isSentByMe ? 'Benim Başvurum' : `${app.applicant?.firstName} ${app.applicant?.lastName} Başvurusu`}
                          <span className="font-normal text-sm text-[var(--foreground-muted)]"> → {app.listing?.name || 'Bilinmeyen İlan'}</span>
                        </h3>
                        <p className="text-sm mt-2 bg-gray-50 p-2 rounded-lg whitespace-pre-line">{app.message}</p>
                      </div>
                      {app.status === 'pending' && !app.isSentByMe && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="gradient" leftIcon={<Check size={13} />} onClick={async () => {
                            await fetch(`/api/applications/${app.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) });
                            window.location.reload();
                          }}>Onayla</Button>
                          <Button size="sm" variant="outline" leftIcon={<X size={13} />} className="text-red-500" onClick={async () => {
                            await fetch(`/api/applications/${app.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) });
                            window.location.reload();
                          }}>Reddet</Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                {myApplications.length === 0 && (
                  <div className="text-sm text-[var(--foreground-muted)] text-center py-10 bg-white border border-[var(--border)] rounded-2xl">Henüz başvuru bulunmuyor.</div>
                )}
              </div>
            )}

            {/* BEĞENDiKLERiM — Gerçek DB */}
            {activeTab === 'favoriler' && (
              <div className="space-y-6">
                <h1 className="text-xl font-bold">Beğendiklerim</h1>

                {/* Favori İlanlar */}
                <div>
                  <h2 className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
                    🐾 İlanlar ({favListings.length})
                  </h2>
                  {favListings.length === 0 ? (
                    <div className="text-sm text-[var(--foreground-muted)] text-center py-6 bg-white border border-[var(--border)] rounded-2xl">
                      Henüz favori ilanınız yok. İlan detay sayfasındaki ❤ butonuna basın!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favListings.map((l: any) => (
                        <div key={l.id} className="h-full">
                          <ListingCard listing={l} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Favori Ürünler */}
                <div>
                  <h2 className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
                    🛒 Mağaza Ürünleri ({favProductsFav.length})
                  </h2>
                  {favProductsFav.length === 0 ? (
                    <div className="text-sm text-[var(--foreground-muted)] text-center py-6 bg-white border border-[var(--border)] rounded-2xl">
                      Henüz favori ürününüz yok. Mağazada ürünlerin yanındaki ❤ butonuna basın!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {favProductsFav.map((p: any) => <ProductCard key={p.id} product={p} size="small" />)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DEĞERLENDİRMELERİM */}
            {activeTab === 'degerlendirmeler' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Değerlendirmelerim</h1>
                {reviews.length === 0 ? (
                  <div className="text-sm text-[var(--foreground-muted)] text-center py-10 bg-white border border-[var(--border)] rounded-2xl">Henüz bir değerlendirme yapmadınız.</div>
                ) : (
                  reviews.map((r: any) => (
                    <div key={r.id} className="p-4 bg-white border border-[var(--border)] rounded-2xl shadow-sm flex items-start gap-4">
                      {r.product?.image && <img src={r.product.image} className="w-16 h-16 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">{r.product?.name || 'Ürün'}</div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className={i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'} />)}
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)]">{r.text}</p>
                      </div>
                      <div className="text-xs text-[var(--foreground-muted)]">{new Date(r.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* KUPONLAR */}
            {activeTab === 'kuponlar' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">Kuponlarım</h1>
                {coupons.length === 0 ? (
                  <div className="text-sm text-[var(--foreground-muted)] text-center py-10 bg-white border border-[var(--border)] rounded-2xl">Geçerli bir kupon bulunamadı.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {coupons.map((c: any) => (
                      <div key={c.id} className={`p-5 rounded-2xl border ${c.isUsed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'} relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 rounded-bl-full -mr-8 -mt-8" />
                        <div className="font-bold text-2xl text-purple-700 mb-1">{c.type === 'percentage' ? `%${c.discount}` : `₺${c.discount}`} İndirim</div>
                        <div className="text-sm font-semibold text-purple-900 bg-white/60 px-3 py-1 rounded-md inline-block mb-3 border border-purple-200/50">{c.code}</div>
                        <div className="flex items-center justify-between text-xs text-purple-600">
                          <span>{c.isUsed ? 'Kullanıldı' : `Son Kullanma: ${new Date(c.validUntil).toLocaleDateString('tr-TR')}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AYARLAR */}
            {activeTab === 'ayarlar' && (
              <div className="space-y-5">
                <h1 className="text-xl font-bold">Kullanıcı Bilgilerim</h1>
                <Card className="p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2"><Edit size={16} /> Kişisel Bilgiler</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Ad" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    <Input label="Soyad" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    <Input label="E-posta" type="email" value={formData.email} disabled className="opacity-60 bg-gray-50" title="Güvenlik nedeniyle e-posta adresi buradan değiştirilemez." />
                    <Input label="Telefon" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <Button variant="gradient" size="sm" className="mt-4" onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </Card>
                <Card className="p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2"><Lock size={16} /> Şifre Değiştir</h2>
                  <div className="flex flex-col gap-3 max-w-md">
                    <Input label="Mevcut Şifre" type="password" placeholder="••••••••" value={passData.currentPassword} onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })} />
                    <Input label="Yeni Şifre" type="password" placeholder="En az 6 karakter" value={passData.newPassword} onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} />
                    <Input label="Yeni Şifre Tekrar" type="password" placeholder="••••••••" value={passData.newPasswordConfirm} onChange={(e) => setPassData({ ...passData, newPasswordConfirm: e.target.value })} />
                  </div>
                  <Button variant="gradient" size="sm" className="mt-4" onClick={handleUpdatePassword} disabled={isUpdatingPass}>
                    {isUpdatingPass ? 'Güncelleniyor...' : 'Güncelle'}
                  </Button>
                </Card>
                <Card className="p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2"><Bell size={16} /> Bildirim Tercihleri</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'notifyNewMessages', label: 'Yeni mesaj bildirimleri' },
                      { key: 'notifyApplications', label: 'Başvuru bildirimleri' },
                      { key: 'notifyEmails', label: 'E-posta bildirimleri' },
                      { key: 'notifyCampaigns', label: 'Kampanya bildirimleri' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => handleUpdateNotifications(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
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
