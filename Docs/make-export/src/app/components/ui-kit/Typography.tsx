import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const headingVariants = cva('font-["Inter:Medium",sans-serif] text-gray-900 dark:text-white', {
  variants: {
    level: {
      h1: 'text-[48px] md:text-[56px] lg:text-[64px]',
      h2: 'text-[36px] md:text-[42px] lg:text-[48px]',
      h3: 'text-[28px] md:text-[32px] lg:text-[36px]',
      h4: 'text-[20px] md:text-[24px]',
      h5: 'text-[18px] md:text-[20px]',
      h6: 'text-[16px] md:text-[18px]',
    },
    font: {
      inter: 'font-["Inter:Medium",sans-serif]',
      poppins: 'font-["Poppins:Medium",sans-serif]',
    },
  },
  defaultVariants: {
    level: 'h2',
    font: 'inter',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, font, as, children, ...props }, ref) => {
    const Component = as || level || 'h2';
    return (
      <Component
        ref={ref as any}
        className={`${headingVariants({ level: level || (as as any), font })} ${className || ''}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Heading.displayName = 'Heading';

const textVariants = cva('font-["Inter:Regular",sans-serif]', {
  variants: {
    size: {
      xs: 'text-[12px]',
      sm: 'text-[14px]',
      base: 'text-[16px]',
      lg: 'text-[18px] md:text-[20px]',
      xl: 'text-[20px] md:text-[24px]',
    },
    color: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-[rgba(18,21,14,0.71)] dark:text-gray-400',
      muted: 'text-[rgba(18,21,14,0.5)] dark:text-gray-500',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'primary',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, color, as = 'p', children, ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref as any}
        className={`${textVariants({ size, color })} ${className || ''}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Text.displayName = 'Text';

export { Heading, Text, headingVariants, textVariants };
