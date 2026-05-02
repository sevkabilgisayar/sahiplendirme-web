'use client';

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Users, Image as ImageIcon, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const mockPendingListings = [
  { id: '1', user: 'Ahmet Y.', type: 'Sahiplendirme', title: 'Golden Retriever Yavruları', aiScore: 95, date: '10 dk önce', status: 'pending' },
  { id: '2', user: 'Mehmet K.', type: 'Kayıp', title: 'Kadıköy\'de kaybolan kedimiz', aiScore: 88, date: '1 saat önce', status: 'pending' },
  { id: '3', user: 'Ayşe D.', type: 'Çiftleştirme', title: 'Safkan British Shorthair', aiScore: 45, date: '2 saat önce', status: 'pending', warning: 'AI Düşük Skor: Fotoğraf net değil' },
  { id: '4', user: 'Barınak İst.', type: 'Sahiplendirme', title: 'Sokaktan kurtarılan köpekler', aiScore: 92, date: '3 saat önce', status: 'pending' },
];

const mockReports = [
  { id: '1', reporter: 'Ali V.', listingId: 'L-123', reason: 'Sahte ilan', detail: 'Bu fotoğrafları internette gördüm.', date: 'Dün', status: 'open' },
  { id: '2', reporter: 'Zeynep Ş.', listingId: 'L-456', reason: 'Uygunsuz içerik', detail: 'Açıklama kısmında hakaret var.', date: 'Dün', status: 'open' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'reports'>('listings');
  const [listings, setListings] = useState(mockPendingListings);
  const [reports, setReports] = useState(mockReports);

  const handleApprove = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleReject = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleResolveReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Admin & Moderasyon Paneli</h1>
              <p className="text-sm text-[var(--foreground-muted)]">İlan onayları, şikayet yönetimi ve AI risk skorları</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={activeTab === 'listings' ? 'gradient' : 'outline'} onClick={() => setActiveTab('listings')}>
              Bekleyen İlanlar ({listings.length})
            </Button>
            <Button variant={activeTab === 'reports' ? 'gradient' : 'outline'} onClick={() => setActiveTab('reports')}>
              Şikayetler ({reports.length})
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><ShieldAlert size={20} /></div>
            <div><div className="text-2xl font-bold">{listings.length}</div><div className="text-xs text-[var(--foreground-muted)]">Onay Bekleyen</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><ShieldAlert size={20} /></div>
            <div><div className="text-2xl font-bold">{reports.length}</div><div className="text-xs text-[var(--foreground-muted)]">Açık Şikayet</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Users size={20} /></div>
            <div><div className="text-2xl font-bold">12K</div><div className="text-xs text-[var(--foreground-muted)]">Toplam Kullanıcı</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle size={20} /></div>
            <div><div className="text-2xl font-bold">8.5K</div><div className="text-xs text-[var(--foreground-muted)]">Yayındaki İlan</div></div>
          </Card>
        </div>

        {/* Content */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input type="text" placeholder="Ara..." className="w-full h-10 pl-9 pr-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
            </div>
            <Button variant="outline" leftIcon={<Filter size={16} />} className="hidden sm:flex">Filtrele</Button>
          </div>

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
                      <td className="py-3 font-semibold">{l.user}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${l.type === 'Kayıp' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{l.type}</span>
                          {l.title}
                        </div>
                        {l.warning && <div className="text-xs text-red-500 mt-1 flex items-center gap-1"><ShieldAlert size={12} /> {l.warning}</div>}
                      </td>
                      <td className="py-3 text-[var(--foreground-muted)]">{l.date}</td>
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)]">
                    <th className="pb-3 font-medium">Şikayet Eden</th>
                    <th className="pb-3 font-medium">İlan ID</th>
                    <th className="pb-3 font-medium">Sebep</th>
                    <th className="pb-3 font-medium">Detay</th>
                    <th className="pb-3 font-medium">Tarih</th>
                    <th className="pb-3 font-medium text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {reports.map(r => (
                    <tr key={r.id} className="hover:bg-[var(--surface-secondary)] transition-colors">
                      <td className="py-3 font-semibold">{r.reporter}</td>
                      <td className="py-3"><a href={`/ilan/${r.listingId}`} className="text-[var(--brand-primary)] hover:underline">{r.listingId}</a></td>
                      <td className="py-3"><span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">{r.reason}</span></td>
                      <td className="py-3 text-[var(--foreground-muted)] truncate max-w-xs">{r.detail}</td>
                      <td className="py-3 text-[var(--foreground-muted)]">{r.date}</td>
                      <td className="py-3 text-right">
                        <Button variant="outline" size="sm" className="text-green-600" onClick={() => handleResolveReport(r.id)}>Çözüldü İşaretle</Button>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-[var(--foreground-muted)]">Açık şikayet bulunmuyor 🎉</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
