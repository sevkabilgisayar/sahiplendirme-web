'use client';
import { useState } from 'react';
import { Trash2, ShoppingCart, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { mockStoreProducts } from '@/lib/mock-data';

export default function SepetPage() {
  const [items, setItems] = useState(
    mockStoreProducts.slice(0, 3).map(p => ({ ...p, quantity: 1 }))
  );

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subTotal > 150 ? 0 : 39.90;
  const total = subTotal + shipping;

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-display flex items-center gap-3 mb-8">
          <ShoppingCart size={28} className="text-emerald-600" /> Sepetim
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[var(--border)] p-12 text-center">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Sepetiniz Boş</h2>
            <p className="text-[var(--foreground-muted)] mb-8">Hemen mağazamızdaki ürünleri inceleyin ve evcil dostunuzu mutlu edin.</p>
            <Link href="/magaza">
              <Button size="lg" className="px-10 bg-emerald-600 hover:bg-emerald-700 text-white">Alışverişe Başla</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ürün Listesi */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white border border-[var(--border)] rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-xl bg-[var(--surface-secondary)] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-emerald-600 font-bold mb-1">{item.brand}</div>
                    <Link href={`/magaza/${item.id}`} className="font-bold text-[var(--foreground)] text-base hover:text-[var(--brand-primary)] transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="text-lg font-bold mt-2">₺{item.price}</div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center gap-3 bg-[var(--surface-secondary)] rounded-xl px-2 py-1 border border-[var(--border)]">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-lg font-bold hover:bg-gray-50">-</button>
                      <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-lg font-bold hover:bg-gray-50">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sipariş Özeti */}
            <div>
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sticky top-24 shadow-sm">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b border-[var(--border)]">Sipariş Özeti</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">Ürünlerin Toplamı</span>
                    <span className="font-semibold">₺{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">Kargo Ücreti</span>
                    <span className="font-semibold">{shipping === 0 ? <span className="text-emerald-600 font-bold">Bedava</span> : `₺${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex items-start gap-2 text-xs bg-blue-50 text-blue-700 p-3 rounded-xl">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>₺{(150 - subTotal).toFixed(2)} daha alışveriş yapın, kargo bedava olsun!</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--border)] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Ödenecek Tutar</span>
                    <span className="font-bold text-2xl text-emerald-600">₺{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-base" rightIcon={<ChevronRight size={18} />}>
                  Alışverişi Tamamla
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--foreground-muted)]">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  256 Bit SSL ile Güvenli Ödeme
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
