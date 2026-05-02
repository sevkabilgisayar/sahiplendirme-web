'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, MessageCircle, Search, Heart, Stethoscope } from 'lucide-react';

const quickActions = [
  { label: 'Yapay Zekâ Danışman', href: '/ai-danisman', icon: <MessageCircle size={18} />, desc: 'Soru sor, bilgi al' },
  { label: 'Hayvan Bul', href: '/ai-danisman/hayvan-bul', icon: <Search size={18} />, desc: 'Sana uygun hayvan' },
  { label: 'Durum Analizi', href: '/ai-danisman/analiz', icon: <Stethoscope size={18} />, desc: 'Fotoğraf ile analiz' },
  { label: 'Çiftleştirme Önerisi', href: '/ai-danisman/ciftlestirme', icon: <Heart size={18} />, desc: 'Uygun eş bul' },
];

export default function AIChatFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="p-4 gradient-brand text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} />
              <span className="font-bold font-display">Yapay Zekâya Sor</span>
            </div>
            <p className="text-xs text-white/80">AI destekli danışman hizmetimiz</p>
          </div>
          <div className="p-2">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-secondary)] transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white flex items-center justify-center text-[var(--brand-primary)] transition-colors flex-shrink-0">
                  {action.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold">{action.label}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-3 border-t border-[var(--border)]">
            <p className="text-[10px] text-[var(--foreground-muted)] text-center">
              ⚠️ AI danışman teşhis ve tedavi önerisi sunmaz.
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-[var(--foreground)] text-white rotate-90'
            : 'gradient-brand text-white shadow-brand animate-pulse-brand'
        }`}
      >
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
      </button>
    </div>
  );
}
