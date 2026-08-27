import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[8px] font-["Inter:Medium",sans-serif] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]',
        secondary: 'bg-white dark:bg-[rgba(40,40,40,0.95)] border-2 border-[rgba(11,110,79,0.9)] text-[rgba(11,110,79,0.9)] dark:text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.05)] hover:bg-[rgba(11,110,79,0.05)] dark:hover:bg-[rgba(11,110,79,0.2)] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.15)]',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
        link: 'bg-transparent underline-offset-4 hover:underline text-[rgba(11,110,79,0.9)] dark:text-white',
      },
      size: {
        sm: 'px-[20px] py-[10px] text-[14px] rounded-[48px]',
        md: 'px-[24px] py-[12px] text-[16px] rounded-[48px]',
        lg: 'px-[32px] py-[16px] text-[16px] md:text-[18px] rounded-[48px]',
        icon: 'px-[16px] py-[8px] rounded-[48px]',
      },
      hover: {
        scale: 'hover:scale-105 active:scale-95',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      hover: 'scale',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  gradient?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, hover, gradient = true, children, style, ...props }, ref) => {
    const gradientStyle = variant === 'primary' && gradient
      ? {
          backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
          ...style,
        }
      : style;

    return (
      <button
        className={`${buttonVariants({ variant, size, hover })} ${className || ''}`}
        ref={ref}
        style={gradientStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
