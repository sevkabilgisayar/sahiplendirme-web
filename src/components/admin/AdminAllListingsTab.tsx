'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, ShieldAlert, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminAllListingsTab() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.append('search', searchTerm);
      if (statusFilter) query.append('status', statusFilter);
      if (typeFilter) query.append('type', typeFilter);

      const res = await fetch(`/api/admin/all-listings?${query.toString()}`);
      if (!res.ok) throw new Error('Veriler alınamadı');
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      toast.error('İlanlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sadece debounce için küçük bir gecikme ekliyoruz ki her harf yazışta api'ye gitmesin
    const timeout = setTimeout(() => {
      fetchListings();
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter, typeFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ilanı tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;
    
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Silinemedi');
      toast.success('İlan başarıyla silindi.');
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      toast.error('İlan silinirken bir hata oluştu.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Güncellenemedi');
      toast.success('İlan durumu güncellendi.');
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (error) {
      toast.error('Durum güncellenirken hata oluştu.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Aktif</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold">Bekliyor</span>;
      case 'passive': return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">Pasif</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Reddedildi</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="İlan No, Başlık, İsim, E-posta..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            className="flex-1 sm:flex-none border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="pending">Bekleyen</option>
            <option value="passive">Pasif</option>
            <option value="rejected">Reddedilmiş</option>
          </select>
          
          <select 
            className="flex-1 sm:flex-none border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tüm Türler</option>
            <option value="sahiplendirme">Sahiplendirme</option>
            <option value="kayip">Kayıp</option>
            <option value="es-bulma">Eş Bulma</option>
          </select>
        </div>
      </div>

      <Card className="border border-[var(--border)] shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İlan Bilgisi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tür / Kategori</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İstatistik</th>
                <th className="py-4 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {loading && listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">Yükleniyor...</td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">İlan bulunamadı.</td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-[var(--border)]">
                          {(() => {
                            try {
                              const photos = listing.photos ? JSON.parse(listing.photos) : [];
                              if (photos && photos.length > 0) {
                                return <img src={photos[0]} alt={listing.title} className="w-full h-full object-cover" />;
                              }
                            } catch (e) {
                              // JSON.parse hatası olursa ignore
                            }
                            return <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">Yok</div>;
                          })()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[var(--foreground)] truncate max-w-[200px]" title={listing.title}>
                            {listing.title}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">#{listing.id.substring(0,8).toUpperCase()}</span>
                          <span className="text-xs text-gray-400 mt-1">{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{listing.user?.firstName} {listing.user?.lastName}</span>
                        <span className="text-xs text-gray-500">{listing.user?.email}</span>
                        {listing.user?.phone && <span className="text-xs text-gray-400">{listing.user.phone}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold capitalize">{listing.type}</span>
                        <span className="text-xs text-gray-500 capitalize">{listing.animal}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <span title="Görüntülenme">👁️ {listing.viewCount || 0}</span>
                        {listing._count?.reports > 0 && (
                          <span className="text-red-500 font-bold" title="Şikayet Sayısı">⚠️ {listing._count.reports} Şikayet</span>
                        )}
                        {listing._count?.messages > 0 && <span title="Mesajlar">💬 {listing._count.messages}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/ilan/${listing.id}`} target="_blank">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="İlanı Gör">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <Link href={`/ilan-duzenle/${listing.id}`} target="_blank">
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="İlanı Düzenle">
                            <Edit size={16} />
                          </button>
                        </Link>
                        {listing.status !== 'active' && (
                          <button onClick={() => handleStatusChange(listing.id, 'active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Aktif Et">
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {listing.status === 'active' && (
                          <button onClick={() => handleStatusChange(listing.id, 'passive')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Pasife Al">
                            <AlertTriangle size={16} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(listing.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="İlanı Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
