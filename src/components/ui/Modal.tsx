'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  hideClose?: boolean;
}

export function Modal({ isOpen, onClose, title, size = 'md', children, hideClose = false }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-[var(--surface)] rounded-2xl shadow-2xl animate-scale-in',
          'border border-[var(--border)]',
          sizes[size]
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            {title && (
              <h2 className="text-lg font-bold text-[var(--foreground)] font-display">{title}</h2>
            )}
            {!hideClose && (
              <button
                onClick={onClose}
                className="ml-auto text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--neutral-100)] p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
