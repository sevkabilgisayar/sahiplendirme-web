'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    } catch (error) {
      toast.error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-10 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Bize Ulaşın</h1>
          <p className="text-lg text-[var(--foreground-muted)]">
            Sorularınız, önerileriniz veya işbirlikleri için bizimle iletişime geçmekten çekinmeyin. Ekibimiz size en kısa sürede dönüş yapacaktır.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
              <h3 className="font-bold text-xl mb-6">İletişim Bilgileri</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">E-Posta Adresimiz</p>
                    <a href="mailto:info@sahiplendirme.com" className="font-bold hover:text-[var(--brand-primary)] transition-colors">
                      info@sahiplendirme.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">Telefon</p>
                    <a href="tel:+908500000000" className="font-bold hover:text-[var(--brand-primary)] transition-colors">
                      +90 (850) 000 00 00
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">Merkez Ofis</p>
                    <p className="font-bold">
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[var(--border)] shadow-sm relative overflow-hidden">
              {success ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-8 text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <Send size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Mesajınız Alındı!</h3>
                  <p className="text-[var(--foreground-muted)] mb-8">
                    Geri bildiriminiz için teşekkür ederiz. Destek ekibimiz en kısa sürede sizinle iletişime geçecektir.
                  </p>
                  <Button variant="outline" onClick={() => setSuccess(false)}>Yeni Mesaj Gönder</Button>
                </div>
              ) : null}

              <h2 className="text-2xl font-bold mb-6">Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input 
                    label="Adınız Soyadınız" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder="Örn: Ahmet Yılmaz" 
                  />
                  <Input 
                    label="Telefon Numaranız" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Örn: 0555 555 5555" 
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input 
                    label="E-Posta Adresiniz" 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    placeholder="Örn: ahmet@mail.com" 
                  />
                  <Input 
                    label="Konu" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required 
                    placeholder="Örn: İşbirliği Talebi" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[var(--foreground-base)]">
                    Mesajınız
                  </label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
                    placeholder="Mesajınızı buraya yazabilirsiniz..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    variant="gradient" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    isLoading={loading}
                    leftIcon={<Send size={18} />}
                  >
                    Mesajı Gönder
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
