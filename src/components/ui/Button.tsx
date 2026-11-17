import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    // M3 State Layer (спека Docs/ui/figma-master-components-spec.md §4):
    // полупрозрачный оверлей цвета on-* ПОВЕРХ контента — hover 8%,
    // focus 10%, pressed 16%. Цвет оверлея задаёт вариант (after:bg-on-*).
    // after:rounded-[inherit] наследует радиус от call-site (rounded-full
    // и т.п.), after:pointer-events-none не ловит клики.
    'relative after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-150 hover:after:opacity-[0.08] focus-visible:after:opacity-[0.10] active:after:opacity-[0.16] inline-flex items-center justify-center rounded-md text-button font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                default:
                    'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] after:bg-on-primary',
                destructive:
                    // error/on-error, а не error-container/on-error-container:
                    // пара контейнеров в светлой теме давала 2.4:1 (LH
                    // color-contrast); error/on-error ≈ 5.8:1 (светлая) и
                    // ≈ 5.7:1 (тёмная)
                    'bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] after:bg-on-error',
                outline:
                    'border border-[var(--md-sys-color-outline)] bg-transparent text-[var(--md-sys-color-on-surface)] after:bg-on-surface',
                secondary:
                    'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] after:bg-on-secondary-container',
                ghost: 'bg-transparent text-[var(--md-sys-color-on-surface)] after:bg-on-surface',
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
