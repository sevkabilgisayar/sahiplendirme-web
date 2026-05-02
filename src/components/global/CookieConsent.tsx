'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <Cookie size={28} className="text-[var(--brand-primary)] flex-shrink-0" />
        <div className="flex-1 text-sm text-[var(--foreground-muted)] text-center sm:text-left">
          Deneyiminizi iyileştirmek için çerezler kullanıyoruz.{' '}
          <Link href="/cerez" className="text-[var(--brand-primary)] hover:underline font-medium">
            Çerez Politikası
          </Link>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={reject}>Reddet</Button>
          <Button variant="gradient" size="sm" onClick={accept}>Kabul Et</Button>
        </div>
      </div>
    </div>
  );
}
