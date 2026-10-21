'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, GripVertical, RefreshCw, Move } from 'lucide-react';
import ImageCropperDialog from '@/components/ImageCropperDialog';

export interface GridImage {
    id: string;
    url: string;
    slotIndex: number;
    file?: File;
    fileId?: string;
    /** Фокус-точка object-position, 0..100 (дефолт 50 — центр). */
    posX?: number;
    posY?: number;
}

interface GridSlotProps {
    slotIndex: number;
    className: string;
    image?: GridImage;
    onFileUpload: (file: File, slotIndex: number) => void;
    /**
     * Разрешить режим «двигать фото» (фокус-точка для object-cover).
     * Включается для мудборда: его слоты разной формы, и картинка
     * «кропится как получится» — позиция в процентах это чинит.
     */
    pannable?: boolean;
    onPositionChange?: (
        slotIndex: number,
        posX: number,
        posY: number,
    ) => void;
}

/**
 * Объединяет несколько callback-ref в один стабильный callback.
 * Всегда вызывает актуальные версии переданных ref.
 */
function useMergedRefs<T>(
    ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
    const refsRef = useRef(refs);
    refsRef.current = refs;

    const mergedRef = useRef<React.RefCallback<T> | null>(null);
    if (!mergedRef.current) {
        mergedRef.current = (node: T | null) => {
            for (const ref of refsRef.current) {
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref && typeof ref === 'object') {
                    (ref as React.MutableRefObject<T | null>).current = node;
                }
            }
        };
    }
    return mergedRef.current;
}

export default function GridSlot({
    slotIndex,
    className,
    image,
    onFileUpload,
    pannable,
    onPositionChange,
}: GridSlotProps) {
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    // ---- Режим «двигать фото» (фокус-точка) ----
    // В обычном режиме картинку тащит dnd-kit (сортировка по слотам).
    // Панорамирование конфликтует с ним, поэтому — явный режим: кнопка
    // Move включает, дроп/«Готово» коммитит позицию и выключает.
    const [panMode, setPanMode] = useState(false);
    // Живое значение во время перетаскивания (коммит — на pointerup)
    const [livePos, setLivePos] = useState<{ x: number; y: number } | null>(
        null,
    );
    const panStartRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        startPosX: number;
        startPosY: number;
    } | null>(null);
    const slotBoxRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const displayedPos = {
        x: livePos?.x ?? image?.posX ?? 50,
        y: livePos?.y ?? image?.posY ?? 50,
    };

    const handlePanStart = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!panMode || !image) return;
        e.stopPropagation(); // не открывать file-picker dropzone
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        panStartRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            startPosX: displayedPos.x,
            startPosY: displayedPos.y,
        };
        setLivePos({ x: displayedPos.x, y: displayedPos.y });
    };

    const handlePanMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const start = panStartRef.current;
        if (!start || start.pointerId !== e.pointerId) return;
        // Максимальный сдвиг: картинка в object-cover вылезает из слота
        // на разницу «накрыть»-размера и бокса. Смещение в % = сдвиг px /
        // запас px × 100; тянем картинку вправо → точка фокуса уменьшается.
        const box = slotBoxRef.current;
        const img = imgRef.current;
        if (!box || !img || !img.naturalWidth) return;
        const scale = Math.max(
            box.clientWidth / img.naturalWidth,
            box.clientHeight / img.naturalHeight,
        );
        const shiftX = img.naturalWidth * scale - box.clientWidth;
        const shiftY = img.naturalHeight * scale - box.clientHeight;
        const clampPct = (v: number) => Math.min(100, Math.max(0, v));
        const x =
            shiftX > 1
                ? clampPct(
                      start.startPosX -
                          ((e.clientX - start.startX) / shiftX) * 100,
                  )
                : 50;
        const y =
            shiftY > 1
                ? clampPct(
                      start.startPosY -
                          ((e.clientY - start.startY) / shiftY) * 100,
                  )
                : 50;
        setLivePos({ x, y });
    };

    const handlePanEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        const start = panStartRef.current;
        if (!start || start.pointerId !== e.pointerId) return;
        panStartRef.current = null;
        setLivePos((pos) => {
            if (pos) onPositionChange?.(slotIndex, pos.x, pos.y);
            return null;
        });
        setPanMode(false);
    };


    // Редактор изображений (как у обложек ImageUploader): выбранный файл
    // сначала кадрируется в ImageCropperDialog, кадр уходит в upload.
    // aspectRatio не задаём — свободные пропорции (слоты разных пресетов
    // имеют разные формы, жёсткое соотношение мешало бы).
    const [cropping, setCropping] = useState<{
        file: File;
        url: string;
    } | null>(null);

    const startCropFlow = useCallback((file: File) => {
        // SVG не кадрируется растровым редактором — уходит напрямую
        if (file.type === 'image/svg+xml') {
            onFileUpload(file, slotIndex);
            return;
        }
        setCropping({ file, url: URL.createObjectURL(file) });
    }, [onFileUpload, slotIndex]);

    const handleCropApply = useCallback(
        (blob: Blob) => {
            const source = cropping?.file;
            const ext =
                blob.type === 'image/png'
                    ? 'png'
                    : blob.type === 'image/webp'
                      ? 'webp'
                      : 'jpg';
            const base = (source?.name ?? 'image').replace(/\.[^.]+$/, '');
            const file = new File([blob], `${base}-cropped.${ext}`, {
                type: blob.type,
            });
            if (cropping) URL.revokeObjectURL(cropping.url);
            setCropping(null);
            onFileUpload(file, slotIndex);
        },
        [cropping, onFileUpload, slotIndex],
    );

    // 1. react-dropzone — загрузка файлов с ОС
    const {
        getRootProps,
        getInputProps,
        isDragActive: isFileOver,
    } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        noClick: !!image,
        onDrop: useCallback(
            (acceptedFiles: File[]) => {
                if (acceptedFiles.length > 0) {
                    startCropFlow(acceptedFiles[0]);
                }
            },
            [startCropFlow],
        ),
    });

    const dropzoneRootProps = getRootProps();
    const { ref: dropzoneRef, ...dropzoneRest } = dropzoneRootProps;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dropzoneInputProps = getInputProps() as any;
    const originalInputRef = dropzoneInputProps.ref;

    const setInputRef = useCallback(
        (node: HTMLInputElement | null) => {
            if (typeof originalInputRef === 'function') {
                originalInputRef(node);
            }
            hiddenInputRef.current = node;
        },
        [originalInputRef],
    );

    // 2. dnd-kit Droppable — приёмник для внутренней сортировки
    const { setNodeRef: setDroppableRef, isOver: isDndOver } = useDroppable({
        id: `slot-${slotIndex}`,
        data: { slotIndex },
    });

    // 3. dnd-kit Draggable — перетаскиваемое фото
    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        transform,
        isDragging,
    } = useDraggable({
        id: image?.id ?? `empty-${slotIndex}`,
        data: { slotIndex },
        disabled: !image || panMode,
    });

    // Мерж ref: dropzone callback + dnd-kit droppable callback
    const mergedRef = useMergedRefs(dropzoneRef, setDroppableRef);

    const dndStyle = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              zIndex: 50,
              opacity: isDragging ? 0.5 : 1,
          }
        : undefined;

    const handleReplaceClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        hiddenInputRef.current?.click();
    };

    return (
        <div
            ref={mergedRef}
            {...dropzoneRest}
            className={cn(
                className,
                'relative rounded-lg border-2 transition-all',
                isFileOver
                    ? 'border-blue-500 bg-blue-50'
                    : isDndOver
                      ? 'border-green-500 bg-green-50'
                      : image
                        ? 'border-transparent'
                        : 'border-dashed border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-input)]',
            )}
        >
            <input {...dropzoneInputProps} ref={setInputRef} />

            {isFileOver && (
                <div className='absolute inset-0 z-20 flex items-center justify-center bg-blue-500/80 text-white font-medium'>
                    <Upload className='h-6 w-6 mr-2' />
                    Бросайте фото сюда
                </div>
            )}

            {isDndOver && !isFileOver && (
                <div className='absolute inset-0 z-20 flex items-center justify-center bg-green-500/80 text-white font-medium pointer-events-none'>
                    Поместить сюда
                </div>
            )}

            {image ? (
                <div
                    ref={(node) => {
                        setDraggableRef(node);
                        slotBoxRef.current = node;
                    }}
                    style={dndStyle}
                    {...(panMode
                        ? {
                              onPointerDown: handlePanStart,
                              onPointerMove: handlePanMove,
                              onPointerUp: handlePanEnd,
                              onPointerCancel: handlePanEnd,
                          }
                        : listeners)}
                    {...attributes}
                    className={cn(
                        'w-full h-full group touch-none rounded-lg overflow-hidden',
                        panMode ? 'cursor-move' : 'cursor-grab active:cursor-grabbing',
                    )}
                >
                    {/* Фото в слоте: R2/blob-URL, размеры неизвестны,
                        пропорции задаёт контейнер слота. object-position —
                        фокус-точка (pan-режим мудборда), по умолчанию центр. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        ref={imgRef}
                        src={image.url}
                        alt={`Фото в слоте ${slotIndex}`}
                        className='w-full h-full object-cover pointer-events-none select-none rounded-lg'
                        style={{
                            objectPosition: `${displayedPos.x}% ${displayedPos.y}%`,
                        }}
                        draggable={false}
                    />

                    {!panMode && (
                        <>
                            <button
                                type='button'
                                onClick={handleReplaceClick}
                                className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white p-1.5 rounded shadow-sm transition-opacity z-30 cursor-pointer'
                                aria-label='Заменить фото'
                            >
                                <RefreshCw className='h-4 w-4 text-slate-700' />
                            </button>

                            {pannable && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPanMode(true);
                                    }}
                                    className='absolute top-2 right-11 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white p-1.5 rounded shadow-sm transition-opacity z-30 cursor-pointer'
                                    aria-label='Двигать фото внутри слота'
                                    title='Двигать фото внутри слота'
                                >
                                    <Move className='h-4 w-4 text-slate-700' />
                                </button>
                            )}

                            <div className='absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-white/90 p-1 rounded shadow-sm transition-opacity z-30 pointer-events-none'>
                                <GripVertical className='h-4 w-4 text-slate-500' />
                            </div>
                        </>
                    )}

                    {panMode && (
                        <div className='absolute inset-x-2 bottom-2 z-30 flex items-center justify-center rounded bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 pointer-events-none'>
                            Двигайте фото — отпустите, чтобы зафиксировать
                        </div>
                    )}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center w-full h-full text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-variant)]/30 cursor-pointer transition-colors p-2'>
                    <Upload className='h-6 w-6 mb-1 opacity-60' />
                    <span className='text-sm font-medium'>Пустой слот</span>
                    <span className='text-xs opacity-70 mt-0.5'>
                        Нажмите или перетащите файл
                    </span>
                </div>
            )}

            {/* Редактор изображений — кадрирование перед загрузкой */}
            {cropping && (
                <ImageCropperDialog
                    src={cropping.url}
                    fileType={cropping.file.type}
                    onApply={handleCropApply}
                    onCancel={() => {
                        URL.revokeObjectURL(cropping.url);
                        setCropping(null);
                    }}
                />
            )}
        </div>
    );
}
