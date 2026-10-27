'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    pointerWithin,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { GRID_PRESETS, type GridPreset } from '@/lib/grid-presets.config';
import { Check, ChevronDown } from 'lucide-react';
import GridSlot, { type GridImage } from './GridSlot';

interface AdminGridEditorProps {
    presetId: string | null;
    initialImages?: GridImage[];
    onImagesChange?: (images: GridImage[]) => void;
    onPresetChange?: (presetId: string) => void;
    onFileUpload?: (file: File, slotIndex: number) => void;
    /** Режим «двигать фото» (фокус-точка) — см. GridSlot. */
    pannable?: boolean;
    onPositionChange?: (
        slotIndex: number,
        posX: number,
        posY: number,
    ) => void;
}

export default function AdminGridEditor({
    presetId: rawPresetId,
    initialImages = [],
    onImagesChange,
    onPresetChange,
    onFileUpload,
    pannable,
    onPositionChange,
}: AdminGridEditorProps) {
    // Если presetId невалиден (например, null из БД), используем первый доступный пресет
    const presetId =
        rawPresetId && GRID_PRESETS[rawPresetId]
            ? rawPresetId
            : Object.keys(GRID_PRESETS)[0];
    const preset: GridPreset = GRID_PRESETS[presetId];

    const [activeDragImage, setActiveDragImage] = useState<GridImage | null>(
        null,
    );
    const [presetOpen, setPresetOpen] = useState(false);

    const [images, setImages] = useState<GridImage[]>(() => {
        if (initialImages.length > 0) return initialImages;
        // Создаём пустые слоты
        if (!preset) return [];
        return Array.from({ length: preset.slots }, (_, i) => ({
            id: `empty-${i}`,
            url: '',
            slotIndex: i,
        }));
    });

    // Синхронизируем состояние, когда родитель обновляет изображения
    // (например, после завершения загрузки файла на сервер и получения fileId).
    useEffect(() => {
        if (initialImages.length > 0) {
            setImages(initialImages);
        } else if (preset) {
            setImages(
                Array.from({ length: preset.slots }, (_, i) => ({
                    id: `empty-${i}`,
                    url: '',
                    slotIndex: i,
                })),
            );
        }
    }, [initialImages, preset]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    // Запоминаем перетаскиваемое изображение для DragOverlay
    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            const slotIndex = event.active.data.current?.slotIndex as
                | number
                | undefined;
            if (slotIndex !== undefined) {
                const img = images.find(
                    (i) => i.slotIndex === slotIndex && i.url,
                );
                setActiveDragImage(img ?? null);
            }
        },
        [images],
    );

    // Обработчик завершения перетаскивания (Swap)
    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over || active.id === over.id) return;

            const activeSlotIndex = active.data.current?.slotIndex as
                | number
                | undefined;
            const overSlotIndex = over.data.current?.slotIndex as
                | number
                | undefined;

            if (
                activeSlotIndex === undefined ||
                overSlotIndex === undefined
            ) {
                return;
            }

            setActiveDragImage(null);

            // Чистая функция (без побочных эффектов внутри setState-
            // апдейтера — иначе StrictMode вызывает её дважды):
            // считаем новый порядок снаружи, затем one-sync вверх.
            const next = images.map((img) => ({ ...img }));
            const activeItem = next.find(
                (img) => img.slotIndex === activeSlotIndex,
            );
            const overItem = next.find(
                (img) => img.slotIndex === overSlotIndex,
            );

            if (activeItem) activeItem.slotIndex = overSlotIndex;
            if (overItem) overItem.slotIndex = activeSlotIndex;

            setImages(next);
            // Сообщаем родителю новый порядок. Без этого вызова перестановка
            // слотов жила только в локальном состоянии редактора и терялась
            // при сохранении кейса (и откатывалась при следующей загрузке
            // файла — initialImages перетирал локальный порядок).
            onImagesChange?.(next);
        },
        [images, onImagesChange],
    );

    // Обработчик загрузки файла в конкретный слот (fallback, когда родитель
    // не передал onFileUpload)
    const handleFileUpload = useCallback(
        (file: File, targetSlotIndex: number) => {
            const objectUrl = URL.createObjectURL(file);
            const newImage: GridImage = {
                id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                url: objectUrl,
                slotIndex: targetSlotIndex,
            };

            // Убираем старое изображение из этого слота, если есть
            const next = [
                ...images.filter((img) => img.slotIndex !== targetSlotIndex),
                newImage,
            ];
            setImages(next);
            onImagesChange?.(next);
        },
        [images, onImagesChange],
    );

    // Смена пресета
    const handlePresetChange = useCallback(
        (newPresetId: string) => {
            onPresetChange?.(newPresetId);
        },
        [onPresetChange],
    );

    if (!GRID_PRESETS[presetId]) {
        return (
            <div className='p-8 text-center text-[var(--md-sys-color-error)]'>
                Не найден ни один пресет сетки.
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Выбор пресета — dropdown-меню (D-008, фидбэк 2026-10-26:
                единый паттерн с фильтром шагов визарда; flex-wrap кнопки
                переполняли мобилу). Меню и на десктопе — компактно и не
                зависит от числа пресетов. Клик-вне закрывает overlay. */}
            <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-[var(--md-sys-color-on-surface)]'>
                    Выберите шаблон сетки
                </h3>
                <div className='relative sm:max-w-sm'>
                    <button
                        type='button'
                        onClick={() => setPresetOpen((v) => !v)}
                        aria-expanded={presetOpen}
                        aria-label='Выбрать шаблон сетки мудборда'
                        className='flex w-full items-center justify-between gap-2 rounded-md border border-outline-variant bg-surface px-4 py-3 text-title-md text-on-surface'
                    >
                        <span className='truncate'>
                            {preset.name}{' '}
                            <span className='text-body-sm text-on-surface-variant'>
                                ({preset.slots} фото)
                            </span>
                        </span>
                        <ChevronDown
                            className={`h-5 w-5 shrink-0 transition-transform ${
                                presetOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                    {presetOpen && (
                        <>
                            <div
                                className='fixed inset-0 z-10'
                                onClick={() => setPresetOpen(false)}
                            />
                            <ul className='absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-outline-variant bg-surface shadow-lg'>
                                {Object.entries(GRID_PRESETS).map(([id, p]) => (
                                    <li
                                        key={id}
                                        className='border-b border-outline-variant last:border-b-0'
                                    >
                                        <button
                                            type='button'
                                            onClick={() => {
                                                handlePresetChange(id);
                                                setPresetOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-body-lg ${
                                                id === presetId
                                                    ? 'font-medium text-on-surface'
                                                    : 'text-on-surface-variant hover:bg-surface-variant'
                                            }`}
                                        >
                                            {p.name}
                                            {id === presetId ? (
                                                <Check className='h-5 w-5 shrink-0 text-primary' />
                                            ) : (
                                                <span className='shrink-0 text-body-sm text-on-surface-variant'>
                                                    {p.slots} фото
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>

            {/* Сетка */}
            <DndContext
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <div className='grid grid-cols-8 gap-3 auto-rows-[160px]'>
                    {preset.layoutClasses.map((className, index) => {
                        const image = images.find(
                            (img) => img.slotIndex === index && img.url,
                        );
                        return (
                            <GridSlot
                                key={index}
                                slotIndex={index}
                                className={className}
                                image={image}
                                onFileUpload={onFileUpload ?? handleFileUpload}
                                pannable={pannable}
                                onPositionChange={onPositionChange}
                            />
                        );
                    })}
                </div>
                <DragOverlay dropAnimation={null}>
                    {activeDragImage ? (
                        <div className='w-40 h-40 rounded-lg overflow-hidden opacity-90 shadow-lg ring-2 ring-[var(--md-sys-color-primary)]'>
                        {/* DragOverlay-превью: blob:/R2-URL, размеры
                            неизвестны, контейнер фиксирован w-40 h-40. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeDragImage.url}
                            alt=''
                            className='w-full h-full object-cover'
                        />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
