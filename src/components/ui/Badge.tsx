'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type BadgeVariant =
  | 'brand'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'sahibinde'
  | 'barinakta'
  | 'kayip'
  | 'ciftlestirme';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-orange-100 text-orange-700 border border-orange-200',
  secondary: 'bg-sky-100 text-sky-700 border border-sky-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  neutral: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
  sahibinde: 'tag-sahibinde',
  barinakta: 'tag-barinakta',
  kayip: 'tag-kayip',
  ciftlestirme: 'bg-purple-100 text-purple-700 border border-purple-200',
};

export function Badge({ variant = 'neutral', size = 'md', dot = false, className, children, ...props }: BadgeProps) {
  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
      )}
      {children}
    </span>
  );
}

// Animal type badge
export function AnimalBadge({ type }: { type: 'kopek' | 'kedi' | 'kus' }) {
  const map = {
    kopek: { emoji: '🐶', label: 'Köpek' },
    kedi: { emoji: '🐱', label: 'Kedi' },
    kus: { emoji: '🐦', label: 'Kuş' },
  };
  const item = map[type];
  return (
    <Badge variant="neutral" className="gap-1">
      <span>{item.emoji}</span>
      {item.label}
    </Badge>
  );
}

// Owner type badge
export function OwnerBadge({ type }: { type: 'sahibinde' | 'barinakta' }) {
  return (
    <Badge variant={type}>
      {type === 'sahibinde' ? '🏠 Sahibinde' : '🏛️ Barınakta'}
    </Badge>
  );
}

export default Badge;
