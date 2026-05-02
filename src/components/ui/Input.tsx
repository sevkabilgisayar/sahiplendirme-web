'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
            {props.required && <span className="text-[var(--danger)] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--foreground-muted)] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              'w-full h-11 rounded-xl border bg-[var(--surface)] text-[var(--foreground)]',
              'placeholder:text-[var(--foreground-muted)]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-4',
              (isPassword || rightElement) ? 'pr-11' : 'pr-4',
              error
                ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                : 'border-[var(--border)] hover:border-[var(--brand-primary)]',
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {!isPassword && rightElement && (
            <div className="absolute right-3 flex items-center">{rightElement}</div>
          )}
        </div>

        {error && (
          <p className="text-xs text-[var(--danger)] flex items-center gap-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--foreground-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  minChars?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, minChars, className, id, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-[var(--danger)] ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          value={value}
          className={cn(
            'w-full min-h-28 rounded-xl border bg-[var(--surface)] text-[var(--foreground)]',
            'placeholder:text-[var(--foreground-muted)]',
            'px-4 py-3 resize-none transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
              : 'border-[var(--border)] hover:border-[var(--brand-primary)]',
            className
          )}
          {...props}
        />

        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
            {hint && !error && <p className="text-xs text-[var(--foreground-muted)]">{hint}</p>}
          </div>
          {minChars && (
            <p className={cn(
              'text-xs',
              currentLength >= minChars ? 'text-[var(--success)]' : 'text-[var(--foreground-muted)]'
            )}>
              {currentLength}/{minChars}+
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
