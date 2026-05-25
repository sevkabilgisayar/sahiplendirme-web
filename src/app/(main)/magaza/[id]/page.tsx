'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Star, ShoppingBag, Truck, Shield, RefreshCw, CreditCard, CheckCircle, MessageSquare, UserPlus, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';

const mockInstallments = [
  { bank: 'World', logo: '🟣' },
  { bank: 'Axess', logo: '🔴' },
  { bank: 'Maximum', logo: '🛑' },
  { bank: 'Bonus', logo: '🟢' },
  { bank: 'CardFinans', logo: '🔵' },
  { bank: 'Paraf', logo: '💠' },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState('3 KG');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
        } else {
          setError(data.error || 'Ürün bulunamadı');
        }
      })
      .catch(err => {
        setError('Bağlantı hatası');
      });
  }, [params.id]);

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0 ? reviews.reduce((a: any, r: any) => a + r.rating, 0) / reviews.length : 5.0;
  
  // Real gallery images or fallback
  let galleryImages = [product.image];
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed;
      }
    } catch (e) {}
  }
  
  if (galleryImages.length === 1) {
    // If only one image exists, add fallback mock images just for visual demo so it doesn't look empty
    galleryImages.push('https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop');
    galleryImages.push('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop');
  }

  const mockImages = galleryImages;

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
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Ana Görsel */}
            <div className="bg-[var(--surface-secondary)] rounded-3xl p-8 flex items-center justify-center border border-[var(--border)] overflow-hidden relative group h-[400px] sm:h-[500px]">
              {product.tag && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white font-bold px-3 py-1 rounded-xl text-sm z-10 shadow-sm">
                  {product.tag}
                </span>
              )}
              <img src={mockImages[selectedImage]} alt={product.name} className="w-full h-full object-contain rounded-2xl mix-blend-multiply transition-opacity duration-300" />
              
              <button 
                onClick={() => setSelectedImage(prev => (prev === 0 ? mockImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setSelectedImage(prev => (prev === mockImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Küçük Resimler (Thumbnails) */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
              {mockImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl border-2 overflow-hidden bg-[var(--surface-secondary)] transition-all p-2 ${
                    selectedImage === idx ? 'border-[var(--brand-primary)]' : 'border-transparent hover:border-[var(--border)]'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="text-sm text-emerald-600 font-bold mb-2 uppercase tracking-wide">{product.brand}</div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)] mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-[var(--foreground-muted)]">Satıcı:</span>
              <Link href="/satici/pati-dunyasi" className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
                Pati Dünyası
              </Link>
              <div className="flex items-center justify-center bg-green-500 text-white min-w-[28px] h-5 rounded text-[11px] font-bold ml-1 shadow-sm">
                9.8
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-emerald-600">₺{product.price}</span>
              {product.oldPrice && <span className="text-xl line-through text-[var(--foreground-muted)]">₺{product.oldPrice}</span>}
            </div>

            {/* ── VARYASYON SEÇİMİ ── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[var(--foreground)]">Ağırlık / Boyut Seçin</span>
                <span className="text-xs text-[var(--foreground-muted)] underline cursor-pointer">Beden Tablosu</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['1.5 KG', '3 KG', '10 KG', '15 KG'].map(v => (
                  <button 
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-bold transition-all ${
                      selectedVariant === v 
                        ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-emerald-50' 
                        : 'border-[var(--border)] text-[var(--foreground-muted)] bg-white hover:border-gray-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Kargo ve Stok Bilgisi */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                <Truck size={14} /> Bugün Kargoda
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                <span>🔥</span> Son 3 Ürün
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" rightIcon={<ShoppingBag size={18} />}>
                Sepete Ekle
              </Button>
            </div>

            {/* ── SATICI BİLGİSİ ── */}
            <div className="flex items-center gap-4 mb-10 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]/50">
              <Link href="/satici/pati-dunyasi" className="w-12 h-12 bg-white border border-[var(--border)] rounded-full flex items-center justify-center font-bold text-lg text-[var(--brand-primary)] shadow-sm hover:scale-105 transition-transform">
                PD
              </Link>
              <div className="flex-1">
                <div className="text-xs text-[var(--foreground-muted)] mb-0.5">Satıcı:</div>
                <Link href="/satici/pati-dunyasi" className="font-bold text-[var(--foreground)] hover:text-[var(--brand-primary)] flex items-center gap-1.5 transition-colors">
                  Pati Dünyası
                  <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <CheckCircle size={10} /> Onaylı
                  </span>
                </Link>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[var(--foreground-muted)] mb-1 uppercase tracking-wide font-medium">Mağaza Puanı</div>
                <div className="inline-flex items-center justify-center bg-green-500 text-white min-w-[36px] h-7 rounded-lg text-sm font-bold shadow-sm mb-2">
                  9.8
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-2">
                <button
                  onClick={() => setIsFollowing(f => !f)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                    isFollowing
                      ? 'bg-gray-100 text-[var(--foreground)] border-[var(--border)] hover:bg-gray-200'
                      : 'bg-[var(--brand-primary)] text-white border-transparent hover:bg-emerald-700'
                  }`}
                >
                  {isFollowing ? <><Check size={13} /> Takip Ediliyor</> : <><UserPlus size={13} /> Takip Et</>}
                </button>
                <button onClick={() => setActiveTab('qa')} className="flex items-center gap-1.5 px-3 py-2 border border-[var(--border)] bg-white rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                  <MessageSquare size={13} className="text-blue-500" /> Satıcıya Sor
                </button>
              </div>
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
        <div className="bg-white border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden mb-16">
          {/* Tab Bar */}
          <div className="border-b border-[var(--border)] flex overflow-x-auto hide-scrollbar gap-1 px-6 bg-gray-50">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Ürün Açıklaması
          </button>
          <button
            onClick={() => setActiveTab('installments')}
            className={`py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'installments'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Taksit Seçenekleri
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Değerlendirmeler ({(product.reviews || []).length})
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'qa'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Soru & Cevap (2)
          </button>
          <button
            onClick={() => setActiveTab('return-policy')}
            className={`py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'return-policy'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            İptal & İade
          </button>
        </div>

          {/* ============ TAB CONTENT ============ */}
          <div className="p-6 min-h-[400px]">
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

              {/* ── DİĞER ÜRÜN BİLGİLERİ ── */}
              <div className="not-prose mt-6">
                <div className="inline-block bg-[var(--brand-primary)] text-white text-sm font-bold px-3 py-1 rounded-md mb-0">
                  Diğer
                </div>
                <div className="border border-[var(--border)] rounded-b-xl rounded-tr-xl overflow-hidden">
                  {[
                    { label: 'Garanti Süresi (Ay)', value: '24' },
                    { label: 'Yurt Dışı Satış', value: 'Yok' },
                    { label: 'Stok Kodu', value: 'HBCV0000476LA0' },
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-[var(--border)] last:border-b-0`}>
                      <span className="text-[var(--foreground-muted)]">{row.label}</span>
                      <span className="font-medium text-[var(--foreground)] text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'installments' && (
            <div>
              <div className="flex items-center gap-3 mb-8 bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100">
                <CreditCard size={20} />
                <span className="font-medium text-sm">
                  Peşin fiyatına 3 taksit seçeneği tüm banka kartlarında geçerlidir. <strong className="text-violet-700">Renkli ve kalın</strong> yazılan tutarlar peşin fiyatına taksitleri gösterir.
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockInstallments.map((bank) => (
                  <div key={bank.bank} className="border border-[var(--border)] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-[var(--surface-secondary)] py-3 flex justify-center items-center border-b border-[var(--border)] font-bold text-[var(--foreground)] text-sm">
                      {bank.logo} <span className="ml-2 tracking-wide uppercase">{bank.bank}</span>
                    </div>
                    <table className="w-full text-xs">
                      <thead className="bg-white">
                        <tr>
                          <th className="text-left py-3 px-4 text-[var(--foreground-muted)] font-medium border-b border-[var(--border)]">Taksit</th>
                          <th className="text-right py-3 px-4 text-[var(--foreground-muted)] font-medium border-b border-[var(--border)]">Aylık Tutar</th>
                          <th className="text-right py-3 px-4 text-[var(--foreground-muted)] font-medium border-b border-[var(--border)]">Toplam Tutar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[2, 3, 6, 9].map((n) => {
                          // Peşin fiyatına taksitler (<= 3 ay)
                          const isPesin = n <= 3;
                          // Eğer peşin değilse ufak bir vade farkı (%3 aylık) ekliyoruz simulasyon için
                          const interestRate = isPesin ? 1 : (1 + (n * 0.03));
                          const total = product.price * interestRate;
                          const monthly = total / n;
                          
                          return (
                            <tr key={n} className="border-b border-[var(--border)] last:border-b-0 hover:bg-gray-50/50">
                              <td className={`py-3 px-4 ${isPesin ? 'font-bold text-violet-700' : 'text-[var(--foreground)]'}`}>
                                {n} taksit
                              </td>
                              <td className={`text-right py-3 px-4 ${isPesin ? 'font-bold text-violet-700' : 'text-[var(--foreground)]'}`}>
                                ₺{monthly.toFixed(2)}
                              </td>
                              <td className={`text-right py-3 px-4 ${isPesin ? 'font-bold text-violet-700' : 'text-[var(--foreground)]'}`}>
                                ₺{total.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Özet */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border)]">
                <div className="text-center sm:w-40 border-b sm:border-b-0 sm:border-r border-[var(--border)] pb-4 sm:pb-0 sm:pr-6">
                  <div className="text-6xl font-bold text-yellow-500">{product.rating.toFixed(1)}</div>
                  <div className="flex items-center gap-1 justify-center mt-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} className={i <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <div className="text-sm font-medium text-[var(--foreground-muted)] mt-2">{(product.reviews || []).length} değerlendirme</div>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {[5,4,3,2,1].map(star => {
                    const count = (product.reviews || []).filter((r: any) => r.rating === star).length;
                    const pct = (product.reviews || []).length > 0 ? (count / (product.reviews || []).length) * 100 : 0;
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
                {(product.reviews || []).length === 0 ? (
                  <div className="text-center py-10 text-[var(--foreground-muted)]">Henüz değerlendirme yapılmamış. İlk değerlendiren siz olun!</div>
                ) : (product.reviews || []).map((review: any) => (
                  <div key={review.id} className="p-6 bg-white border border-[var(--border)] rounded-2xl shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-base shadow-sm">{review.user?.firstName?.[0] || 'A'}</div>
                        <div>
                          <div className="font-bold text-[var(--foreground)]">{review.user?.firstName} {review.user?.lastName}</div>
                          <div className="text-xs text-[var(--foreground-muted)] flex items-center gap-2 mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString('tr-TR')}
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

          {activeTab === 'qa' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border)]">
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Satıcıya Sorunuz mu Var?</h3>
                  <p className="text-sm text-[var(--foreground-muted)] mt-1">Pati Dünyası mağazasına ürünle ilgili aklınıza takılanları sorabilirsiniz.</p>
                </div>
                <Button leftIcon={<MessageSquare size={16} />}>Soru Sor</Button>
              </div>

              {/* Soru Listesi */}
              <div className="space-y-4">
                {[
                  { id: 1, q: "Hangi kargo ile gönderim sağlıyorsunuz?", a: "Merhaba, MNG ve Yurtiçi kargo ile çalışmaktayız. İlginiz için teşekkür ederiz.", date: "12 Ocak 2024" },
                  { id: 2, q: "Son kullanma tarihi nedir?", a: "Merhabalar, güncel stoklarımızın SKT'si 08/2025'tir. Gönül rahatlığıyla tercih edebilirsiniz.", date: "5 Ocak 2024" },
                ].map(qa => (
                  <div key={qa.id} className="p-6 bg-white border border-[var(--border)] rounded-2xl shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-lg">S</div>
                      <div className="flex-1">
                        <div className="text-xs text-[var(--foreground-muted)] mb-1">{qa.date}</div>
                        <div className="font-medium text-[var(--foreground)] mb-5">{qa.q}</div>
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-[var(--border)] relative before:absolute before:-top-2 before:left-6 before:w-4 before:h-4 before:bg-gray-50 before:border-l before:border-t before:border-[var(--border)] before:rotate-45">
                          <div className="font-bold text-sm text-[var(--brand-primary)] mb-1 flex items-center gap-1.5">
                            Pati Dünyası <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Satıcı</span>
                          </div>
                          <div className="text-sm text-[var(--foreground-muted)]">{qa.a}</div>
                        </div>
                      </div>
                    </div>
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
        </div> {/* Tab Content End */}
      </div> {/* Card Wrapper End */}

        {/* ============ BENZER ÜRÜNLER ============ */}
        <div className="mt-16 pt-10 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold font-display text-[var(--foreground)] mb-6">İlginizi Çekebilir</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
