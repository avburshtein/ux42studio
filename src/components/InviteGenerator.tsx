'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Copy, Check } from 'lucide-react';

type InviteGeneratorProps = {
    onCreated: (invite: { code: string }) => void;
};

export default function InviteGenerator({ onCreated }: InviteGeneratorProps) {
    const [email, setEmail] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setError(null);
        setIsGenerating(true);

        try {
            const body: Record<string, string> = {};
            if (email.trim()) body.email = email.trim();
            if (expiresAt) body.expiresAt = expiresAt;

            const res = await fetch('/api/admin/invites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as {
                    error?: string;
                };
                throw new Error(data.error ?? 'Failed to generate invite');
            }

            const invite = (await res.json()) as { code: string };
            setGeneratedCode(invite.code);
            onCreated(invite);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to generate invite',
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async () => {
        if (!generatedCode) return;
        try {
            await navigator.clipboard.writeText(generatedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback: select text
            const input = document.getElementById(
                'invite-code',
            ) as HTMLInputElement;
            if (input) {
                input.select();
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    return (
        <div className='space-y-4'>
            <div className='space-y-3'>
                <div className='space-y-1.5'>
                    <Label htmlFor='invite-email'>Email (optional)</Label>
                    <Input
                        id='invite-email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='user@example.com'
                    />
                </div>

                <div className='space-y-1.5'>
                    <Label htmlFor='invite-expires'>
                        Expires at (optional)
                    </Label>
                    <Input
                        id='invite-expires'
                        type='datetime-local'
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                    />
                </div>
            </div>

            <Button
                type='button'
                onClick={handleGenerate}
                disabled={isGenerating}
                aria-busy={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <svg
                            className='mr-2 h-4 w-4 animate-spin'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            aria-hidden='true'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            />
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                            />
                        </svg>
                        Generating...
                    </>
                ) : (
                    'Generate Invite'
                )}
            </Button>

            {error && (
                <p
                    className='text-label-sm text-[var(--md-sys-color-error)]'
                    role='alert'
                >
                    {error}
                </p>
            )}

            {generatedCode && (
                <div className='space-y-2 rounded-lg border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-variant)] p-4'>
                    <Label htmlFor='invite-code'>Invite Code</Label>
                    <div className='flex gap-2'>
                        <Input
                            id='invite-code'
                            value={generatedCode}
                            readOnly
                            className='font-mono text-body-md'
                            aria-label='Generated invite code'
                        />
                        <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={handleCopy}
                            aria-label={
                                copied
                                    ? 'Copied to clipboard'
                                    : 'Copy to clipboard'
                            }
                        >
                            {copied ? (
                                <Check className='h-4 w-4 text-[var(--md-sys-color-primary)]' />
                            ) : (
                                <Copy className='h-4 w-4' />
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
