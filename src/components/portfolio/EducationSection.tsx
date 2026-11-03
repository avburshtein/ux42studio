import type { EducationItem } from '@/lib/mainPageContent';

/**
 * Education Section — Main_page_Spec §10
 * Рендерит образование: учреждение + степень + период + локация.
 *
 * Сетка (D-016): две колонки на широких экранах — «учреждение + степень»
 * слева, «период + локация» справа. Раньше степень/локация имели
 * whitespace-nowrap, из-за чего длинные значения («BSc Psychology. Thesis
 * on the effects of colour…») не переносились и ломали строку на части.
 */
export function EducationSection({
  heading,
  items,
}: {
  heading: string;
  items: EducationItem[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section id='education' className='bg-surface-container-lowest py-12 md:py-24'>
      <div className='section-container flex flex-col gap-10'>
        <h3 className='text-title-sm font-medium text-on-surface-variant'>
          {heading}
        </h3>
        <div className='flex flex-col'>
          {items.map((item, i) => (
            <div
              key={`${item.institution}-${item.degree}-${i}`}
              className='grid grid-cols-1 gap-x-8 gap-y-1 border-t border-outline-variant py-5 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start'
            >
              <div className='flex flex-col gap-1'>
                <span className='text-label-lg font-semibold leading-snug text-on-surface'>
                  {item.institution}
                </span>
                {item.degree && (
                  <span className='text-body-sm leading-relaxed text-on-surface-variant'>
                    {item.degree}
                  </span>
                )}
              </div>
              <div className='flex flex-row gap-x-4 lg:flex-col lg:items-end lg:gap-y-0.5'>
                {item.period && (
                  <span className='text-body-sm font-medium whitespace-nowrap text-on-surface-variant'>
                    {item.period}
                  </span>
                )}
                {item.location && (
                  <span className='text-body-sm whitespace-nowrap text-on-surface-variant'>
                    {item.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
