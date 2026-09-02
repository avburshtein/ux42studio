import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-["Inter:Medium",sans-serif] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300',
  {
    variants: {
      variant: {
        primary: 'text-white',
        secondary: 'bg-white dark:bg-[rgba(40,40,40,0.95)] border-2 border-[rgba(11,110,79,0.9)] text-[rgba(11,110,79,0.9)] dark:text-white',
        outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
        ghost: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
      },
      size: {
        sm: 'px-[16px] py-[6px] text-[12px] rounded-[24px]',
        md: 'px-[20px] py-[10px] text-[14px] md:text-[16px] rounded-[24px]',
        lg: 'px-[24px] py-[12px] text-[16px] md:text-[18px] rounded-[24px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  gradient?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, gradient = true, children, style, ...props }, ref) => {
    const gradientStyle = variant === 'primary' && gradient
      ? {
          backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
          ...style,
        }
      : style;

    return (
      <div
        ref={ref}
        className={`${badgeVariants({ variant, size })} ${className || ''}`}
        style={gradientStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
