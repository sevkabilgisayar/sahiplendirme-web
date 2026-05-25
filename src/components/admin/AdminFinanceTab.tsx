import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TrendingUp, DollarSign, Percent, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminFinanceTab({ orders }: { orders: any[] }) {
  // Basit hesaplamalar (gerçekte backend'den gelmeli ama şimdilik client'ta özetliyoruz)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'teslim_edildi' || o.status === 'tamamlandi');
  const completedRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
  // Örnek komisyon oranı (bunu ayarlardan çekebiliriz)
  const [commissionRate, setCommissionRate] = useState(15);
  const estimatedCommission = (completedRevenue * commissionRate) / 100;

  const handleSaveCommission = () => {
    alert(`Komisyon oranı %${commissionRate} olarak kaydedildi! (Bu aşamada sadece arayüzde güncellendi)`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-800">Finans & Satışlar</h2>
          <p className="text-sm text-gray-500 mt-1">Platform gelirleri, satılan ürünler ve komisyon oranları</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-center border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
            <span className="text-sm font-semibold">Toplam Ciro</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">₺{totalRevenue.toLocaleString('tr-TR')}</div>
          <div className="text-xs text-emerald-600 flex items-center mt-2 font-medium">
            <ArrowUpRight size={14} className="mr-1" /> +12% geçen aya göre
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-center border-l-4 border-violet-500">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
              <Percent size={16} />
            </div>
            <span className="text-sm font-semibold">Kazanılan Komisyon</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">₺{estimatedCommission.toLocaleString('tr-TR')}</div>
          <div className="text-xs text-gray-500 mt-2 font-medium">
            Tamamlanan satışlardan
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-center border-l-4 border-blue-500">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
            <span className="text-sm font-semibold">Başarılı Satışlar</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{completedOrders.length}</div>
          <div className="text-xs text-gray-500 mt-2 font-medium">
            Toplam {orders.length} siparişten
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-center bg-gray-50 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-3">Platform Komisyon Oranı</div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              <input 
                type="number" 
                value={commissionRate} 
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full h-10 pl-8 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg font-bold text-gray-800"
              />
            </div>
            <Button onClick={handleSaveCommission} variant="gradient" className="h-10 px-4">Kaydet</Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Bu oran yeni satışlarda satıcıdan kesilecektir.</p>
        </Card>
      </div>

      {/* Son Satışlar Tablosu */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-violet-600" /> Son Satış Hareketleri
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-semibold">Sipariş No</th>
                <th className="px-6 py-3 font-semibold">Müşteri</th>
                <th className="px-6 py-3 font-semibold">Tarih</th>
                <th className="px-6 py-3 font-semibold text-right">Tutar</th>
                <th className="px-6 py-3 font-semibold text-right">Komisyon (%{commissionRate})</th>
                <th className="px-6 py-3 font-semibold text-center">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 10).map((o) => {
                const commission = (o.totalAmount || 0) * (commissionRate / 100);
                return (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{o.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {o.user?.firstName} {o.user?.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800">
                      ₺{o.totalAmount?.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-violet-600">
                      ₺{commission.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                        o.status === 'tamamlandi' || o.status === 'teslim_edildi' ? 'bg-emerald-100 text-emerald-700' :
                        o.status === 'iptal_edildi' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Henüz finansal bir hareket bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
