'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-dark)] focus-visible:ring-[var(--brand-primary)] shadow-sm hover:shadow-md hover:shadow-orange-200',
      secondary:
        'bg-[var(--brand-secondary)] text-white hover:opacity-90 focus-visible:ring-[var(--brand-secondary)]',
      outline:
        'border border-orange-200 bg-orange-50/50 text-orange-700 hover:bg-orange-100/80 hover:border-orange-300 focus-visible:ring-[var(--brand-primary)] shadow-sm font-semibold rounded-2xl',
      ghost:
        'text-[var(--foreground-muted)] bg-transparent hover:bg-[var(--neutral-100)] hover:text-[var(--foreground)] focus-visible:ring-[var(--brand-primary)]',
      danger:
        'bg-[var(--danger)] text-white hover:opacity-90 focus-visible:ring-[var(--danger)]',
      gradient:
        'gradient-brand text-white shadow-md hover:opacity-95 focus-visible:ring-orange-400 shadow-brand',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-xs rounded-lg',
      sm: 'h-8 px-3.5 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'xs' || size === 'sm' ? 14 : 16} />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
