/**
 * Section Label (NavLabel) — разделитель секций главной: подпись 11px
 * uppercase + горизонтальная линия, растянутая на остаток строки
 * (Main_page_Spec §4).
 *
 * Вынесен в отдельный компонент 2026-09-26 (решение (69)): разметка была
 * продублирована трижды — в page.tsx, ApproachSection и
 * PlatformBenefitsSection, и разъезжалась по цвету подписи
 * (on-surface-variant против outline-variant). Здесь один вариант —
 * text-on-surface-variant: на bg-surface-container-lowest он читаемее
 * outline-контраста, а линия задаёт ту же оптическую ширину.
 */
export function SectionLabel({ label }: { label: string }) {
    return (
        <div className='flex w-full items-center gap-4'>
            <span className='shrink-0 text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-on-surface-variant'>
                {label}
            </span>
            <span
                aria-hidden
                className='h-px flex-1 bg-[rgba(140,213,179,0.16)]'
            />
        </div>
    );
}
