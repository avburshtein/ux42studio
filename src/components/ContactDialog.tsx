'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/Dialog';
import Field from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ctaButtonClass } from '@/components/portfolio/CtaButton';
import {
    CONTACT_HONEYPOT_FIELD,
    contactFormSchema,
    type ContactFormData,
} from '@/lib/contactForm';
import { CONTACT_EMAIL } from '@/lib/contact';
import { sendContactMessage } from '@/lib/actions/contact';
import type { ButtonVariant } from '@/lib/mainPageContent';

type ContactDialogProps = {
    /** Текст кнопки-триггера: «Contact us», «Say hi». */
    label: string;
    variant?: ButtonVariant;
    /** Иконка Mail — как у кнопок контакта (CtaSection). */
    icon?: boolean;
    /** Источник для письма студии: 'Home', 'For designers', 'Designer page: …'. */
    source: string;
    /** Чей профиль — определяет адрес получателя (настройки дизайнера). */
    profileId?: string;
    /** Адрес в строке «Prefer email?» — фолбэк, если форма не работает. */
    fallbackEmail?: string;
    className?: string;
    /** Класс кнопки-триггера (по умолчанию пилюля ctaButtonClass).
     *  Пункт меню шапки передаёт свой стиль вместо пилюли. */
    triggerClassName?: string;
};

/**
 * Форма обратной связи в модалке («Contact us»).
 *
 * Кнопка визуально неотличима от `CtaButton` (общий `ctaButtonClass`),
 * содержимое собрано из `ui/*` по дизайн-системе (§3.5 оверлеи, §3.3 поля).
 * Отправка — серверный экшн `sendContactMessage`: валидация, honeypot и
 * rate limit живут на сервере; клиент только показывает состояние.
 *
 * Публичный UI — EN (§6.1).
 */
export default function ContactDialog({
    label,
    variant = 'primary',
    icon = false,
    source,
    profileId,
    fallbackEmail,
    className,
    triggerClassName,
}: ContactDialogProps) {
    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: { name: '', email: '', message: '', [CONTACT_HONEYPOT_FIELD]: '' },
    });

    // Успех заменяет форму: фокус переводим на кнопку Close, иначе он
    // теряется вместе с unmount-ем кнопки Submit (DS §5.1).
    useEffect(() => {
        if (sent) closeRef.current?.focus();
    }, [sent]);

    const onOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) {
            // Закрытие = чистая форма при следующем открытии.
            reset();
            setSent(false);
            setError(null);
        }
    };

    const onSubmit = async (data: ContactFormData) => {
        setSending(true);
        setError(null);
        try {
            const result = await sendContactMessage(data, { source, profileId });
            if (result.ok) {
                setSent(true);
                reset();
            } else {
                setError(result.error);
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const fallback = fallbackEmail ?? CONTACT_EMAIL.hello;
    const fallbackLink = (
        <a
            href={`mailto:${fallback}`}
            className='text-primary underline underline-offset-2 transition-opacity hover:opacity-80'
        >
            {fallback}
        </a>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button
                    type='button'
                    className={triggerClassName ?? ctaButtonClass(variant, className)}
                >
                    {icon && <Mail size={24} aria-hidden />}
                    {label}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='pr-8'>
                        {sent ? 'Message sent' : 'Contact us'}
                    </DialogTitle>
                    {!sent && (
                        <DialogDescription>
                            Tell us about your project — we usually reply within
                            two business days.
                        </DialogDescription>
                    )}
                </DialogHeader>

                {sent ? (
                    <div role='status' className='flex flex-col gap-4'>
                        <p className='flex items-start gap-3 text-body-md text-on-surface'>
                            <CheckCircle2
                                size={20}
                                className='mt-1 shrink-0 text-primary'
                                aria-hidden
                            />
                            Thanks! Your message is on its way — we will get back to you soon.
                        </p>
                        <p className='text-body-sm text-on-surface-variant'>
                            Prefer email? {fallbackLink}
                        </p>
                        <DialogFooter className='pt-2'>
                            <Button ref={closeRef} type='button' onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col'>
                        <Field
                            id='contact-name'
                            label='Name *'
                            error={errors.name?.message}
                            hint='How should we address you?'
                        >
                            <Input
                                id='contact-name'
                                autoComplete='name'
                                placeholder='Alex Rivera'
                                {...register('name')}
                            />
                        </Field>
                        <Field
                            id='contact-email'
                            label='Email *'
                            error={errors.email?.message}
                            hint='We will reply to this address'
                        >
                            <Input
                                id='contact-email'
                                type='email'
                                autoComplete='email'
                                placeholder='you@company.com'
                                {...register('email')}
                            />
                        </Field>
                        <Field
                            id='contact-message'
                            label='Message *'
                            error={errors.message?.message}
                            hint='A few lines about your project'
                        >
                            <Textarea id='contact-message' rows={4} {...register('message')} />
                        </Field>

                        {/*
                            Honeypot: display:none (автозаполнение его не видит,
                            в отличие от offscreen), без label, имя нейтральное,
                            tabIndex -1. Боты заполняют всё, что есть в DOM —
                            непустое поле означает бота.
                        */}
                        <div aria-hidden='true' className='hidden'>
                            <input
                                id='contact-hp'
                                type='text'
                                name={CONTACT_HONEYPOT_FIELD}
                                tabIndex={-1}
                                autoComplete='off'
                                defaultValue=''
                                onChange={(e) =>
                                    setValue(CONTACT_HONEYPOT_FIELD, e.target.value, {
                                        shouldDirty: false,
                                    })
                                }
                            />
                        </div>

                        <p
                            role={error ? 'alert' : undefined}
                            className='min-h-[1.5rem] pt-1 text-body-sm text-error'
                        >
                            {error ?? ''}
                        </p>

                        <p className='text-body-sm text-on-surface-variant'>
                            By sending this message you agree to our{' '}
                            <Link
                                href='/privacy'
                                className='text-primary underline underline-offset-2 transition-opacity hover:opacity-80'
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>

                        <DialogFooter className='mt-2 sm:justify-between'>
                            <p className='text-body-sm text-on-surface-variant'>
                                Prefer email? {fallbackLink}
                            </p>
                            <Button type='submit' disabled={sending}>
                                {sending ? 'Sending…' : 'Send message'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
