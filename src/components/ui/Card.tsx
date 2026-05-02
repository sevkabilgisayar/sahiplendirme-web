'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'glass' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  hover = false,
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm',
    glass: 'glass-card',
    flat: 'bg-[var(--surface-secondary)] border border-[var(--border-subtle)]',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <div
      className={cn(
        'rounded-2xl',
        variants[variant],
        paddings[padding],
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-[var(--brand-primary-light)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 pb-4 border-b border-[var(--border)]', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold text-[var(--foreground)] font-display', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-[var(--border)]', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
