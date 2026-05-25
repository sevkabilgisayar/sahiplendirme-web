'use client';

import { useState, useEffect } from 'react';
import { Bell, MessageSquare, ClipboardList, AlertTriangle, Package, Settings, Check, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const mockNotifications = [
  { id: '1', type: 'basvuru', title: 'Yeni Sahiplenme Talebi', message: 'Ali Demir, Pamuk ilanınız için başvuru yaptı.', time: '5 dk önce', read: false, link: '/profil' },
  { id: '2', type: 'mesaj', title: 'Yeni Mesaj', message: 'Ahmet Yılmaz size bir mesaj gönderdi.', time: '1 saat önce', read: false, link: '/profil/mesajlar' },
  { id: '3', type: 'kayip_uyari', title: 'Yakınınızda Kayıp İlan', message: 'İstanbul, Kadıköy bölgesinde yeni bir kayıp köpek ilanı yayınlandı.', time: '3 saat önce', read: true, link: '/ilanlar' },
  { id: '4', type: 'sistem', title: 'İlanınız Onaylandı', message: 'Max - Labrador ilanınız editör tarafından onaylanıp yayına alındı.', time: '1 gün önce', read: true, link: '/ilan/5' },
  { id: '5', type: 'paket_uyari', title: 'Paket Hatırlatma', message: 'Profesyonel paketinizin süresi 7 gün içinde dolacak.', time: '2 gün önce', read: true, link: '/paketler' },
  { id: '6', type: 'basvuru', title: 'Başvuru Güncellendi', message: 'Karamel - Golden için başvurunuz onaylandı!', time: '3 gün önce', read: true, link: '/profil' },
];

const typeIcons: Record<string, React.ReactNode> = {
  mesaj: <MessageSquare size={18} />,
  basvuru: <ClipboardList size={18} />,
  kayip_uyari: <AlertTriangle size={18} />,
  sistem: <Bell size={18} />,
  paket_uyari: <Package size={18} />,
};

const typeColors: Record<string, string> = {
  mesaj: 'bg-blue-100 text-blue-600',
  basvuru: 'bg-green-100 text-green-600',
  kayip_uyari: 'bg-red-100 text-red-600',
  sistem: 'bg-orange-100 text-orange-600',
  paket_uyari: 'bg-purple-100 text-purple-600',
};

export default function BildirimlerPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.notifications) {
          // Gelen veriyi frontend yapısına göre düzenle
          const formatted = data.notifications.map((n: any) => ({
            id: n.id,
            type: n.type || 'sistem',
            title: n.type === 'message' ? 'Yeni Mesaj' : n.type === 'application' ? 'Yeni Başvuru' : 'Sistem Bildirimi',
            message: n.content,
            time: new Date(n.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            read: n.isRead,
            link: n.type === 'message' ? '/profil/mesajlar' : '/profil'
          }));
          setNotifications(formatted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    fetch('/api/notifications', { method: 'PATCH' }).catch(console.error);
  };
  
  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    fetch(`/api/notifications/${id}`, { method: 'PATCH' }).catch(console.error);
  };
  
  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    fetch(`/api/notifications/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);


  return (
    <div className="bg-[var(--background)] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display">Bildirimler</h1>
            <p className="text-sm text-[var(--foreground-muted)]">{unreadCount} okunmamış bildirim</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={<Check size={14} />}>
                Tümünü Okundu İşaretle
              </Button>
            )}
            <Link href="/profil">
              <Button variant="ghost" size="sm" leftIcon={<Settings size={14} />}>Ayarlar</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'unread', label: 'Okunmamış' },
            { id: 'mesaj', label: 'Mesajlar' },
            { id: 'basvuru', label: 'Başvurular' },
            { id: 'kayip_uyari', label: 'Kayıp Uyarıları' },
            { id: 'sistem', label: 'Sistem' },
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.id ? 'gradient-brand text-white shadow-sm' : 'bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground-muted)]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filtered.map((notif) => (
            <Card key={notif.id}
              className={`p-4 flex items-start gap-4 transition-all hover:shadow-sm ${!notif.read ? 'border-l-4 border-l-[var(--brand-primary)] bg-orange-50/50' : 'border-[var(--border)]'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
                {typeIcons[notif.type]}
              </div>
              <Link href={notif.link} onClick={() => markRead(notif.id)} className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`text-sm ${!notif.read ? 'font-bold' : 'font-semibold'}`}>{notif.title}</h3>
                  {!notif.read && <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-[var(--foreground-muted)] line-clamp-1">{notif.message}</p>
                <span className="text-[10px] text-[var(--foreground-muted)] mt-1 block">{notif.time}</span>
              </Link>
              <button onClick={() => remove(notif.id)} className="text-[var(--foreground-muted)] hover:text-red-500 transition-colors p-1 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
            <h3 className="font-bold font-display mb-1">Bildirim yok</h3>
            <p className="text-sm text-[var(--foreground-muted)]">Henüz bildiriminiz bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
