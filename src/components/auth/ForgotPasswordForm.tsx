'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';

/**
 * Запрос сброса пароля. Ответ сервера всегда одинаковый (существует ли
 * email — не раскрывается), поэтому и здесь после отправки показывается
 * одна и та же нейтральная формулировка.
 */
export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const data = (await res
                    .json()
                    .catch(() => ({}))) as { message?: string };
                setError(data?.message || 'Не удалось отправить письмо');
                return;
            }
            setSent(true);
        } catch {
            setError('Сетевая ошибка');
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div>
                <p className='mb-4 text-body-md text-on-surface'>
                    Если аккаунт с таким email существует, письмо со ссылкой
                    «Придумать новый пароль» уже отправлено. Оно приходит
                    обычно за минуту — проверьте и папку «Спам».
                </p>
                <p className='mb-6 text-body-sm text-on-surface-variant'>
                    Ссылка работает один раз и действует час. Не запрашивали
                    сброс? Просто игнорируйте письмо — текущий пароль
                    продолжит работать.
                </p>
                <Link
                    href='/login'
                    className='text-body-md text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                >
                    Вернуться к входу
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className='space-y-4'>
            <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                    id='email'
                    type='email'
                    required
                    autoComplete='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            {error && (
                <p role='alert' className='text-body-sm text-error'>
                    {error}
                </p>
            )}
            <div className='flex items-center justify-between gap-4'>
                <Link
                    href='/login'
                    className='text-body-sm text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                >
                    Вернуться к входу
                </Link>
                <Button type='submit' disabled={loading}>
                    {loading ? 'Отправляю…' : 'Восстановить пароль'}
                </Button>
            </div>
        </form>
    );
}
