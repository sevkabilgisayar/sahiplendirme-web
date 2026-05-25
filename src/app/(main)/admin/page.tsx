'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Users, Image as ImageIcon, CheckCircle, XCircle, Search, Filter, X, LayoutDashboard, Menu } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import GhostListingTab from '@/components/admin/GhostListingTab';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminFinanceTab from '@/components/admin/AdminFinanceTab';
import AdminAllListingsTab from '@/components/admin/AdminAllListingsTab';
import Modal from '@/components/ui/Modal';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all-listings' | 'listings' | 'reports' | 'orders' | 'users' | 'ads' | 'packages' | 'logs' | 'ghost-listing' | 'blogs' | 'settings'>('listings');
  const [listings, setListings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [reportsTab, setReportsTab] = useState<'open' | 'resolved'>('open');
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBannerForStats, setSelectedBannerForStats] = useState<any>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<{ id: string | null; name: string; price: string }>({ id: null, name: '', price: '' });
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', imageUrl: '', linkUrl: '', position: 'home_middle', duration: '30' });
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  


  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/');
          return;
        }
        const authData = await authRes.json();
        if (authData.user?.role !== 'admin' && authData.user?.accountType !== 'ADMIN') {
          // Normal kullanıcıysa anasayfaya at
          router.push('/');
          return;
        }

        const [resListings, resReports, resOrders, resUsers, resLogs, resBanners, resPackages, resBlogs, resSettings] = await Promise.all([
          fetch('/api/admin/listings'),
          fetch('/api/admin/reports'),
          fetch('/api/admin/orders'),
          fetch('/api/admin/users'),
          fetch('/api/admin/logs'),
          fetch('/api/admin/banners'),
          fetch('/api/admin/packages'),
          fetch('/api/admin/blogs'),
          fetch('/api/admin/settings')
        ]);
        
        if (resListings.ok) setListings((await resListings.json()).pendingListings || []);
        if (resReports.ok) setReports((await resReports.json()).reports || []);
        if (resOrders.ok) setOrders((await resOrders.json()).orders || []);
        if (resUsers.ok) setUsers((await resUsers.json()).users || []);
        if (resLogs.ok) setLogs((await resLogs.json()).logs || []);
        if (resBanners.ok) setBanners((await resBanners.json()).banners || []);
        if (resPackages.ok) setPackages((await resPackages.json()).packages || []);
        if (resBlogs.ok) setBlogs((await resBlogs.json()).blogs || []);
        if (resSettings.ok) setSettings((await resSettings.json()).settings || {});
      } catch (error) {
        console.error(error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [router]);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/admin/listings/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) });
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {}
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/admin/listings/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) });
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {}
  };

  const handleResolveReport = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (error) {
      alert('İşlem başarısız');
    }
  };

  const handleBanUser = async (userId: string, userName: string) => {
    const reason = window.prompt(`${userName} kullanıcısını engellemek için sebep girin:`, 'Kurallara aykırı davranış');
    if (reason) {
      try {
        await fetch(`/api/admin/users/${userId}`, { method: 'PATCH', body: JSON.stringify({ reason, action: 'ban' }) });
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: true } : u));
        alert('Kullanıcı başarıyla engellendi.');
      } catch (e) {}
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, { method: 'PATCH', body: JSON.stringify({ action: 'approve' }) });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
      alert('Kullanıcı hesabı başarıyla onaylandı.');
    } catch (e) {}
  };

  const handleRefund = async (orderId: string) => {
    if (window.confirm('Bu siparişi iptal edip ücret iadesi yapmak istediğinize emin misiniz?')) {
      try {
        await fetch(`/api/admin/orders/${orderId}/refund`, { method: 'POST' });
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'iptal_edildi' } : o));
        alert('Sipariş iptal edildi ve Param POS iade süreci başlatıldı.');
      } catch (e) {}
    }
  };

  const handleAddBanner = async () => {
    setIsBannerModalOpen(true);
  };

  const submitNewBanner = async () => {
    if (!newBanner.title || !newBanner.imageUrl) {
      alert('Lütfen başlık ve görsel URL girin.');
      return;
    }
    const days = parseInt(newBanner.duration || '30', 10);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    try {
      const res = await fetch('/api/admin/banners', { 
        method: 'POST', 
        body: JSON.stringify({ 
          title: newBanner.title, 
          imageUrl: newBanner.imageUrl, 
          linkUrl: newBanner.linkUrl, 
          position: newBanner.position, 
          endDate: endDate.toISOString() 
        }) 
      });
      if (res.ok) {
        const data = await res.json();
        setBanners([data.banner, ...banners]);
        alert('Banner eklendi!');
        setIsBannerModalOpen(false);
        setNewBanner({ title: '', imageUrl: '', linkUrl: '', position: 'home_middle', duration: '30' });
      }
    } catch (e) {}
  };

  const handleRemoveBanner = async (id: string) => {
    if (window.confirm('Bu reklamı silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setBanners(prev => prev.filter(b => b.id !== id));
        }
      } catch (error) {}
    }
  };

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingBanner(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('skipWatermark', 'true');
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setNewBanner({...newBanner, imageUrl: data.urls[0]});
      } else {
        alert('Görsel yüklenemedi.');
      }
    } catch (err) {
      alert('Yükleme sırasında hata.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleAddPackage = () => {
    setEditingPackage({ id: null, name: '', price: '' });
    setIsPackageModalOpen(true);
  };

  const handleEditPackage = (id: string, currentPrice: number, currentName: string) => {
    setEditingPackage({ id, name: currentName, price: currentPrice.toString() });
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage.name || !editingPackage.price) {
      alert('Lütfen ad ve fiyat girin.');
      return;
    }
    
    try {
      if (editingPackage.id) {
        // Düzenleme
        const res = await fetch(`/api/admin/packages/${editingPackage.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify({ price: parseFloat(editingPackage.price), name: editingPackage.name }) 
        });
        if (res.ok) {
          setPackages(prev => prev.map(p => p.id === editingPackage.id ? { ...p, price: parseFloat(editingPackage.price), name: editingPackage.name } : p));
          setIsPackageModalOpen(false);
        }
      } else {
        // Ekleme
        const res = await fetch('/api/admin/packages', { 
          method: 'POST', 
          body: JSON.stringify({ name: editingPackage.name, price: parseFloat(editingPackage.price), features: ['Yeni Özellik 1', 'Yeni Özellik 2'] }) 
        });
        if (res.ok) {
          const data = await res.json();
          setPackages([...packages, data.package]);
          setIsPackageModalOpen(false);
        }
      }
    } catch (error) {
      alert('Bir hata oluştu.');
    }
  };

  const handleRemovePackage = async (id: string) => {
    if (window.confirm('Bu paketi silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setPackages(prev => prev.filter(p => p.id !== id));
        }
      } catch (e) {}
    }
  };



  const handleCreateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      content: formData.get('content'),
      imageUrl: formData.get('imageUrl'),
      category: formData.get('category'),
      tags: formData.get('tags'),
    };
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert('Blog başarıyla eklendi!');
        e.currentTarget.reset();
        const r = await fetch('/api/admin/blogs');
        if (r.ok) setBlogs((await r.json()).blogs || []);
      }
    } catch (error) {
      alert('Hata oluştu');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">Yükleniyor...</div>;
  }

  const counts = {
    listings: listings.length,
    orders: orders.length,
    users: users.length,
    reports: reports.length
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobil Menü Butonu (Gizli varsayılan) */}
        <div className="md:hidden flex items-center mb-4 gap-2 text-gray-800">
          <Menu size={24} /> <span className="font-bold">Admin Menüsü</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sol Sidebar (Desktop) */}
          <div className="hidden md:block">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
          </div>

          {/* Sağ İçerik Alanı */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[calc(100vh-6rem)]">
            
            {activeTab === 'finance' && <AdminFinanceTab orders={orders} />}

            {activeTab !== 'all-listings' && activeTab !== 'finance' && activeTab !== 'settings' && activeTab !== 'ghost-listing' && activeTab !== 'blogs' && activeTab !== 'packages' && activeTab !== 'ads' && activeTab !== 'logs' && (
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <input type="text" placeholder="Tabloda ara..." className="w-full h-10 pl-9 pr-4 rounded-xl border border-[var(--border)] bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
                </div>
                <Button variant="outline" leftIcon={<Filter size={16} />} className="hidden sm:flex">Filtrele</Button>
              </div>
            )}

          {activeTab === 'all-listings' && <AdminAllListingsTab />}

          {activeTab === 'listings' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)]">
                    <th className="pb-3 font-medium">Kullanıcı</th>
                    <th className="pb-3 font-medium">Tür / Başlık</th>
                    <th className="pb-3 font-medium">Tarih</th>
                    <th className="pb-3 font-medium text-center">AI Skoru</th>
                    <th className="pb-3 font-medium text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {listings.map(l => (
                    <tr key={l.id} className="hover:bg-[var(--surface-secondary)] transition-colors">
                      <td className="py-3 font-semibold">{l.user?.firstName} {l.user?.lastName}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0 border border-[var(--border)]">
                            {(() => {
                              try {
                                const photos = l.photos ? JSON.parse(l.photos) : [];
                                if (photos && photos.length > 0) {
                                  return <img src={photos[0]} alt={l.title} className="w-full h-full object-cover" />;
                                }
                              } catch (e) {}
                              return <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">Yok</div>;
                            })()}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${l.type === 'kayip' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{l.type}</span>
                            </div>
                            <span className="font-medium text-sm truncate max-w-[250px]" title={l.title}>{l.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-[var(--foreground-muted)]">{new Date(l.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${l.aiScore > 80 ? 'bg-green-100 text-green-700' : l.aiScore > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {l.aiScore}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-[var(--border)]" title="Görüntüle"><ImageIcon size={14} /></Button>
                          <Button variant="outline" size="sm" className="w-8 h-8 p-0 text-green-600 hover:bg-green-50 border-green-200" title="Onayla" onClick={() => handleApprove(l.id)}><CheckCircle size={14} /></Button>
                          <Button variant="outline" size="sm" className="w-8 h-8 p-0 text-red-600 hover:bg-red-50 border-red-200" title="Reddet" onClick={() => handleReject(l.id)}><XCircle size={14} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {listings.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-[var(--foreground-muted)]">Bekleyen ilan kalmadı 🎉</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button variant={reportsTab === 'open' ? 'gradient' : 'outline'} onClick={() => setReportsTab('open')} size="sm">
                  Çözüm Bekleyenler ({reports.filter(r => r.status === 'open').length})
                </Button>
                <Button variant={reportsTab === 'resolved' ? 'gradient' : 'outline'} onClick={() => setReportsTab('resolved')} size="sm">
                  Çözülenler ({reports.filter(r => r.status === 'resolved').length})
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)]">
                      <th className="pb-3 font-medium">Şikayet Eden</th>
                      <th className="pb-3 font-medium">İlan Başlığı & No</th>
                      <th className="pb-3 font-medium">Sebep</th>
                      <th className="pb-3 font-medium">Detay</th>
                      <th className="pb-3 font-medium">Tarih</th>
                      <th className="pb-3 font-medium text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {reports.filter(r => r.status === reportsTab).map(r => (
                      <tr key={r.id} className="hover:bg-[var(--surface-secondary)] transition-colors">
                        <td className="py-3 font-semibold">{r.reporter?.firstName} {r.reporter?.lastName}</td>
                        <td className="py-3">
                          <div className="flex flex-col">
                            <a href={`/ilan/${r.listingId}`} className="text-[var(--brand-primary)] hover:underline truncate inline-block max-w-[200px]" title={r.listing?.title}>
                              {r.listing?.title || 'Bilinmeyen İlan'}
                            </a>
                            <span className="text-[10px] font-mono text-[var(--foreground-muted)] mt-0.5">#{r.listingId.split('-')[0]}</span>
                          </div>
                        </td>
                        <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{r.reason}</span></td>
                        <td className="py-3 text-[var(--foreground-muted)] truncate max-w-xs">{r.detail}</td>
                        <td className="py-3 text-[var(--foreground-muted)]">{new Date(r.createdAt).toLocaleDateString('tr-TR')}</td>
                        <td className="py-3 text-right">
                          {r.status === 'open' ? (
                            <Button variant="outline" size="sm" className="text-green-600 hover:bg-green-50 border-green-200" onClick={() => handleResolveReport(r.id, r.status)}>Çözüldü İşaretle</Button>
                          ) : (
                            <Button variant="outline" size="sm" className="text-orange-600 hover:bg-orange-50 border-orange-200" onClick={() => handleResolveReport(r.id, r.status)}>Geri Al</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {reports.filter(r => r.status === reportsTab).length === 0 && (
                      <tr><td colSpan={6} className="py-8 text-center text-[var(--foreground-muted)]">{reportsTab === 'open' ? 'Açık şikayet bulunmuyor 🎉' : 'Çözülen şikayet yok.'}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)]">
                    <th className="pb-3 font-medium">Müşteri</th>
                    <th className="pb-3 font-medium">Sipariş İçeriği</th>
                    <th className="pb-3 font-medium">Tutar</th>
                    <th className="pb-3 font-medium">Durum</th>
                    <th className="pb-3 font-medium">Tarih</th>
                    <th className="pb-3 font-medium text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-[var(--surface-secondary)] transition-colors">
                      <td className="py-3 font-semibold">{o.user?.firstName} {o.user?.lastName}</td>
                      <td className="py-3 truncate max-w-xs text-[var(--foreground-muted)]">
                        {o.items?.map((i:any) => `${i.quantity}x ${i.product?.name}`).join(', ')}
                      </td>
                      <td className="py-3 font-bold text-emerald-600">₺{o.totalAmount}</td>
                      <td className="py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          o.status === 'hazirlaniyor' ? 'bg-orange-100 text-orange-700' :
                          o.status === 'kargoda' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>{o.status.toUpperCase()}</span>
                      </td>
                      <td className="py-3 text-[var(--foreground-muted)]">{new Date(o.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleRefund(o.id)}>İptal / İade</Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">Güncelle</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-[var(--foreground-muted)]">Hiç sipariş bulunamadı.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)]">
                    <th className="pb-3 font-medium">Ad Soyad</th>
                    <th className="pb-3 font-medium">E-posta</th>
                    <th className="pb-3 font-medium">Hesap Tipi</th>
                    <th className="pb-3 font-medium text-center">İlan / Sipariş</th>
                    <th className="pb-3 font-medium">Kayıt Tarihi</th>
                    <th className="pb-3 font-medium text-right">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-[var(--surface-secondary)] transition-colors">
                      <td className="py-3 font-semibold">{u.firstName} {u.lastName}</td>
                      <td className="py-3 text-[var(--foreground-muted)]">{u.email}</td>
                      <td className="py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          u.accountType === 'profesyonel' ? 'bg-purple-100 text-purple-700' :
                          u.accountType === 'barinak' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'
                        }`}>{u.accountType.toUpperCase()}</span>
                      </td>
                      <td className="py-3 text-center text-xs font-medium">
                        <span className="text-blue-600 mr-2">{u._count?.listings || 0} İlan</span>
                        <span className="text-emerald-600">{u._count?.orders || 0} Sipariş</span>
                      </td>
                      <td className="py-3 text-[var(--foreground-muted)]">{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {u.status === 'pending' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded border border-amber-500 text-amber-600 bg-amber-50">ONAY BEKLİYOR</span>
                          ) : (
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${u.role === 'admin' ? 'border-red-500 text-red-600' : 'border-gray-300 text-gray-500'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          )}
                          
                          {u.status === 'pending' && (
                            <Button variant="outline" size="sm" className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApproveUser(u.id)}>Onayla</Button>
                          )}
                          {!u.isBanned ? (
                            <Button variant="outline" size="sm" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleBanUser(u.id, u.firstName)}>Banla</Button>
                          ) : (
                            <span className="text-xs font-bold text-red-600">ENGELLİ</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-[var(--foreground-muted)]">Kullanıcı bulunamadı.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Reklam (Banner) Yönetimi</h3>
                <Button variant="gradient" size="sm" onClick={handleAddBanner}>Yeni Reklam Ekle</Button>
              </div>
              
              {banners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map((banner) => (
                    <div key={banner.id} className="border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm relative">
                      <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                        <div className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold rounded ${banner.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                          {banner.isActive ? 'AKTİF' : 'PASİF'}
                        </div>
                      </div>
                      <div className="p-4 bg-white flex justify-between items-center">
                        <div>
                          <h4 className="font-bold">{banner.title}</h4>
                          <p className="text-xs text-[var(--foreground-muted)] mt-1">
                            <span className="font-semibold text-emerald-600">{banner.stats?.reduce((a:any,b:any) => a + b.impressions, 0) || 0} Gösterim</span> • <span className="font-semibold text-blue-600">{banner.clicks} Tıklama</span>
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-1">
                            {new Date(banner.createdAt).toLocaleDateString('tr-TR')} • Konum: {banner.position}
                          </p>
                          {banner.endDate && (
                            <p className="text-[10px] text-orange-600 font-semibold mt-1">
                              Bitiş: {new Date(banner.endDate).toLocaleDateString('tr-TR')}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs bg-emerald-50 text-emerald-700 border-emerald-200" onClick={() => setSelectedBannerForStats(banner)}>Detaylı Rapor</Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs text-red-600 border-red-200" onClick={() => handleRemoveBanner(banner.id)}>Kaldır</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center text-[var(--foreground-muted)]">
                  <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                  <p>Henüz aktif bir reklam banner'ı bulunmuyor.</p>
                  <p className="text-xs mt-2">Ana sayfa ve kategori sayfalarında gösterilecek bannerları buradan yönetebilirsiniz.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Hizmet Paketleri ve Fiyatlar</h3>
                <Button variant="gradient" size="sm" onClick={handleAddPackage}>Yeni Paket Ekle</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.length > 0 ? packages.map((pkg) => (
                  <div key={pkg.id} className="border border-[var(--border)] rounded-2xl p-6 bg-white shadow-sm">
                    <h4 className="font-bold text-lg">{pkg.name}</h4>
                    <div className="text-2xl font-bold text-[var(--brand-primary)] mt-2">₺{pkg.price} <span className="text-sm font-normal text-gray-400">/ay</span></div>
                    <ul className="text-sm text-[var(--foreground-muted)] space-y-2 mt-4 mb-6">
                      {JSON.parse(pkg.features || '[]').map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> {f}</li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handleEditPackage(pkg.id, pkg.price, pkg.name)}>Fiyatı Düzenle</Button>
                      <Button variant="outline" className="flex-1 text-red-600 border-red-200" onClick={() => handleRemovePackage(pkg.id)}>Sil</Button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 text-center py-8 text-[var(--foreground-muted)]">
                    Kayıtlı hizmet paketi bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold mb-4">Sistem İşlem Geçmişi (Logs)</h3>
              <div className="bg-gray-50 border border-[var(--border)] rounded-2xl p-4 font-mono text-xs overflow-hidden max-h-[600px] overflow-y-auto">
                {logs.length > 0 ? logs.map(log => (
                  <div key={log.id} className={`mb-2 ${log.actionType === 'WARNING' ? 'text-orange-600' : log.actionType === 'DANGER' ? 'text-red-600' : 'text-blue-600'}`}>
                    [{log.actionType}] {new Date(log.createdAt).toLocaleString('tr-TR')} - {log.message} ({log.adminEmail})
                  </div>
                )) : (
                  <div className="text-[var(--foreground-muted)]">Henüz log kaydı bulunmuyor.</div>
                )}
                <div className="text-[var(--foreground-muted)] mt-6 text-center">-- Log sonu --</div>
              </div>
            </div>
          )}

          {activeTab === 'ghost-listing' && (
            <GhostListingTab />
          )}

          {/* BLOGS TAB */}
          {activeTab === 'blogs' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold font-display">Blog İçerik Yönetimi</h2>
              <div className="bg-white p-6 rounded-3xl border border-[var(--border)]">
                <h3 className="font-bold mb-4">Yeni Blog Ekle</h3>
                <form onSubmit={handleCreateBlog} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold mb-1">Başlık</label>
                    <input type="text" name="title" required className="w-full border rounded-xl p-3 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Kısa Özet (Summary)</label>
                    <input type="text" name="summary" className="w-full border rounded-xl p-3 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">İçerik (HTML veya Düz Metin)</label>
                    <textarea name="content" required rows={8} className="w-full border rounded-xl p-3 bg-gray-50 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Kapak Görseli URL</label>
                    <input type="url" name="imageUrl" className="w-full border rounded-xl p-3 bg-gray-50" placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Kategori</label>
                      <input type="text" name="category" className="w-full border rounded-xl p-3 bg-gray-50" defaultValue="genel" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Etiketler (Virgülle ayırın)</label>
                      <input type="text" name="tags" className="w-full border rounded-xl p-3 bg-gray-50" placeholder="kedi, bakim, saglik" />
                    </div>
                  </div>
                  <Button type="submit" variant="gradient" className="mt-4">Yayınla</Button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[var(--border)]">
                <h3 className="font-bold mb-4">Yayındaki Bloglar ({blogs.length})</h3>
                <div className="space-y-3">
                  {blogs.map(blog => (
                    <div key={blog.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h4 className="font-bold text-sm">{blog.title}</h4>
                        <p className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()} • {blog.viewCount} Görüntülenme</p>
                      </div>
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-600 hover:underline">Görüntüle →</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold font-display">Site Yönetimi ve Ayarlar</h2>
              
              <div className="bg-white p-6 rounded-3xl border border-[var(--border)]">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formElement = e.currentTarget;
                  const formData = new FormData(formElement);
                  const data = Object.fromEntries(formData.entries());
                  
                  // Boolean dönüşümleri
                  data.maintenanceMode = formData.get('maintenanceMode') === 'true' ? true : false as any;
                  data.allowNewRegistrations = formData.get('allowNewRegistrations') === 'true' ? true : false as any;
                  
                  try {
                    const res = await fetch('/api/admin/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data)
                    });
                    if (res.ok) {
                      alert('Ayarlar başarıyla kaydedildi!');
                      const r = await fetch('/api/admin/settings');
                      if (r.ok) setSettings((await r.json()).settings || {});
                    } else {
                      alert('Ayarlar kaydedilirken hata oluştu');
                    }
                  } catch(e) {
                    alert('Hata oluştu');
                  }
                }} className="space-y-6">
                  {/* Anasayfa Hero İçeriği */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Anasayfa Hero İçeriği</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">Anasayfa Büyük Başlık</label>
                        <input type="text" name="heroTitle" defaultValue={settings?.heroTitle || 'Doğru dostunu bul, sıcak bir yuva ver 🐾'} className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">Anasayfa Alt Açıklama</label>
                        <textarea name="heroSubtitle" rows={2} defaultValue={settings?.heroSubtitle || 'Köpek, kedi ve kuş sahiplendirme ilanları. Kayıp hayvan ihbarları. Çiftleştirme eşleştirme. Yapay zekâ ile anında doğru cevap.'} className="w-full border rounded-xl p-3 bg-gray-50 resize-none"></textarea>
                      </div>
                    </div>
                  </div>

                  {/* SEO Ayarları */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">SEO Ayarları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">Site Adı</label>
                        <input type="text" name="siteName" defaultValue={settings?.siteName} className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Site URL</label>
                        <input type="url" name="siteUrl" defaultValue={settings?.siteUrl} className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">Meta Title (Başlık)</label>
                        <input type="text" name="metaTitle" defaultValue={settings?.metaTitle} className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">Meta Description (Açıklama)</label>
                        <textarea name="metaDescription" rows={2} defaultValue={settings?.metaDescription} className="w-full border rounded-xl p-3 bg-gray-50 resize-none"></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">Meta Keywords (Etiketler)</label>
                        <input type="text" name="metaKeywords" defaultValue={settings?.metaKeywords} className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  {/* E-posta (SMTP) Ayarları */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2 flex justify-between items-center">
                      <span>E-posta (SMTP) Ayarları</span>
                      <Button type="button" variant="outline" size="sm" onClick={async () => {
                        const email = window.prompt('Test mailinin gönderileceği e-posta adresi:');
                        if (email) {
                          try {
                            const res = await fetch('/api/admin/settings/test-mail', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ toEmail: email })
                            });
                            const result = await res.json();
                            if (res.ok) alert(result.message);
                            else alert('Hata: ' + result.error);
                          } catch(e) {
                            alert('İstek başarısız oldu.');
                          }
                        }
                      }}>Test Maili Gönder</Button>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">SMTP Sunucu</label>
                        <input type="text" name="smtpHost" defaultValue={settings?.smtpHost} placeholder="smtp.gmail.com" className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">SMTP Port</label>
                        <input type="number" name="smtpPort" defaultValue={settings?.smtpPort} placeholder="587" className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">SMTP Kullanıcı (E-posta)</label>
                        <input type="text" name="smtpUser" defaultValue={settings?.smtpUser} className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">SMTP Şifre</label>
                        <input type="password" name="smtpPass" defaultValue={settings?.smtpPass} className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Gönderen Adı</label>
                        <input type="text" name="smtpFromName" defaultValue={settings?.smtpFromName} placeholder="Sahiplendirme.com" className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Gönderen E-posta</label>
                        <input type="email" name="smtpFromEmail" defaultValue={settings?.smtpFromEmail} placeholder="noreply@sahiplendirme.com" className="w-full border rounded-xl p-3 bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  {/* Site Durumu */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Site Durumu ve Bakım</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">Bakım Modu</label>
                        <select name="maintenanceMode" defaultValue={settings?.maintenanceMode ? 'true' : 'false'} className="w-full border rounded-xl p-3 bg-gray-50">
                          <option value="false">Kapalı (Site Yayında)</option>
                          <option value="true">Açık (Sadece Adminler Girebilir)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Yeni Üyelikler</label>
                        <select name="allowNewRegistrations" defaultValue={settings?.allowNewRegistrations ? 'true' : 'false'} className="w-full border rounded-xl p-3 bg-gray-50">
                          <option value="true">Açık</option>
                          <option value="false">Kapalı</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">Bakım Modu Mesajı</label>
                        <textarea name="maintenanceMsg" rows={2} defaultValue={settings?.maintenanceMsg} className="w-full border rounded-xl p-3 bg-gray-50 resize-none"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" variant="gradient" size="lg">Ayarları Kaydet</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>

      {/* BANNER STATS MODAL */}
      {selectedBannerForStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Banner Raporu: {selectedBannerForStats.title}</h3>
                <p className="text-sm text-gray-500">Gösterim ve Tıklama İstatistikleri</p>
              </div>
              <button onClick={() => setSelectedBannerForStats(null)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                  <div className="text-sm text-emerald-600 font-bold mb-1">Toplam Gösterim</div>
                  <div className="text-3xl font-bold text-emerald-700">{selectedBannerForStats.stats?.reduce((a:any,b:any) => a + b.impressions, 0) || 0}</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                  <div className="text-sm text-blue-600 font-bold mb-1">Toplam Tıklama</div>
                  <div className="text-3xl font-bold text-blue-700">{selectedBannerForStats.clicks || 0}</div>
                </div>
              </div>

              <h4 className="font-bold text-gray-800 mb-4">Günlük Detaylar</h4>
              {selectedBannerForStats.stats && selectedBannerForStats.stats.length > 0 ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3">Tarih</th>
                        <th className="px-4 py-3 text-right">Gösterim</th>
                        <th className="px-4 py-3 text-right">Tıklama</th>
                        <th className="px-4 py-3 text-right">Tıklama Oranı (CTR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedBannerForStats.stats.map((stat:any, idx:number) => {
                        const ctr = stat.impressions > 0 ? ((stat.clicks / stat.impressions) * 100).toFixed(2) : '0.00';
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{stat.date}</td>
                            <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{stat.impressions}</td>
                            <td className="px-4 py-3 text-right text-blue-600 font-semibold">{stat.clicks}</td>
                            <td className="px-4 py-3 text-right text-gray-500">%{ctr}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-500 text-sm">Henüz raporlanacak bir etkileşim verisi yok.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
              <Button onClick={() => setSelectedBannerForStats(null)} className="w-full">Kapat</Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BANNER MODAL */}
      <Modal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} title="Yeni Reklam (Banner) Ekle">
        <div className="flex flex-col gap-4 p-1">
          <div>
            <label className="block text-sm font-bold mb-1">Reklam Başlığı (Sadece Yöneticiler Görür)</label>
            <input type="text" value={newBanner.title} onChange={(e) => setNewBanner({...newBanner, title: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" placeholder="Örn: Royal Canin İndirimi" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Reklam Görseli</label>
            <div className="flex gap-2">
              <input type="url" value={newBanner.imageUrl} onChange={(e) => setNewBanner({...newBanner, imageUrl: e.target.value})} className="flex-1 border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" placeholder="https://... (URL girebilirsiniz)" />
              <label className={`flex items-center justify-center px-4 rounded-xl border bg-[var(--surface-secondary)] cursor-pointer hover:bg-gray-100 transition-colors ${isUploadingBanner ? 'opacity-50' : ''}`}>
                <ImageIcon size={20} className="mr-2" />
                <span className="text-sm font-medium">{isUploadingBanner ? 'Yükleniyor...' : 'Yükle'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleBannerFileUpload} disabled={isUploadingBanner} />
              </label>
            </div>
            {newBanner.imageUrl && <img src={newBanner.imageUrl} alt="Önizleme" className="mt-2 h-24 object-contain rounded-lg border bg-gray-100" />}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Yönlendirilecek Link (Opsiyonel)</label>
            <input type="url" value={newBanner.linkUrl} onChange={(e) => setNewBanner({...newBanner, linkUrl: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" placeholder="Tıklandığında gideceği sayfa (https://...)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Gösterim Alanı (Kapsam)</label>
              <select value={newBanner.position} onChange={(e) => setNewBanner({...newBanner, position: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none">
                <optgroup label="Anasayfa">
                  <option value="home_middle">Anasayfa - Orta (Kategoriler altı)</option>
                  <option value="home_bottom">Anasayfa - Alt (Mağaza altı)</option>
                </optgroup>
                <optgroup label="İlanlar">
                  <option value="search_top">Arama Sonuçları - Üst Kısım</option>
                  <option value="listing_sidebar">İlan Detay - Sağ Kısım (Dikey/Kare)</option>
                  <option value="listing_bottom">İlan Detay - Alt Kısım (Yatay)</option>
                </optgroup>
                <optgroup label="Mağaza & Hizmetler">
                  <option value="store_top">Mağaza Anasayfa - Üst</option>
                  <option value="store_middle">Mağaza - Ürünler Arası</option>
                  <option value="services_top">Hizmetler - Üst</option>
                </optgroup>
                <optgroup label="Diğer Sayfalar">
                  <option value="blogs_top">Blog / Bilgi Bankası - Üst</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Yayın Süresi</label>
              <select value={newBanner.duration} onChange={(e) => setNewBanner({...newBanner, duration: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none">
                <option value="7">7 Gün</option>
                <option value="15">15 Gün</option>
                <option value="30">30 Gün</option>
                <option value="90">90 Gün (3 Ay)</option>
                <option value="365">Sürekli (1 Yıl)</option>
              </select>
            </div>
          </div>
          <Button variant="gradient" size="lg" className="mt-4" onClick={submitNewBanner} disabled={isUploadingBanner}>Reklamı Yayınla</Button>
        </div>
      </Modal>

      {/* PACKAGE MODAL */}
      <Modal isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} title={editingPackage.id ? "Paketi Düzenle" : "Yeni Paket Ekle"}>
        <form onSubmit={handleSavePackage} className="flex flex-col gap-4 p-1">
          <div>
            <label className="block text-sm font-bold mb-1">Paket/Hizmet Adı</label>
            <input 
              type="text" 
              value={editingPackage.name} 
              onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})} 
              className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" 
              placeholder="Örn: Veteriner Kliniği" 
              required
              disabled={!!editingPackage.id} // Sadece isim sabit kalsın, fiyat düzenlensin. (Yeni ekleniyorsa açık)
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Fiyat (Aylık ₺)</label>
            <input 
              type="number" 
              step="0.01"
              value={editingPackage.price} 
              onChange={(e) => setEditingPackage({...editingPackage, price: e.target.value})} 
              className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" 
              placeholder="Örn: 199.90" 
              required
            />
          </div>
          <Button variant="gradient" size="lg" className="mt-4" type="submit">Kaydet</Button>
        </form>
      </Modal>

    </div>
  );
}
