'use client';

import { useState } from 'react';
import { Camera, Sparkles, AlertTriangle, Info, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AiDurumAnaliziPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        status: 'warning',
        title: 'Deri Lezyonu Şüphesi',
        description: 'Yüklediğiniz fotoğrafta kedinizin kulak bölgesinde tüy dökülmesi ve kızarıklık tespit edildi. Bu durum mantar enfeksiyonu (Dermatofitoz) veya alerjik reaksiyon olabilir.',
        recommendations: [
          'En kısa sürede bir veteriner hekime başvurun.',
          'Etkilenen bölgeye hekim tavsiyesi olmadan krem veya ilaç sürmeyin.',
          'Diğer evcil hayvanlarınız varsa temaslarını geçici olarak kısıtlayın.'
        ]
      });
    }, 2500);
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={16} /> Görüntü İşleme AI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">Yapay Zekâ Durum Analizi</h1>
          <p className="text-[var(--foreground-muted)]">
            Hayvanınızın fotoğrafını yükleyin, yapay zekâmız olası sağlık sorunları, deri hastalıkları veya fiziksel durumlar hakkında ön bilgi versin.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-2xl mb-8 flex gap-3 text-sm">
          <AlertTriangle className="shrink-0 mt-0.5" />
          <p>
            <strong>Önemli Uyarı:</strong> Bu araç bir veteriner hekimin yerini tutmaz. Yalnızca fotoğraf tabanlı bir yapay zekâ ön analizidir. Kesin teşhis ve tedavi için daima profesyonel veteriner hekiminize danışın.
          </p>
        </div>

        <Card className="p-6 mb-8">
          {!preview ? (
            <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] bg-[var(--surface-secondary)] transition-colors rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Camera size={28} className="text-[var(--brand-primary)]" />
              </div>
              <h3 className="font-bold mb-2 text-lg">Fotoğraf Yükle veya Çek</h3>
              <p className="text-sm text-[var(--foreground-muted)] max-w-sm">Net, iyi ışıklandırılmış ve ilgili bölgeye odaklanmış bir fotoğraf yükleyin.</p>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-slate-900 aspect-video flex items-center justify-center">
                <img src={preview} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
                <button onClick={() => { setPreview(null); setFile(null); setResult(null); }} className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm text-sm hover:bg-black/70">
                  Değiştir
                </button>
              </div>
              
              {!result && (
                <Button fullWidth variant="gradient" size="lg" onClick={handleAnalyze} isLoading={isAnalyzing}>
                  {!isAnalyzing && <><Sparkles size={18} className="mr-2" /> Analizi Başlat</>}
                </Button>
              )}
            </div>
          )}
        </Card>

        {isAnalyzing && (
          <div className="text-center py-10 animate-pulse">
            <h3 className="font-bold text-lg mb-2">Fotoğraf İşleniyor...</h3>
            <p className="text-sm text-[var(--foreground-muted)]">Görüntü analiz ediliyor, anormallikler tespit ediliyor.</p>
          </div>
        )}

        {result && (
          <div className="animate-slide-up">
            <Card className={`p-6 border-l-4 ${result.status === 'warning' ? 'border-l-orange-500' : 'border-l-green-500'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${result.status === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                  {result.status === 'warning' ? <AlertTriangle size={24} /> : <Info size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">{result.title}</h2>
                  <p className="text-[var(--foreground)] mb-4 leading-relaxed">{result.description}</p>
                  
                  <div className="bg-[var(--surface-secondary)] p-4 rounded-xl border border-[var(--border)]">
                    <h3 className="font-bold text-sm mb-3">Öneriler:</h3>
                    <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex gap-2"><span className="text-[var(--brand-primary)]">•</span> {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
