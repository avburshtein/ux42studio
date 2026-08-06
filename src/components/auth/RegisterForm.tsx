'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';

export default function RegisterForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [invite, setInvite] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [createdPassword, setCreatedPassword] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setCreatedPassword(null);
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, invite }),
            });

            const data = (await res.json().catch(() => ({}))) as {
                message?: string;
                password?: string;
                ok?: boolean;
            };

            if (res.ok) {
                if (data.password) {
                    setCreatedPassword(data.password);
                } else {
                    router.push('/admin');
                }
                return;
            }

            setError(data?.message || 'Ошибка регистрации');
        } catch (err) {
            setError('Сетевая ошибка');
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = () => {
        if (!createdPassword) return;
        navigator.clipboard.writeText(createdPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (createdPassword) {
        return (
            <div className='space-y-4 rounded-lg bg-emerald-50/50 p-6 border border-emerald-200 text-emerald-950'>
                <h3 className='font-semibold text-lg'>Регистрация завершена</h3>
                <p className='text-sm text-emerald-800'>
                    Сохраните сгенерированный пароль. Он потребуется для входа с других устройств:
                </p>
                
                <div className='flex items-center gap-2 bg-white p-3 rounded-md border border-emerald-300 font-mono text-base justify-between'>
                    <span className='font-bold select-all'>{createdPassword}</span>
                    <Button 
                        type='button' 
                        onClick={copyToClipboard}
                        className='text-xs px-3 py-1 h-auto bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border-none'
                    >
                        {copied ? 'Скопировано!' : 'Скопировать'}
                    </Button>
                </div>

                <div className='pt-2 flex justify-end'>
                    <Button onClick={() => router.push('/admin')}>
                        Я сохранил пароль — Перейти в панель
                    </Button>
                </div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor='invite'>Код инвайта</Label>
                <Input
                    id='invite'
                    value={invite}
                    onChange={(e) => setInvite(e.target.value)}
                />
            </div>
            {error && <p className='text-sm text-red-600'>{error}</p>}
            <div className='flex justify-end'>
                <Button type='submit' disabled={loading}>
                    {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </Button>
            </div>
        </form>
    );
}