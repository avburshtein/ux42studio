'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

type SocialLink = {
    id?: string;
    platform: string;
    title: string;
    url: string;
    order: number;
};

type SocialLinksEditorProps = {
    value: SocialLink[];
    onChange: (links: SocialLink[]) => void;
};

const PLATFORM_OPTIONS = [
    { value: 'github', label: 'GitHub' },
    { value: 'behance', label: 'Behance' },
    { value: 'dribbble', label: 'Dribbble' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'medium', label: 'Medium' },
    { value: 'custom', label: 'Custom' },
];

export default function SocialLinksEditor({
    value,
    onChange,
}: SocialLinksEditorProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    const addLink = () => {
        onChange([
            ...value,
            {
                platform: 'custom',
                title: '',
                url: '',
                order: value.length,
            },
        ]);
    };

    const removeLink = (index: number) => {
        const updated = value
            .filter((_, i) => i !== index)
            .map((link, i) => ({ ...link, order: i }));
        onChange(updated);
    };

    const updateLink = (
        index: number,
        field: keyof SocialLink,
        fieldValue: string,
    ) => {
        const updated = value.map((link, i) =>
            i === index ? { ...link, [field]: fieldValue } : link,
        );
        onChange(updated);
    };

    const handleDragStart = (index: number) => {
        setDragIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;

        const newLinks = [...value];
        const [dragged] = newLinks.splice(dragIndex, 1);
        newLinks.splice(index, 0, dragged);
        const reordered = newLinks.map((link, i) => ({ ...link, order: i }));
        onChange(reordered);
        setDragIndex(index);
    };

    const handleDragEnd = () => {
        setDragIndex(null);
    };

    return (
        <div className='space-y-3' role='list' aria-label='Social links'>
            {value.length === 0 && (
                <p className='text-body-sm text-[var(--md-sys-color-on-surface-variant)] py-4 text-center'>
                    No social links added yet.
                </p>
            )}

            {value.map((link, index) => (
                <div
                    key={link.id ?? `new-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                        'flex items-start gap-2 rounded-lg border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] p-3 cursor-grab active:cursor-grabbing transition-colors',
                        dragIndex === index && 'opacity-50',
                    )}
                    role='listitem'
                    aria-label={`Social link ${index + 1}`}
                >
                    <GripVertical className='h-5 w-5 text-[var(--md-sys-color-on-surface-variant)] shrink-0 mt-2' />

                    <div className='flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2'>
                        <Select
                            value={link.platform}
                            onValueChange={(v) =>
                                updateLink(index, 'platform', v)
                            }
                        >
                            <SelectTrigger aria-label='Platform'>
                                <SelectValue placeholder='Platform' />
                            </SelectTrigger>
                            <SelectContent>
                                {PLATFORM_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            value={link.title}
                            onChange={(e) =>
                                updateLink(index, 'title', e.target.value)
                            }
                            placeholder='Title'
                            aria-label='Link title'
                        />

                        <Input
                            value={link.url}
                            onChange={(e) =>
                                updateLink(index, 'url', e.target.value)
                            }
                            placeholder='https://...'
                            type='url'
                            aria-label='Link URL'
                        />
                    </div>

                    <button
                        type='button'
                        onClick={() => removeLink(index)}
                        className='flex h-9 w-9 items-center justify-center rounded-md text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-variant)] hover:text-[var(--md-sys-color-error)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] shrink-0 mt-1'
                        aria-label={`Remove link ${index + 1}`}
                    >
                        <Trash2 className='h-4 w-4' />
                    </button>
                </div>
            ))}

            <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addLink}
                className='w-full'
            >
                <Plus className='h-4 w-4 mr-1' />
                Add Link
            </Button>
        </div>
    );
}
