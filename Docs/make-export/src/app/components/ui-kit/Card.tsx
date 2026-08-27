import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'bg-white dark:bg-[rgba(30,30,30,0.9)] rounded-[24px] transition-colors duration-300',
  {
    variants: {
      shadow: {
        none: '',
        sm: 'shadow-[2px_2px_4px_0px_rgba(0,0,0,0.05)]',
        md: 'shadow-[4px_4px_12px_0px_rgba(0,0,0,0.1)]',
        lg: 'shadow-[4px_4px_2px_0px_rgba(0,0,0,0.05),16px_9px_12px_-1px_rgba(242,242,242,0.86),10px_10px_8px_-2px_rgba(177,211,196,0.3)] dark:shadow-[4px_4px_2px_0px_rgba(255,255,255,0.05),16px_9px_12px_-1px_rgba(20,20,20,0.86),10px_10px_8px_-2px_rgba(11,110,79,0.2)]',
      },
      padding: {
        none: 'p-0',
        sm: 'p-[24px]',
        md: 'p-[32px]',
        lg: 'p-[48px]',
      },
      hover: {
        none: '',
        scale: 'transition-all duration-500 hover:scale-[1.02] cursor-pointer',
        shadow: 'hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] cursor-pointer',
        both: 'transition-all duration-500 hover:scale-[1.02] hover:shadow-[6px_6px_3px_0px_rgba(0,0,0,0.08),20px_12px_16px_-1px_rgba(242,242,242,0.9),12px_12px_10px_-2px_rgba(177,211,196,0.4)] cursor-pointer',
      },
    },
    defaultVariants: {
      shadow: 'md',
      padding: 'md',
      hover: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow, padding, hover, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${cardVariants({ shadow, padding, hover })} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col gap-[8px] ${className || ''}`}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`font-['Inter:Medium',sans-serif] text-[20px] md:text-[24px] text-gray-900 dark:text-white ${className || ''}`}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`font-['Inter:Regular',sans-serif] text-[14px] md:text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 ${className || ''}`}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center gap-[16px] ${className || ''}`}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
