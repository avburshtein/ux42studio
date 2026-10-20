'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { PasswordInput } from '../ui/PasswordInput';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';

/**
 * Установка нового пароля по одноразовой ссылке из письма.
 * Токен валидирует сервер; здесь — только совпадение и длина полей.
 */
export default function ResetPasswordForm({ token }: { token: string }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const hasToken = token.length > 0;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password.length < 8) {
            setError('Пароль должен быть не короче 8 символов');
            return;
        }
        if (password !== confirm) {
            setError('Пароли не совпадают');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            if (!res.ok) {
                const data = (await res
                    .json()
                    .catch(() => ({}))) as { message?: string };
                setError(data?.message || 'Не удалось сохранить пароль');
                return;
            }
            setDone(true);
        } catch {
            setError('Сетевая ошибка');
        } finally {
            setLoading(false);
        }
    }

    if (!hasToken) {
        return (
            <div>
                <p role='alert' className='mb-4 text-body-md text-on-surface'>
                    Ссылка неполная — в ней нет кода сброса. Запросите письмо
                    со сбросом ещё раз.
                </p>
                <Link
                    href='/forgot-password'
                    className='text-body-md text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                >
                    Запросить сброс пароля
                </Link>
            </div>
        );
    }

    if (done) {
        return (
            <div>
                <p className='mb-4 text-body-md text-on-surface'>
                    Готово — пароль обновлён. Теперь войдите с новым паролем
                    как обычно.
                </p>
                <Link
                    href='/login'
                    className='text-body-md text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                >
                    Войти с новым паролем
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className='space-y-4'>
            <div>
                <Label htmlFor='password'>Новый пароль</Label>
                <PasswordInput
                    id='password'
                    required
                    autoComplete='new-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className='mt-1 min-h-[1.5rem] text-body-sm text-on-surface-variant'>
                    Минимум 8 символов.
                </p>
            </div>
            <div>
                <Label htmlFor='confirm'>Повторите новый пароль</Label>
                <PasswordInput
                    id='confirm'
                    required
                    autoComplete='new-password'
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
                <p className='mt-1 min-h-[1.5rem] text-body-sm'>
                    {error ? (
                        <span role='alert' className='text-error'>
                            {error}
                        </span>
                    ) : null}
                </p>
            </div>
            <div className='flex justify-end'>
                <Button type='submit' disabled={loading}>
                    {loading ? 'Сохраняю…' : 'Сохранить пароль'}
                </Button>
            </div>
        </form>
    );
}
