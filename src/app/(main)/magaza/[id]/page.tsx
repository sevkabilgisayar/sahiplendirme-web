import { mockStoreProducts } from '@/lib/mock-data';
import Link from 'next/link';
import { ChevronRight, Star, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = mockStoreProducts.find((p) => p.id === parseInt(params.id)) || mockStoreProducts[0];

  return (
    <div className="min-h-screen bg-[var(--background)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--brand-primary)]">Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href="/magaza" className="hover:text-[var(--brand-primary)]">Mağaza</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--foreground)] truncate font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-[var(--surface-secondary)] rounded-3xl p-8 flex items-center justify-center border border-[var(--border)] overflow-hidden relative">
            {product.tag && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-bold px-3 py-1 rounded-xl text-sm z-10">
                {product.tag}
              </span>
            )}
            <img src={product.photo} alt={product.name} className="w-full h-auto object-cover rounded-2xl shadow-sm mix-blend-multiply max-h-[500px]" />
          </div>

          {/* Details */}
          <div>
            <div className="text-sm text-emerald-600 font-bold mb-2 uppercase tracking-wide">{product.brand}</div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)] mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-yellow-700">{product.rating}</span>
              </div>
              <span className="text-sm text-[var(--foreground-muted)] underline cursor-pointer">{product.reviews} Değerlendirme</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-emerald-600">₺{product.price}</span>
              {product.oldPrice && <span className="text-xl line-through text-[var(--foreground-muted)]">₺{product.oldPrice}</span>}
            </div>

            <p className="text-[var(--foreground-muted)] mb-8 leading-relaxed">
              Pet dostunuz için en yüksek kalite standartlarında üretilmiş premium ürün. Hızlı kargo ve güvenli alışveriş güvencesiyle kapınızda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" rightIcon={<ShoppingBag size={18} />}>
                Sepete Ekle
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 border-t border-[var(--border)] pt-8">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Truck size={18} /></div>
                <div className="text-xs font-medium">₺150 Üzeri Bedava Kargo</div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><Shield size={18} /></div>
                <div className="text-xs font-medium">Güvenli Ödeme Sistemi</div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><RefreshCw size={18} /></div>
                <div className="text-xs font-medium">30 Gün İade Garantisi</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
