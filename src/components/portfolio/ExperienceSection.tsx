import type { ExperienceItem } from '@/lib/mainPageContent';

/**
 * Experience Section — Main_page_Spec §9
 * Рендерит опыт работы: компания + должность + период + описание.
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
      <div className='section-container flex flex-col gap-16'>
        <div className='flex flex-col gap-10 lg:flex-row lg:gap-10'>
          <div className='flex w-full flex-col gap-8 lg:w-[502px]'>
            <h3 className='text-title-sm font-medium text-on-surface-variant'>
              {heading}
            </h3>
            <div className='flex flex-col gap-6'>
              {items.map((item) => (
                <div key={`${item.company}-${item.role}`} className='flex flex-col gap-2'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-label-lg font-semibold text-on-surface'>
                      {item.company}
                    </span>
                    <span className='text-body-sm font-medium text-on-surface-variant whitespace-nowrap'>
                      {item.role}
                    </span>
                  </div>
                  <span className='text-body-sm text-on-surface-variant whitespace-nowrap'>
                    {item.period}
                  </span>
                  {item.description && (
                    <p className='text-body-md font-normal text-on-surface-variant'>
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
