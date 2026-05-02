'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, placeholder, options, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-[var(--danger)] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full h-11 rounded-xl border bg-[var(--surface)] text-[var(--foreground)] appearance-none',
              'pl-4 pr-10 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                : 'border-[var(--border)] hover:border-[var(--brand-primary)]',
              !props.value && 'text-[var(--foreground-muted)]',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
          />
        </div>

        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--foreground-muted)]">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
