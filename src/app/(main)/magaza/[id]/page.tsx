'use client';

import { useState } from 'react';
import { mockStoreProducts } from '@/lib/mock-data';
import Link from 'next/link';
import { ChevronRight, Star, ShoppingBag, Truck, Shield, RefreshCw, CreditCard, CheckCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('description');

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
              <span className="text-sm text-[var(--foreground-muted)] underline cursor-pointer" onClick={() => setActiveTab('reviews')}>{mockReviews.length} Değerlendirme</span>
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

        {/* ============ TABS ============ */}
        <div className="border-b border-[var(--border)] mb-8 flex overflow-x-auto hide-scrollbar gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 px-2 font-bold text-base whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Ürün Açıklaması
          </button>
          <button
            onClick={() => setActiveTab('installments')}
            className={`pb-4 px-2 font-bold text-base whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'installments'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Taksit Seçenekleri
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-2 font-bold text-base whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Değerlendirmeler ({mockReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('return-policy')}
            className={`pb-4 px-2 font-bold text-base whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'return-policy'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            İptal & İade
          </button>
        </div>

        {/* ============ TAB CONTENT ============ */}
        <div className="min-h-[400px]">
          {activeTab === 'description' && (
            <div className="prose prose-sm sm:prose max-w-none text-[var(--foreground-muted)] leading-relaxed space-y-6">
              <p className="text-lg">
                <strong className="text-[var(--foreground)]">{product.name}</strong>, evcil hayvanınızın ihtiyaçlarını karşılamak için özenle tasarlanmıştır. 
                Premium malzemeler kullanılarak üretilen bu ürün, uzun ömürlü kullanım için dayanıklı yapısı ile öne çıkmaktadır.
              </p>
              
              {/* Rich HTML Content Example (Images, Headings, Highlights) */}
              <div className="grid sm:grid-cols-2 gap-8 my-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Veteriner Onaylı Kalite</h3>
                  <p className="mb-4">
                    Veteriner kontrolünden geçmiş ve uluslararası kalite standartlarını karşılamış bu ürün, hem köpekler hem de kediler için idealdir.
                    Laboratuvar testlerinden tam not almıştır.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[var(--foreground)] font-medium">
                    <li>%100 doğal ve güvenli içerik</li>
                    <li>Alerjen içermeyen yapı</li>
                    <li>Kolay temizlenebilir materyal</li>
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-[var(--border)]">
                  <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop" alt="Detay Görseli" className="w-full h-auto" />
                </div>
              </div>

              <div className="bg-[var(--surface-secondary)] p-6 rounded-2xl border border-[var(--border)]">
                <h4 className="font-bold text-[var(--foreground)] mb-2">Kullanım Talimatı:</h4>
                <p>Paketi açtıktan sonra serin ve kuru bir yerde muhafaza ediniz. Ürün direkt güneş ışığına maruz bırakılmamalıdır. Günlük önerilen kullanım miktarını aşmayınız.</p>
              </div>
            </div>
          )}

          {activeTab === 'installments' && (
            <div>
              <div className="flex items-center gap-3 mb-6 bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100">
                <CreditCard size={20} />
                <span className="font-medium text-sm">Aşağıdaki banka kartlarına peşin fiyatına taksit imkanı sunulmaktadır.</span>
              </div>
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
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Özet */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border)]">
                <div className="text-center sm:w-40 border-b sm:border-b-0 sm:border-r border-[var(--border)] pb-4 sm:pb-0 sm:pr-6">
                  <div className="text-6xl font-bold text-yellow-500">{avgRating.toFixed(1)}</div>
                  <div className="flex items-center gap-1 justify-center mt-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} className={i <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <div className="text-sm font-medium text-[var(--foreground-muted)] mt-2">{mockReviews.length} değerlendirme</div>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {[5,4,3,2,1].map(star => {
                    const count = mockReviews.filter(r => r.rating === star).length;
                    const pct = (count / mockReviews.length) * 100;
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-4 text-right font-medium">{star}</span>
                        <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-[var(--foreground-muted)] text-xs font-medium">%{pct.toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yorum listesi */}
              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="p-6 bg-white border border-[var(--border)] rounded-2xl shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-base shadow-sm">{review.avatar}</div>
                        <div>
                          <div className="font-bold text-[var(--foreground)]">{review.name}</div>
                          <div className="text-xs text-[var(--foreground-muted)] flex items-center gap-2 mt-0.5">
                            {review.date}
                            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              <CheckCircle size={10} /> Satın Aldı
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={14} className={i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'return-policy' && (
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <RefreshCw size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-[var(--foreground)]">İade ve İptal Prosedürü</h3>
                  <p className="text-sm text-[var(--foreground-muted)] mt-1">Sahiplendirme.com güvencesiyle 30 gün içinde kolay iade.</p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-[var(--foreground-muted)] leading-relaxed">
                <div>
                  <strong className="text-[var(--foreground)] block mb-1 text-base">İptal Hakkı:</strong> 
                  Siparişinizi kargoya verilmeden önce iptal edebilirsiniz. Siparişiniz kargoya verildikten sonra iptal edilemez, ancak ürün elinize ulaştığında iade prosedürü başlatabilirsiniz.
                </div>
                <div>
                  <strong className="text-[var(--foreground)] block mb-1 text-base">İade Süreci:</strong> 
                  Ürünü teslim aldıktan itibaren <strong>30 gün</strong> içinde hiçbir gerekçe göstermeksizin iade talebinde bulunabilirsiniz. İade edilecek ürünün kullanılmamış, etiketleri koparılmamış ve orijinal ambalajında olması gerekmektedir.
                </div>
                <div>
                  <strong className="text-[var(--foreground)] block mb-1 text-base">Para İadesi:</strong> 
                  Depomuza ulaşan ve iade şartlarına uygunluğu onaylanan ürünlerin ücret iadesi, <strong>3-7 iş günü</strong> içinde ödeme yaptığınız kredi kartına/hesaba aktarılır.
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <strong className="text-[var(--foreground)] block mb-1 text-base">Kargo Ücreti:</strong> 
                  Anlaşmalı olduğumuz kargo firması (MNG Kargo) ile gönderilen iadelerde kargo ücreti <strong className="text-emerald-600">tarafımızca karşılanır</strong>. Farklı bir kargo firması tercih ederseniz ücret alıcıya aittir. Hasarlı veya yanlış ürün gönderimlerinde tüm masraflar bize aittir.
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
