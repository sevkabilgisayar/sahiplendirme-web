'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Phone, Info, Tag as TagIcon, Scissors, Stethoscope, GraduationCap, Building, Footprints, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';

const CATEGORIES = [
  { id: 'veteriner', label: 'Veteriner Kliniği', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'kuafor', label: 'Pet Kuaför', icon: Scissors, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'egitmen', label: 'Eğitmen', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'otel', label: 'Pet Otel', icon: Building, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'gezdirici', label: 'Köpek Gezdirici', icon: Footprints, color: 'text-emerald-500', bg: 'bg-emerald-50' }
];

export default function HizmetIlaniVerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          if (data.user.accountType !== 'profesyonel' && data.user.role !== 'admin') {
            toast.error('Bu özellik sadece Profesyonel üyelere açıktır.');
            router.push('/profil');
          } else {
            setUser(data.user);
            setIsAuthChecking(false);
          }
        } else {
          router.push('/login');
        }
      });
  }, [router]);

  // Kategorileri filtrele
  const allowedCategories = (user?.accountType === 'profesyonel' || user?.role === 'admin') ? 
                            (user?.role === 'admin' ? CATEGORIES : CATEGORIES.filter(c => user?.allowedServices?.includes(c.id))) 
                            : [];

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    about: '',
    city: '',
    district: '',
    address: '',
    phone: '',
    price: '',
    servicesInput: '', // Virgülle ayrılmış
    tagsInput: '', // Virgülle ayrılmış
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.city || !formData.phone) {
      toast.error('Lütfen zorunlu alanları (Ad, Kategori, Şehir, Telefon) doldurun.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/services/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İlan oluşturulamadı');

      toast.success('Hizmet İlanınız Başarıyla Yayına Alındı! 🎉');
      setTimeout(() => {
        router.push('/profil');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Hizmet İlanı Oluştur</h1>
        <p className="text-[var(--foreground-muted)]">
          Uzmanlık alanınızı detaylandırarak daha fazla hayvan sahibine ulaşın.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-xl shadow-[var(--brand-primary)]/5">
        
        {/* Adım İlerleyişi */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>
          
          <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${step >= 1 ? 'bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {step > 1 ? <CheckCircle2 size={20} /> : '1'}
            </div>
            <span className="text-xs font-semibold">Kategori Seçimi</span>
          </div>

          <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${step >= 2 ? 'bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
            <span className="text-xs font-semibold">Profil Detayları</span>
          </div>
        </div>

        {/* STEP 1: Category Selection */}
        {step === 1 && (
          <div className="animate-slide-up">
            {isAuthChecking ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
              </div>
            ) : allowedCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--danger)] font-bold mb-4">Henüz yetkili olduğunuz bir hizmet kategorisi bulunmuyor.</p>
                <p className="text-[var(--foreground-muted)] text-sm">Sadece satın aldığınız abonelik paketlerine ait ilanları yayınlayabilirsiniz.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-6 text-center">Hangi Alanda İlan Vermek İstiyorsunuz?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allowedCategories.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all group hover:scale-[1.02] active:scale-95 ${isSelected ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'border-[var(--border)] hover:border-[var(--brand-primary)]/40 hover:bg-gray-50'}`}
                      >
                        <div className={`p-4 rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                          <Icon size={32} />
                        </div>
                        <span className="font-semibold text-[var(--foreground)]">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: Details Form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            
            {/* Fotoğraf Upload Alanı (Görsel temsil) */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[var(--brand-primary)] transition-colors mb-3">
                <Camera size={28} />
              </div>
              <span className="font-semibold text-sm text-gray-600">Vitrin Fotoğrafı Ekle (Yakında)</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">İşletme / Uzman Adı *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Info size={18} />
                  </div>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleChange}
                    placeholder="Örn: PatiPark Köpek Oteli"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">İletişim Telefonu *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="text" name="phone" required value={formData.phone} onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">Hakkında & Deneyimler</label>
              <textarea 
                name="about" rows={4} value={formData.about} onChange={handleChange}
                placeholder="Müşterilerinize kendinizden, vizyonunuzdan ve sunduğunuz ayrıcalıklardan bahsedin..."
                className="w-full p-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">Şehir *</label>
                <input 
                  type="text" name="city" required value={formData.city} onChange={handleChange}
                  placeholder="Örn: İstanbul"
                  className="w-full h-12 px-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">İlçe</label>
                <input 
                  type="text" name="district" value={formData.district} onChange={handleChange}
                  placeholder="Örn: Kadıköy"
                  className="w-full h-12 px-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">Açık Adres (Opsiyonel)</label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <textarea 
                  name="address" rows={2} value={formData.address} onChange={handleChange}
                  placeholder="Kliniğinizin veya işletmenizin açık adresi..."
                  className="w-full py-3 pl-11 pr-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">Alt Hizmetler (Virgülle Ayırın)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Scissors size={18} />
                  </div>
                  <input 
                    type="text" name="servicesInput" value={formData.servicesInput} onChange={handleChange}
                    placeholder="Örn: Tıraş, Banyo, Tırnak Kesimi"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">Uzmanlık Etiketleri</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <TagIcon size={18} />
                  </div>
                  <input 
                    type="text" name="tagsInput" value={formData.tagsInput} onChange={handleChange}
                    placeholder="Örn: #kedipsikolojisi, #büyükırk"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 ml-1">Başlangıç Fiyatı veya Politika</label>
              <input 
                type="text" name="price" value={formData.price} onChange={handleChange}
                placeholder="Örn: 500₺'den başlayan fiyatlarla veya İletişime Geçiniz"
                className="w-full h-12 px-4 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
              />
            </div>

            <div className="pt-6 flex gap-4">
              <Button type="button" variant="outline" className="h-14 w-1/3" onClick={() => setStep(1)}>
                Geri Dön
              </Button>
              <Button type="submit" variant="gradient" className="h-14 flex-1 shadow-lg shadow-[var(--brand-primary)]/20" isLoading={isLoading}>
                İlanı Yayınla
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
