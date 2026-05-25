'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, AlertCircle, RefreshCcw, Camera, Image, Heart, Search, Stethoscope, History } from 'lucide-react';
import Button from '@/components/ui/Button';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

const SUGGESTED_QUESTIONS = [
  "Küçük bir apartman dairesi için hangi kedi ırkları daha uygundur?",
  "Golden Retriever cinsi köpeğimin tüy dökmesini nasıl azaltabilirim?",
  "Muhabbet kuşumun daha hızlı konuşmasını nasıl sağlayabilirim?",
  "Yavru kediler için ilk aşı takvimi nasıl olmalıdır?",
];

const AI_MODES = [
  { id: 'genel', label: 'Genel Soru', icon: <Sparkles size={16} />, desc: 'Her türlü soru' },
  { id: 'irk', label: 'Irk Tespiti', icon: <Camera size={16} />, desc: 'Fotoğraftan ırk bul' },
  { id: 'saglik', label: 'Sağlık Analizi', icon: <Stethoscope size={16} />, desc: 'Semptom analizi' },
  { id: 'eslestir', label: 'Eşleştirme', icon: <Heart size={16} />, desc: 'Sana uygun hayvan' },
];

const CHAT_HISTORY = [
  { id: '1', title: 'Kedi ırkı önerisi', date: 'Bugün' },
  { id: '2', title: 'Köpek tüy bakımı', date: 'Dün' },
  { id: '3', title: 'Kuş beslenme takvimi', date: '28 Nis' },
];

export default function AiAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! Ben Sahiplendirme.com Yapay Zeka Danışmanı 🐾\n\nSize şu konularda yardımcı olabilirim:\n• **Irk tespiti** — Fotoğraf yükleyin, ırkı anında tanıyayım\n• **Sağlık analizi** — Semptomları yazın, ön değerlendirme yapayım\n• **Hayvan eşleştirme** — Yaşam koşullarınıza göre size uygun hayvanı bulayım\n• **Genel sorular** — Beslenme, bakım, eğitim ve daha fazlası\n\n⚠️ *Not: Teşhis ve tedavi önerisi sunmam. Sağlık sorunlarında mutlaka veterinere başvurun.*',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState('genel');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: activeMode,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response }
      ]);
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: `⚠️ Hata: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: 'Fotoğraf yüklendi — ırk analizi yapılıyor...', image: url };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Analiz yapılamadı');
      }

      const { data } = resData;
      let responseText = `📸 **Irk Analizi Sonucu**\n\n🔍 Algılanan: **${data.anaIrk}**\n📊 Güven skoru: %${data.guvenSkor}\n\n`;
      
      if (data.alternatifIrklar && data.alternatifIrklar.length > 0) {
        responseText += `*Olası ırk karışımları:*\n`;
        data.alternatifIrklar.forEach((alt: any) => {
          responseText += `• ${alt.irk} (%${alt.oran})\n`;
        });
        responseText += '\n';
      }

      if (data.ozellikler && data.ozellikler.length > 0) {
        responseText += `*Özellikler:* ${data.ozellikler.join(', ')}\n\n`;
      }

      responseText += `*Genel Bilgi:*\n${data.genelBilgi}\n\n`;
      responseText += `*Sahiplendirme Bilgisi:*\n${data.sahiplendirmeBilgisi}`;

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Hata: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] h-[850px] max-h-[calc(100vh-80px)] flex flex-col md:flex-row max-w-7xl mx-auto border-x border-[var(--border)] overflow-hidden">

      {/* Sidebar */}
      <div className="hidden md:flex w-80 bg-[var(--surface)] border-r border-[var(--border)] flex-col">
        <div className="p-4 border-b border-[var(--border)] space-y-3">
          <Button variant="gradient" fullWidth className="justify-center gap-2 h-11" onClick={() => setMessages([messages[0]])}>
            <RefreshCcw size={16} /> Yeni Sohbet
          </Button>
          <Button variant="outline" fullWidth className="justify-center gap-2 h-11" onClick={() => setShowHistory(!showHistory)}>
            <History size={16} /> Geçmiş {showHistory ? '▲' : '▼'}
          </Button>
        </div>

        {/* Chat History */}
        {showHistory && (
          <div className="border-b border-[var(--border)] p-3 space-y-1">
            {CHAT_HISTORY.map((h) => (
              <button key={h.id} className="w-full text-left p-2.5 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors text-sm">
                <div className="font-medium truncate">{h.title}</div>
                <div className="text-xs text-[var(--foreground-muted)]">{h.date}</div>
              </button>
            ))}
          </div>
        )}

        {/* AI Modes */}
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">AI Modu</h3>
          <div className="grid grid-cols-2 gap-2">
            {AI_MODES.map((mode) => (
              <button key={mode.id} onClick={() => setActiveMode(mode.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeMode === mode.id ? 'border-[var(--brand-primary)] bg-orange-50 text-[var(--brand-primary)]' : 'border-[var(--border)] hover:border-[var(--brand-primary-light)]'
                }`}>
                <div className="flex items-center gap-1.5 mb-0.5">{mode.icon}<span className="text-xs font-semibold">{mode.label}</span></div>
                <div className="text-[10px] text-[var(--foreground-muted)]">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Örnek Sorular</h3>
          <div className="flex flex-col gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button key={idx} onClick={() => handleSend(q)}
                className="text-left p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--brand-primary-light)] hover:text-[var(--brand-primary)] text-xs transition-all">
                {q}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <h4 className="flex items-center gap-2 font-bold text-blue-800 text-xs mb-2">
              <Sparkles size={14} /> AI Özellikleri
            </h4>
            <ul className="text-[11px] text-blue-700 space-y-1.5 list-disc pl-4">
              <li>Irk ve tür önerileri</li>
              <li>Beslenme ve bakım tavsiyeleri</li>
              <li>Fotoğraftan ırk tespiti</li>
              <li>Sağlık durumu ön analizi</li>
              <li>Hayvan eşleştirme önerisi</li>
              <li>İlan oluşturma yardımı</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[var(--surface-secondary)] relative">

        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-[var(--surface)] border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold font-display leading-tight">Yapay Zekâ Danışman</h2>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Çevrimiçi
            </div>
          </div>
          {/* Mobile mode indicator */}
          <span className="text-xs bg-orange-100 text-[var(--brand-primary)] px-2 py-1 rounded-lg font-semibold">
            {AI_MODES.find(m => m.id === activeMode)?.label}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                msg.role === 'assistant' ? 'gradient-brand text-white shadow-brand' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-white border border-[var(--border)] text-[var(--foreground)] rounded-tr-sm'
                  : 'bg-white border border-orange-100 text-[var(--foreground)] rounded-tl-sm'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="w-40 h-40 rounded-xl object-cover mb-2 border" />
                )}
                <div className="whitespace-pre-line" dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/•/g, '<span class="text-[var(--brand-primary)]">•</span>')
                }} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center gradient-brand text-white shadow-brand">
                <Bot size={18} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-orange-100 rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-2 text-center text-[11px] text-[var(--foreground-muted)] flex items-center justify-center gap-1.5 bg-[var(--surface-secondary)]">
          <AlertCircle size={11} />
          Yapay zekâ hata yapabilir. Acil veterinerlik durumlarında doğrudan uzman bir hekime başvurun.
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-5 bg-[var(--surface)] border-t border-[var(--border)]">
          <div className="max-w-4xl mx-auto flex gap-2 items-center">
            {/* Image upload for ırk tespiti */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary-light)] transition-colors flex-shrink-0 bg-[var(--background)]"
              title="Fotoğraf yükle (ırk tespiti)">
              <Image size={18} />
            </button>
            <div className="flex-1 relative">
              <input type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Yapay zekâ danışmanına bir soru sorun..."
                className="w-full h-12 pl-4 pr-12 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-sm"
                disabled={isLoading} />
              <Button variant="gradient" className="absolute right-1.5 top-1.5 bottom-1.5 w-9 p-0 rounded-lg"
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
