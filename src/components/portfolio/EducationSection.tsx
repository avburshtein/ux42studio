import type { EducationItem } from '@/lib/mainPageContent';

/**
 * Education Section — Main_page_Spec §10
 * Рендерит образование: учреждение + степень + период + локация.
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
      <div className='section-container flex flex-col gap-16'>
        <div className='flex flex-col gap-10 lg:flex-row lg:gap-10'>
          <div className='flex w-full flex-col gap-8 lg:w-[502px]'>
            <h3 className='text-title-sm font-medium text-on-surface-variant'>
              {heading}
            </h3>
            <div className='flex flex-col gap-6'>
              {items.map((item) => (
                <div key={`${item.institution}-${item.degree}`} className='flex flex-col gap-2'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-label-lg font-semibold text-on-surface'>
                      {item.institution}
                    </span>
                    <span className='text-body-sm font-medium text-on-surface-variant whitespace-nowrap'>
                      {item.degree}
                    </span>
                  </div>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-body-sm text-on-surface-variant whitespace-nowrap'>
                      {item.period}
                    </span>
                    {item.location && (
                      <span className='text-body-sm text-on-surface-variant whitespace-nowrap'>
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
