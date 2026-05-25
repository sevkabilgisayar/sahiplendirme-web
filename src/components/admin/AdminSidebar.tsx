import React from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  ShoppingBag, 
  Users, 
  ShieldAlert, 
  Image as ImageIcon, 
  Package, 
  FileText, 
  Settings, 
  PlusCircle,
  LogOut,
  Wallet,
  Percent,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  counts: {
    listings: number;
    orders: number;
    users: number;
    reports: number;
  };
}

export default function AdminSidebar({ activeTab, setActiveTab, counts }: AdminSidebarProps) {
  const menuGroups = [
    {
      title: 'İlan & İçerik',
      items: [
        { id: 'all-listings', label: 'Tüm İlanlar', icon: Megaphone },
        { id: 'listings', label: 'İlan Onayları', icon: CheckCircle, badge: counts.listings },
        { id: 'ghost-listing', label: 'Hızlı İlan Ekle', icon: PlusCircle },
        { id: 'blogs', label: 'Blog Yönetimi', icon: FileText },
      ]
    },
    {
      title: 'Ticaret & Finans',
      items: [
        { id: 'orders', label: 'Siparişler', icon: ShoppingBag, badge: counts.orders },
        { id: 'finance', label: 'Finans & Komisyon', icon: Wallet },
        { id: 'packages', label: 'Abonelik Paketleri', icon: Package },
        { id: 'ads', label: 'Reklam (Banner)', icon: ImageIcon },
      ]
    },
    {
      title: 'Kullanıcı & Güvenlik',
      items: [
        { id: 'users', label: 'Müşteri Listesi', icon: Users, badge: counts.users },
        { id: 'reports', label: 'Şikayetler', icon: ShieldAlert, badge: counts.reports },
        { id: 'logs', label: 'Sistem Logları', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { id: 'settings', label: 'Genel Ayarlar', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 min-h-[calc(100vh-6rem)] rounded-l-2xl">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold font-display text-gray-800">Admin Paneli</h2>
        <p className="text-xs text-gray-500 mt-1">Yönetim ve Moderasyon</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">{group.title}</h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-violet-50 text-violet-700" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? "text-violet-600" : "text-gray-400"} />
                        {item.label}
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          isActive ? "bg-violet-200 text-violet-800" : "bg-gray-100 text-gray-600"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
