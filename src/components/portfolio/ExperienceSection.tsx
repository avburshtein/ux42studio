import type { ExperienceItem } from '@/lib/mainPageContent';

/**
 * Experience Section — Main_page_Spec §9
 * Рендерит опыт работы: компания + роль + период + описание.
 *
 * Сетка (D-016): та же вёрстка, что в Education — «компания + роль» слева,
 * «период» справа. Раньше роль имела whitespace-nowrap и ломала строку при
 * длинных названиях компаний.
 */
export function ExperienceSection({
  heading,
  items,
}: {
  heading: string;
  items: ExperienceItem[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section id='experience' className='bg-surface-container-lowest py-12 md:py-24'>
      <div className='section-container flex flex-col gap-10'>
        <h3 className='text-title-sm font-medium text-on-surface-variant'>
          {heading}
        </h3>
        <div className='flex flex-col'>
          {items.map((item, i) => (
            <div
              key={`${item.company}-${item.role}-${i}`}
              className='grid grid-cols-1 gap-x-8 gap-y-1 border-t border-outline-variant py-5 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start'
            >
              <div className='flex flex-col gap-1'>
                <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2'>
                  <span className='text-label-lg font-semibold leading-snug text-on-surface'>
                    {item.company}
                  </span>
                  {item.role && (
                    <span className='text-body-sm font-medium leading-snug text-on-surface-variant'>
                      {item.role}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className='text-body-sm leading-relaxed text-on-surface-variant'>
                    {item.description}
                  </p>
                )}
              </div>
              {item.period && (
                <span className='text-body-sm font-medium whitespace-nowrap text-on-surface-variant'>
                  {item.period}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
