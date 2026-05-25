'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Package, ShoppingBag, Plus, Upload, X, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { CITIES, DISTRICTS_BY_CITY } from '@/constants';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/Map'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-400 animate-pulse">Harita Yükleniyor...</div>
});

export default function SellerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'orders' | 'settings'>('products');
  const [data, setData] = useState<any>({ products: [], services: [], orderItems: [] });
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  
  // Service Modal States
  const [serviceCity, setServiceCity] = useState('');
  const [serviceDistrict, setServiceDistrict] = useState('');
  const [serviceNeighborhood, setServiceNeighborhood] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.0082, 28.9784]);

  const geocodeLocation = async (c: string, d: string, n?: string) => {
    try {
      const q = [n, d, c, 'Turkey'].filter(Boolean).join(', ');
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
      const geo = await res.json();
      if (geo && geo.length > 0) {
        setMapCenter([parseFloat(geo[0].lat), parseFloat(geo[0].lon)]);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // Upload States
  const [productPhotos, setProductPhotos] = useState<File[]>([]);
  const [productPhotoPreviews, setProductPhotoPreviews] = useState<string[]>([]);

  const [servicePhoto, setServicePhoto] = useState<File | null>(null);
  const [servicePhotoPreview, setServicePhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/seller/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        router.push('/');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - productPhotos.length);
    const updatedPhotos = [...productPhotos, ...newFiles].slice(0, 5);
    setProductPhotos(updatedPhotos);
    setProductPhotoPreviews(updatedPhotos.map(f => URL.createObjectURL(f)));
  };

  const removePhoto = (idx: number) => {
    const updated = productPhotos.filter((_, i) => i !== idx);
    setProductPhotos(updated);
    setProductPhotoPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const productData = Object.fromEntries(formData.entries());

    let imageUrl = 'https://via.placeholder.com/300';
    let imagesArr: string[] = [];

    if (productPhotos.length > 0) {
      const uploadData = new FormData();
      productPhotos.forEach(file => uploadData.append('file', file));
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (uploadRes.ok) {
        const uploadJson = await uploadRes.json();
        if (uploadJson.urls && uploadJson.urls.length > 0) {
          imageUrl = uploadJson.urls[0];
          imagesArr = uploadJson.urls;
        }
      }
    }

    try {
      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, image: imageUrl, images: imagesArr })
      });
      if (res.ok) {
        toast.success('Ürün başarıyla eklendi!', {
          description: 'Ürününüz mağazanızda yayına alınmıştır.'
        });
        setShowProductModal(false);
        setProductPhotos([]);
        setProductPhotoPreviews([]);
        fetchData();
      } else {
        toast.error('Ürün eklenirken bir hata oluştu.');
      }
    } catch (e) {
      toast.error('Ürün eklenirken bir hata oluştu.');
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const serviceData = Object.fromEntries(formData.entries());

    let imageUrl = 'https://via.placeholder.com/300';
    if (servicePhoto) {
      const uploadData = new FormData();
      uploadData.append('file', servicePhoto);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (uploadRes.ok) {
        const uploadJson = await uploadRes.json();
        imageUrl = uploadJson.urls[0];
      }
    }

    try {
      const res = await fetch('/api/services/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...serviceData, 
          image: imageUrl,
          latitude: mapCenter[0],
          longitude: mapCenter[1]
        })
      });
      if (res.ok) {
        toast.success('Hizmet ilanı başarıyla yayınlandı!');
        setShowServiceModal(false);
        fetchData();
      } else {
        const errJson = await res.json();
        toast.error(errJson.error || 'Bir hata oluştu.');
      }
    } catch (e) {
      toast.error('Hizmet eklenirken bir hata oluştu.');
    }
  };

  // Settings state & submit
  const [avatarPhoto, setAvatarPhoto] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const settingsData = Object.fromEntries(formData.entries());

    let avatarUrl = data.user?.avatar;
    if (avatarPhoto) {
      const uploadData = new FormData();
      uploadData.append('file', avatarPhoto);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (uploadRes.ok) {
        const uploadJson = await uploadRes.json();
        avatarUrl = uploadJson.urls[0];
      }
    }

    try {
      const res = await fetch('/api/seller/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settingsData, avatar: avatarUrl })
      });
      if (res.ok) {
        toast.success('Mağaza ayarları başarıyla güncellendi!');
        fetchData();
      } else {
        toast.error('Ayarlar güncellenirken bir hata oluştu.');
      }
    } catch (e) {
      toast.error('Sistemsel bir hata oluştu.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">Yükleniyor...</div>;

  return (
    <div className="bg-[var(--background)] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Mağaza / Satıcı Paneli</h1>
              <p className="text-sm text-[var(--foreground-muted)]">Ürünlerinizi, hizmetlerinizi ve siparişlerinizi yönetin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={activeTab === 'products' ? 'gradient' : 'outline'} onClick={() => setActiveTab('products')}>
              Ürünlerim ({data.products.length})
            </Button>
            <Button variant={activeTab === 'services' ? 'gradient' : 'outline'} onClick={() => setActiveTab('services')}>
              Hizmetlerim ({data.services.length})
            </Button>
            <Button variant={activeTab === 'orders' ? 'gradient' : 'outline'} onClick={() => setActiveTab('orders')}>
              Siparişler ({data.orderItems.length})
            </Button>
            <Button variant={activeTab === 'settings' ? 'gradient' : 'outline'} onClick={() => setActiveTab('settings')}>
              Mağaza Ayarları
            </Button>
          </div>
        </div>

        {/* Content */}
        {data.status === 'pending' ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-8 rounded-3xl text-center flex flex-col items-center">
            <Store size={48} className="text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Hesabınız Onay Bekliyor</h2>
            <p className="max-w-md">Kurum / Barınak başvurunuz tarafımıza ulaşmıştır. Güvenlik ve doğrulama süreçleri tamamlandıktan sonra hesabınız aktifleştirilecek ve bu panel üzerinden ücretsiz hizmet veya ürün yayınlayabileceksiniz.</p>
          </div>
        ) : (
          <>
            {activeTab === 'products' && (
              <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Mağaza Ürünleriniz</h3>
              <Button onClick={() => setShowProductModal(true)} rightIcon={<Plus size={16}/>}>Yeni Ürün Ekle</Button>
            </div>
            {data.products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.products.map((p: any) => (
                  <div key={p.id} className="bg-white border border-[var(--border)] rounded-2xl p-4 flex flex-col">
                    <img src={p.image} className="w-full h-32 object-cover rounded-xl mb-3" alt={p.name} />
                    <div className="font-bold text-sm mb-1 line-clamp-1">{p.name}</div>
                    <div className="text-emerald-600 font-bold mb-2">₺{p.price}</div>
                    <div className="text-xs text-[var(--foreground-muted)] mb-3">Stok: {p.stock} adet</div>
                    <Button variant="outline" size="sm" className="mt-auto w-full text-red-500 border-red-200 hover:bg-red-50">Sil</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-[var(--border)] text-[var(--foreground-muted)]">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Henüz mağazanıza eklenmiş bir ürün bulunmuyor.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Verdiğiniz Hizmetler</h3>
              <Button onClick={() => setShowServiceModal(true)} rightIcon={<Plus size={16}/>}>Yeni Hizmet Ekle</Button>
            </div>
            {data.services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.services.map((s: any) => (
                  <div key={s.id} className="bg-white border border-[var(--border)] rounded-3xl p-5 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{s.category}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{s.name}</h4>
                    <p className="text-xs text-[var(--foreground-muted)] mb-3 flex items-center gap-1"><MapPin size={12}/> {s.district}, {s.city}</p>
                    <p className="font-bold text-emerald-600 mb-4">{s.price}</p>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" size="sm" fullWidth>Düzenle</Button>
                      <Button variant="outline" size="sm" fullWidth className="text-red-500 border-red-200 hover:bg-red-50">Sil</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-[var(--border)] text-[var(--foreground-muted)]">
                <Store size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Henüz bir hizmet ilanı oluşturmadınız.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Gelen Siparişler</h3>
            {data.orderItems.length > 0 ? (
              <div className="bg-white border border-[var(--border)] rounded-3xl overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[var(--border)] text-[var(--foreground-muted)]">
                      <th className="p-4 font-medium">Sipariş Kodu</th>
                      <th className="p-4 font-medium">Ürün</th>
                      <th className="p-4 font-medium">Müşteri</th>
                      <th className="p-4 font-medium">Tarih</th>
                      <th className="p-4 font-medium text-right">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {data.orderItems.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono text-xs text-[var(--foreground-muted)]">#{item.orderId.split('-')[0]}</td>
                        <td className="p-4 font-semibold">
                          {item.product?.name} <span className="text-xs text-[var(--foreground-muted)] font-normal ml-2">x{item.quantity}</span>
                        </td>
                        <td className="p-4">{item.order?.user?.firstName} {item.order?.user?.lastName}</td>
                        <td className="p-4 text-[var(--foreground-muted)]">{new Date(item.order?.createdAt).toLocaleDateString('tr-TR')}</td>
                        <td className="p-4 text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                            item.order?.status === 'tamamlandi' ? 'bg-green-100 text-green-700' :
                            item.order?.status === 'iptal_edildi' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {item.order?.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-[var(--border)] text-[var(--foreground-muted)]">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Henüz mağazanızdan bir ürün siparişi verilmemiş.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Mağaza / Profil Ayarları</h3>
            <div className="bg-white border border-[var(--border)] rounded-3xl p-6 md:p-8">
              <form className="space-y-6" onSubmit={handleSettingsSubmit}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-bold mb-2">Mağaza Logosu</label>
                    <label className="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAvatarPhoto(e.target.files[0]);
                          setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }} />
                      {avatarPreview || data.user?.avatar ? (
                        <img src={avatarPreview || data.user?.avatar} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-500">
                          <Upload size={24} className="mx-auto mb-2" />
                          <span className="text-xs">Logo Yükle</span>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">Mağaza / Firma Adı (Ad)</label>
                        <input type="text" name="firstName" defaultValue={data.user?.firstName || ''} required className="w-full border border-[var(--border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Soyad</label>
                        <input type="text" name="lastName" defaultValue={data.user?.lastName || ''} required className="w-full border border-[var(--border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Mağaza Açıklaması / Slogan</label>
                      <textarea name="storeDescription" rows={3} defaultValue={data.user?.storeDescription || ''} placeholder="Müşterilerinize mağazanızdan bahsedin..." className="w-full border border-[var(--border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none resize-none"></textarea>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[var(--border)]">
                  <div>
                    <label className="block text-sm font-bold mb-1">İletişim Numarası</label>
                    <input type="tel" name="phone" defaultValue={data.user?.phone || ''} className="w-full border border-[var(--border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">İl</label>
                    <input type="text" name="city" defaultValue={data.user?.city || ''} className="w-full border border-[var(--border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">İlçe</label>
                    <input type="text" name="district" defaultValue={data.user?.district || ''} className="w-full border border-[var(--border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold mb-1">Açık Adres</label>
                    <input type="text" name="address" defaultValue={data.user?.address || ''} placeholder="Mağazanızın açık adresi..." className="w-full border border-[var(--border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="gradient">Ayarları Kaydet</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        </>
        )}

        {/* Modals */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-lg">Yeni Ürün Ekle</h3>
                <button onClick={() => setShowProductModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"><X size={16}/></button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Ürün Adı</label>
                    <input type="text" name="name" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Marka</label>
                      <input type="text" name="brand" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Kategori</label>
                      <select name="category" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[var(--brand-primary)] outline-none">
                        <option value="kopek-mamasi">Köpek Maması</option>
                        <option value="kedi-mamasi">Kedi Maması</option>
                        <option value="oyuncak">Oyuncak & Eğitim</option>
                        <option value="aksesuar">Aksesuar & Kıyafet</option>
                        <option value="bakim-saglik">Bakım & Sağlık Ürünleri</option>
                        <option value="tasma">Tasma & Gezdirme</option>
                        <option value="kum-tuvalet">Kedi Kumu & Tuvalet</option>
                        <option value="diger">Diğer Ürünler</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Fiyat (₺)</label>
                      <input type="number" step="0.01" name="price" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Stok Adedi</label>
                      <input type="number" name="stock" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Açıklama</label>
                    <textarea name="description" required rows={3} className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Ürün Görselleri (İlk seçilen kapak fotoğrafı olur)</label>
                    <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--surface-secondary)]">
                      <input type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => handlePhotos(e.target.files)} />
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                        <Upload size={20} className="text-[var(--brand-primary)]" />
                      </div>
                      <span className="font-bold mb-1 text-sm">Görselleri seçmek için tıklayın</span>
                      <span className="text-xs text-[var(--foreground-muted)]">Max 5 görsel — {productPhotos.length}/5</span>
                    </label>

                    {productPhotoPreviews.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                        {productPhotoPreviews.map((src, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] group">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={12} />
                            </button>
                            {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-[var(--brand-primary)] text-white px-1.5 py-0.5 rounded font-bold">Kapak</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit" variant="gradient" fullWidth className="py-4 mt-4">Ürünü Kaydet ve Yayınla</Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {showServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-lg">Yeni Hizmet İlanı Ver</h3>
                <button onClick={() => setShowServiceModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"><X size={16}/></button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Hizmet / Firma Adı</label>
                    <input type="text" name="name" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Kategori</label>
                      <select name="category" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50">
                        <option value="veteriner">Veteriner Hekim</option>
                        <option value="kuafor">Pet Kuaför</option>
                        <option value="egitmen">Köpek Eğitmeni</option>
                        <option value="pet-otel">Pet Otel</option>
                        <option value="gezdirici">Köpek Gezdirici</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Ücret Bilgisi</label>
                      <input type="text" name="price" placeholder="Örn: 200₺ / Gün" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">İl</label>
                      <select name="city" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50"
                        value={serviceCity}
                        onChange={(e) => {
                          setServiceCity(e.target.value);
                          setServiceDistrict('');
                          geocodeLocation(e.target.value, '');
                        }}
                      >
                        <option value="">İl Seçin</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">İlçe</label>
                      {serviceCity && DISTRICTS_BY_CITY[serviceCity as keyof typeof DISTRICTS_BY_CITY] ? (
                        <select name="district" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50"
                          value={serviceDistrict}
                          onChange={(e) => {
                            setServiceDistrict(e.target.value);
                            geocodeLocation(serviceCity, e.target.value);
                          }}
                        >
                          <option value="">İlçe Seçin</option>
                          {DISTRICTS_BY_CITY[serviceCity as keyof typeof DISTRICTS_BY_CITY]?.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      ) : (
                        <input type="text" name="district" required placeholder="İlçe girin" className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50"
                          value={serviceDistrict}
                          onChange={(e) => setServiceDistrict(e.target.value)}
                          onBlur={() => geocodeLocation(serviceCity, serviceDistrict)}
                          disabled={!serviceCity}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Detaylı Adres (Mahalle vb.)</label>
                    <input type="text" name="address" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50"
                      value={serviceNeighborhood}
                      onChange={(e) => setServiceNeighborhood(e.target.value)}
                      onBlur={() => geocodeLocation(serviceCity, serviceDistrict, serviceNeighborhood)}
                    />
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">Girdiğiniz adres haritada otomatik işaretlenir veya haritaya tıklayıp yerinizi seçebilirsiniz.</p>
                  </div>
                  
                  {/* Harita Entegrasyonu */}
                  <div className="h-64 rounded-2xl border border-[var(--border)] relative overflow-hidden z-0 mt-4 cursor-crosshair">
                    <Map 
                      center={mapCenter} 
                      zoom={15} 
                      popupText="Hizmet Noktası" 
                      onLocationSelect={(lat, lng) => setMapCenter([lat, lng])}
                    />
                  </div>
                  <div>
                    <input type="text" placeholder="Veya buraya Google Maps bağlantısını yapıştırın (Örn: https://maps.app.goo.gl/...)" 
                      className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50 text-sm"
                      onChange={(e) => {
                        const val = e.target.value;
                        const match = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                        if (match) {
                          setMapCenter([parseFloat(match[1]), parseFloat(match[2])]);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Telefon</label>
                    <input type="tel" name="phone" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Hizmetler (Virgülle ayırın)</label>
                    <input type="text" name="servicesInput" placeholder="Örn: Aşılama, Kısırlaştırma, Röntge" required className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Hakkında</label>
                    <textarea name="about" required rows={3} className="w-full border border-[var(--border)] rounded-xl p-3 bg-gray-50 resize-none"></textarea>
                  </div>
                  <Button type="submit" variant="gradient" fullWidth className="py-4 mt-4">Hizmeti Yayınla</Button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
