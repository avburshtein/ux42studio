/**
 * Позиции подраздела внутри секции кейса (D-027).
 *
 * Подраздел — пользовательский блок «заголовок + текст». Изначально он
 * выводился в самом конце секции (единственное место, которое мы могли
 * зафиксировать в разметке). Теперь дизайнер выбирает, где именно внутри
 * секции встанет его блок — фидбэк 2026-11-03 («в любом удобном месте»).
 *
 * Здесь — единственный источник правды: и редактор в админке, и
 * публичная страница кейса берут позиции отсюда, поэтому список не может
 * разъехаться.
 *
 * Подписи позиций — через i18n (admin.*), потому что админка двуязычная;
 * ключи лежат в namespace `sub.position`.
 */

export type SubsectionPosition =
    | 'end'
    | 'problem.statement'
    | 'research.story'
    | 'research.metrics'
    | 'designProcess.approach'
    | 'designSystem.moodboard'
    | 'designSystem.colors'
    | 'finalDesign.gallery'
    | 'finalDesign.prototypes'
    | 'reflection.nextSteps';

export interface SubsectionPositionOption {
    value: SubsectionPosition;
    /** Ключ словаря админки: sub.position.<key> */
    labelKey: string;
}

/**
 * Позиции по ключу секции. Порядок в массиве = порядок на странице
 * кейса (сверху вниз), поэтому список в селекте совпадает с тем,
 * что увидит посетитель.
 *
 * ВАЖНО: сюда попадают только позиции, которые реально отличаются от
 * «в конце раздела». Раньше в списках были ещё «после последнего блока»
 * (Goal/Target users, Personas, Wireframes, Type scale, прототипы,
 * Before/After, Client reviews) — они давали тот же результат, что и
 * `end`, и путали дизайнера (фидбэк 2026-11-06). Последний блок секции
 * и так заканчивается разделом.
 */
export const SUBSECTION_POSITIONS: Record<
    string,
    SubsectionPositionOption[]
> = {
    problem: [
        { value: 'problem.statement', labelKey: 'sub.position.problemStatement' },
        { value: 'end', labelKey: 'sub.position.end' },
    ],
    research: [
        { value: 'research.story', labelKey: 'sub.position.researchStory' },
        { value: 'research.metrics', labelKey: 'sub.position.researchMetrics' },
        { value: 'end', labelKey: 'sub.position.end' },
    ],
    designProcess: [
        // «В начале» — сразу после вводного текста раздела (Design Approach),
        // то есть ПЕРЕД вайрфреймами. Раньше такой позиции не было.
        {
            value: 'designProcess.approach',
            labelKey: 'sub.position.designApproach',
        },
        { value: 'end', labelKey: 'sub.position.end' },
    ],
    designSystem: [
        {
            value: 'designSystem.moodboard',
            labelKey: 'sub.position.moodboard',
        },
        {
            value: 'designSystem.colors',
            labelKey: 'sub.position.colorTokens',
        },
        { value: 'end', labelKey: 'sub.position.end' },
    ],
    finalDesign: [
        { value: 'finalDesign.gallery', labelKey: 'sub.position.finalGallery' },
        // После прототипов идёт блок Results — позиция отличается от «в конце».
        {
            value: 'finalDesign.prototypes',
            labelKey: 'sub.position.finalPrototypes',
        },
        { value: 'end', labelKey: 'sub.position.end' },
    ],
    // В секции Testing только сами Before/After — других блоков нет,
    // поэтому осмысленная позиция ровно одна.
    testing: [{ value: 'end', labelKey: 'sub.position.end' }],
    reflection: [
        {
            value: 'reflection.nextSteps',
            labelKey: 'sub.position.nextSteps',
        },
        { value: 'end', labelKey: 'sub.position.end' },
    ],
};

/** Позиции для секции; для неизвестной секции — только «в конце». */
export function positionsForSection(sectionKey: string): SubsectionPositionOption[] {
    return (
        SUBSECTION_POSITIONS[sectionKey] ?? [
            { value: 'end', labelKey: 'sub.position.end' },
        ]
    );
}

/** Значение по умолчанию — конец секции (прежнее поведение). */
export const DEFAULT_SUBSECTION_POSITION: SubsectionPosition = 'end';

/**
 * Приводит сохранённое значение к действующему списку.
 *
 * Нужно для подразделов, сохранённых до чистки дублей: значения вроде
 * `problem.audience` или `designProcess.wireframes` больше не выбираются,
 * но не должны «потеряться» — они рендерятся в конце своей секции.
 */
export function resolveSubsectionPosition(
    sectionKey: string,
    stored: string | null | undefined,
): SubsectionPosition {
    const value = (stored ?? DEFAULT_SUBSECTION_POSITION) as SubsectionPosition;
    const allowed = positionsForSection(sectionKey).some(
        (option) => option.value === value,
    );
    return allowed ? value : DEFAULT_SUBSECTION_POSITION;
}

