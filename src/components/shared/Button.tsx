
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    isLoading = false, 
    iconLeft, 
    iconRight,
    children, 
    disabled, 
    asChild,
    ...props 
  }, ref) => {
    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      primary: 'bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-200',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };

    const sizeStyles = {
      sm: 'h-9 px-3 rounded-md text-sm',
      md: 'h-10 px-4 py-2 rounded-md',
      lg: 'h-12 px-6 rounded-md text-lg',
      icon: 'h-10 w-10 rounded-full',
    };

    return (
      <button
        className={cn(
          'relative inline-flex items-center justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          isLoading && 'cursor-not-allowed',
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        <span className={cn('flex items-center gap-2', isLoading && 'invisible')}>
          {iconLeft && <span>{iconLeft}</span>}
          {children}
          {iconRight && <span>{iconRight}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
