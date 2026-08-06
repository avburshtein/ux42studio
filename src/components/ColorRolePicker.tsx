'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

type ColorRole = {
    id: string;
    name: string;
    lightColor: string;
    darkColor: string;
    description: string | null;
};

type ColorRolePickerProps = {
    value: Array<{ roleId: string; order: number }>;
    onChange: (roles: Array<{ roleId: string; order: number }>) => void;
};

export default function ColorRolePicker({
    value,
    onChange,
}: ColorRolePickerProps) {
    const [roles, setRoles] = useState<ColorRole[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await fetch('/api/color-roles');
                if (res.ok) {
                    const data = (await res.json()) as ColorRole[];
                    setRoles(data);
                }
            } catch {
                // Silently fail — roles will be empty
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoles();
    }, []);

    const selectedRoleIds = value.map((v) => v.roleId);

    const toggleRole = useCallback(
        (roleId: string) => {
            const isSelected = selectedRoleIds.includes(roleId);
            if (isSelected) {
                const filtered = value
                    .filter((v) => v.roleId !== roleId)
                    .map((v, i) => ({ ...v, order: i }));
                onChange(filtered);
            } else {
                onChange([...value, { roleId, order: value.length }]);
            }
        },
        [value, onChange, selectedRoleIds],
    );

    const handleDragStart = (index: number) => {
        setDragIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;

        const newValue = [...value];
        const [dragged] = newValue.splice(dragIndex, 1);
        newValue.splice(index, 0, dragged);
        const reordered = newValue.map((v, i) => ({ ...v, order: i }));
        onChange(reordered);
        setDragIndex(index);
    };

    const handleDragEnd = () => {
        setDragIndex(null);
    };

    if (isLoading) {
        return (
            <div className='space-y-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className='h-16 animate-pulse rounded-lg bg-[var(--md-sys-color-surface-variant)]'
                    />
                ))}
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <p className='text-body-sm text-[var(--md-sys-color-on-surface-variant)]'>
                No color roles available.
            </p>
        );
    }

    const selectedRoles = value
        .map((v) => {
            const role = roles.find((r) => r.id === v.roleId);
            return role ? { ...role, order: v.order } : null;
        })
        .filter((r): r is ColorRole & { order: number } => r !== null);

    return (
        <div className='space-y-3' role='list' aria-label='Color roles'>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                {roles.map((role) => {
                    const isSelected = selectedRoleIds.includes(role.id);
                    return (
                        <button
                            key={role.id}
                            type='button'
                            role='listitem'
                            aria-pressed={isSelected}
                            onClick={() => toggleRole(role.id)}
                            className={cn(
                                'flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]',
                                isSelected
                                    ? 'border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)]/20'
                                    : 'border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-outline)]',
                            )}
                        >
                            <div className='flex gap-1'>
                                <div
                                    className='h-6 w-6 rounded-full border border-[var(--md-sys-color-outline-variant)]'
                                    style={{
                                        backgroundColor: role.lightColor,
                                    }}
                                    title={`${role.name} light`}
                                />
                                <div
                                    className='h-6 w-6 rounded-full border border-[var(--md-sys-color-outline-variant)]'
                                    style={{
                                        backgroundColor: role.darkColor,
                                    }}
                                    title={`${role.name} dark`}
                                />
                            </div>
                            <span className='text-label-sm text-[var(--md-sys-color-on-surface)] text-center'>
                                {role.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedRoles.length > 0 && (
                <div className='space-y-2 pt-4 border-t border-[var(--md-sys-color-outline-variant)]'>
                    <p className='text-label-md text-[var(--md-sys-color-on-surface)]'>
                        Selected order (drag to reorder):
                    </p>
                    <div className='space-y-1'>
                        {selectedRoles.map((role, index) => (
                            <div
                                key={role.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={cn(
                                    'flex items-center gap-2 rounded-md border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] p-2 cursor-grab active:cursor-grabbing transition-colors',
                                    dragIndex === index &&
                                        'opacity-50 border-[var(--md-sys-color-primary)]',
                                )}
                                role='listitem'
                                aria-label={`${role.name}, drag to reorder`}
                            >
                                <GripVertical className='h-4 w-4 text-[var(--md-sys-color-on-surface-variant)] shrink-0' />
                                <div className='flex gap-1'>
                                    <div
                                        className='h-5 w-5 rounded-full border border-[var(--md-sys-color-outline-variant)]'
                                        style={{
                                            backgroundColor: role.lightColor,
                                        }}
                                    />
                                    <div
                                        className='h-5 w-5 rounded-full border border-[var(--md-sys-color-outline-variant)]'
                                        style={{
                                            backgroundColor: role.darkColor,
                                        }}
                                    />
                                </div>
                                <span className='text-body-sm text-[var(--md-sys-color-on-surface)]'>
                                    {role.name}
                                </span>
                                <span className='ml-auto text-label-sm text-[var(--md-sys-color-on-surface-variant)]'>
                                    #{index + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
