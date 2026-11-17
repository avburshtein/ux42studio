import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-button font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                default:
                    // Pressed (M3 state layer, фидбэк 2026-11-17): opacity 0.9
                    // на hover, 0.8 на pressed — глубже hover, кнопка
                    // «проваливается».
                    'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:opacity-90 active:opacity-80',
                destructive:
                    // error/on-error, а не error-container/on-error-container:
                    // пара контейнеров в светлой теме давала 2.4:1 (LH
                    // color-contrast); error/on-error ≈ 5.8:1 (светлая) и
                    // ≈ 5.7:1 (тёмная)
                    'bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] hover:opacity-90 active:opacity-80',
                outline:
                    // Pressed: фон на ступень темнее hover (state layer 12%)
                    'border border-[var(--md-sys-color-outline)] bg-transparent text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-variant)] active:bg-[var(--md-sys-color-surface-container-high)]',
                secondary:
                    'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:opacity-90 active:opacity-80',
                ghost: 'bg-transparent text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-variant)] active:bg-[var(--md-sys-color-surface-container-high)]',
                link: 'bg-transparent text-[var(--md-sys-color-primary)] underline-offset-4 hover:underline active:opacity-80',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
