import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const textareaVariants = cva(
  'w-full font-["Inter:Regular",sans-serif] text-[16px] transition-colors duration-300 border resize-none focus:outline-none focus:ring-2 focus:ring-[rgba(11,110,79,0.3)]',
  {
    variants: {
      variant: {
        default: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white',
        filled: 'bg-[rgba(243,243,245,1)] dark:bg-[rgba(40,40,40,0.95)] border-transparent text-gray-900 dark:text-white',
        outline: 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
      },
      size: {
        sm: 'px-[24px] py-[12px] text-[14px] rounded-[24px]',
        md: 'px-[32px] py-[16px] text-[16px] rounded-[24px]',
        lg: 'px-[40px] py-[20px] text-[18px] rounded-[24px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={`${textareaVariants({ variant, size })} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
