'use client';

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

/**
 * SortableList — обёртка для перетаскиваемых списков (D-017).
 *
 * Порядок = порядок элементов в массиве, поэтому перестановка
 * сохраняется вместе с остальным контентом страницы (JSON-колонка).
 * Идентификаторы — индексы: у элементов нет стабильного id в модели,
 * а перестановка применяется атомарно (arrayMove), поэтому смещение
 * индексов не даёт «прыгающих» строк.
 */
export function SortableList({
    ids,
    onMove,
    children,
}: {
    ids: string[];
    onMove: (from: number, to: number) => void;
    children: React.ReactNode;
}) {
    const sensors = useSensors(
        // distance: чтобы клик по полю не начинал перетаскивание
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const from = ids.indexOf(String(active.id));
        const to = ids.indexOf(String(over.id));
        if (from === -1 || to === -1) return;
        onMove(from, to);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
}

/** Перетаскиваемый элемент: карточка + ручка-«грип» слева. */
export function SortableItem({
    id,
    handleLabel,
    children,
}: {
    id: string;
    handleLabel: string;
    children: React.ReactNode;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`flex items-start gap-2 ${isDragging ? 'relative z-10 opacity-80' : ''}`}
        >
            <button
                type='button'
                {...attributes}
                {...listeners}
                aria-label={handleLabel}
                className='mt-1 flex h-9 w-7 shrink-0 cursor-grab items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface active:cursor-grabbing'
            >
                <GripVertical className='h-4 w-4' />
            </button>
            <div className='min-w-0 flex-1'>{children}</div>
        </div>
    );
}

/** Перестановка массива по индексам (обёртка над arrayMove). */
export function reorderByIndex<T>(items: T[], from: number, to: number): T[] {
    return arrayMove(items, from, to);
}
