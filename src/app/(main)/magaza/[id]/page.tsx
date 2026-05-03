import { mockStoreProducts } from '@/lib/mock-data';
import Link from 'next/link';
import { ChevronRight, Star, ShoppingBag, Truck, Shield, RefreshCw, CreditCard, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

const mockReviews = [
  { id: 1, name: 'Ayşe K.', avatar: 'A', rating: 5, date: '2024-01-10', text: 'Harika ürün, köpeğim çok beğendi! Kalitesi gerçekten çok iyi, kesinlikle tavsiye ederim.' },
  { id: 2, name: 'Mehmet T.', avatar: 'M', rating: 4, date: '2024-01-05', text: 'Kargo hızlıydı, ürün beklentilerimi karşıladı. Paketleme de güzeldi.' },
  { id: 3, name: 'Selin A.', avatar: 'S', rating: 5, date: '2023-12-28', text: 'Çok memnun kaldım, kedim ilk günden alıştı. Tekrar sipariş vereceğim.' },
];

const mockInstallments = [
  { bank: 'Ziraat Bankası', logo: '🏛️', months: [{ n: 3, price: '' }, { n: 6, price: '' }, { n: 9, price: '' }, { n: 12, price: '' }] },
  { bank: 'Garanti BBVA', logo: '🟢', months: [{ n: 3, price: '' }, { n: 6, price: '' }, { n: 9, price: '' }, { n: 12, price: '' }] },
  { bank: 'İş Bankası', logo: '🔵', months: [{ n: 3, price: '' }, { n: 6, price: '' }, { n: 9, price: '' }, { n: 12, price: '' }] },
  { bank: 'Yapı Kredi', logo: '🟡', months: [{ n: 3, price: '' }, { n: 6, price: '' }, { n: 9, price: '' }, { n: 12, price: '' }] },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = mockStoreProducts.find((p) => p.id === parseInt(params.id)) || mockStoreProducts[0];
  const avgRating = mockReviews.reduce((a, r) => a + r.rating, 0) / mockReviews.length;

  const installmentPrice = (months: number) => (product.price / months).toFixed(2);

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

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
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
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} className={i <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-sm font-bold text-yellow-600">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-[var(--foreground-muted)] underline cursor-pointer">{mockReviews.length} Değerlendirme</span>
            </div>

            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-bold text-emerald-600">₺{product.price}</span>
              {product.oldPrice && <span className="text-xl line-through text-[var(--foreground-muted)]">₺{product.oldPrice}</span>}
            </div>

            {/* Ödeme Seçenekleri */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                <CreditCard size={14} /> Kredi Kartı
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                🚪 Kapıda Ödeme
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                🏦 Havale/EFT
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" rightIcon={<ShoppingBag size={18} />}>
                Sepete Ekle
              </Button>
            </div>

            {/* Kargo & İade ikonları */}
            <div className="grid sm:grid-cols-3 gap-4 border-t border-[var(--border)] pt-6">
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

        {/* ============ ÜRÜN AÇIKLAMASI ============ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-display mb-4 pb-3 border-b border-[var(--border)]">Ürün Açıklaması</h2>
          <div className="prose prose-sm max-w-none text-[var(--foreground-muted)] leading-relaxed space-y-3">
            <p>
              <strong className="text-[var(--foreground)]">{product.name}</strong>, evcil hayvanınızın ihtiyaçlarını karşılamak için özenle tasarlanmıştır. 
              Premium malzemeler kullanılarak üretilen bu ürün, uzun ömürlü kullanım için dayanıklı yapısı ile öne çıkmaktadır.
            </p>
            <p>
              Veteriner kontrolünden geçmiş ve uluslararası kalite standartlarını karşılamış bu ürün, hem köpekler hem de kediler için idealdir. 
              Can dostunuzun sağlığını ve mutluluğunu ön planda tutan <strong className="text-[var(--foreground)]">{product.brand}</strong> markasının güvencesiyle sunulmaktadır.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-4">
              <li>%100 doğal ve güvenli içerik</li>
              <li>Veteriner onaylı formül</li>
              <li>Kolay kullanım ve temizlik</li>
              <li>Çevre dostu ambalaj</li>
              <li>Türkiye'de dağıtım garantisi</li>
            </ul>
          </div>
        </section>

        {/* ============ TAKSİT SEÇENEKLERİ ============ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-display mb-4 pb-3 border-b border-[var(--border)]">
            <CreditCard size={20} className="inline mr-2 text-blue-500" />
            Kredi Kartı Taksit Seçenekleri
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface-secondary)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--foreground)]">Banka</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--foreground)]">3 Taksit</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--foreground)]">6 Taksit</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--foreground)]">9 Taksit</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--foreground)]">12 Taksit</th>
                </tr>
              </thead>
              <tbody>
                {mockInstallments.map((bank, i) => (
                  <tr key={bank.bank} className={i % 2 === 0 ? 'bg-white' : 'bg-[var(--surface-secondary)]/50'}>
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span>{bank.logo}</span> {bank.bank}
                    </td>
                    {[3, 6, 9, 12].map(n => (
                      <td key={n} className="px-4 py-3 text-center text-emerald-700 font-semibold">
                        ₺{installmentPrice(n)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">* Fiyatlar aylık taksit tutarlarını göstermektedir. Faizsiz taksit bankaya göre değişebilir.</p>
        </section>

        {/* ============ DEĞERLENDİRMELER ============ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-display mb-4 pb-3 border-b border-[var(--border)]">Değerlendirmeler</h2>
          
          {/* Özet */}
          <div className="flex items-center gap-6 mb-8 p-5 bg-[var(--surface-secondary)] rounded-2xl">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-500">{avgRating.toFixed(1)}</div>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <div className="text-xs text-[var(--foreground-muted)] mt-1">{mockReviews.length} yorum</div>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5,4,3,2,1].map(star => {
                const count = mockReviews.filter(r => r.rating === star).length;
                const pct = (count / mockReviews.length) * 100;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-right">{star}</span>
                    <Star size={11} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-4 text-[var(--foreground-muted)]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yorum listesi */}
          <div className="space-y-4">
            {mockReviews.map(review => (
              <div key={review.id} className="p-5 bg-white border border-[var(--border)] rounded-2xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-sm">{review.avatar}</div>
                    <div>
                      <div className="font-semibold text-sm">{review.name}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={13} className={i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ İPTAL & İADE KOŞULLARI ============ */}
        <section className="mb-12">
          <details className="border border-[var(--border)] rounded-2xl overflow-hidden group">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer bg-[var(--surface-secondary)] hover:bg-gray-100 transition-colors list-none">
              <span className="font-bold text-[var(--foreground)] flex items-center gap-2">
                <RefreshCw size={18} className="text-orange-500" />
                İptal & İade Koşulları
              </span>
              <ChevronDown size={18} className="text-[var(--foreground-muted)] group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 py-5 text-sm text-[var(--foreground-muted)] space-y-3 leading-relaxed">
              <p><strong className="text-[var(--foreground)]">İptal Hakkı:</strong> Siparişinizi kargoya verilmeden önce iptal edebilirsiniz. Kargoya verildikten sonra iade prosedürü geçerlidir.</p>
              <p><strong className="text-[var(--foreground)]">İade Süreci:</strong> Ürünü teslim aldıktan itibaren 30 gün içinde iade talebinde bulunabilirsiniz. Kullanılmamış ve orijinal ambalajında olması gerekmektedir.</p>
              <p><strong className="text-[var(--foreground)]">Para İadesi:</strong> Onaylanan iadeler 3-7 iş günü içinde ödeme yönteminize iade edilir.</p>
              <p><strong className="text-[var(--foreground)]">Kargo:</strong> İade kargo ücreti alıcıya aittir. Hasarlı veya yanlış ürün gönderimlerinde kargo ücreti tarafımızca karşılanır.</p>
              <Link href="/iptal-iade" className="inline-block mt-2 text-[var(--brand-primary)] font-semibold hover:underline">
                Detaylı İptal & İade Politikasını Oku →
              </Link>
            </div>
          </details>
        </section>

      </div>
    </div>
  );
}
