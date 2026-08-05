'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin');
                return;
            }

            const data = await res.json().catch(() => ({}));
            setError(data?.message || 'Ошибка входа');
        } catch (err) {
            setError('Сетевая ошибка');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className='space-y-4'>
            <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor='password'>Пароль</Label>
                <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <p className='text-sm text-red-600'>{error}</p>}
            <div className='flex justify-end'>
                <Button type='submit' disabled={loading}>
                    {loading ? 'Загрузка...' : 'Войти'}
                </Button>
            </div>
        </form>
    );
}
