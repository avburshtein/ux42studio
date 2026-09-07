interface AboutSectionProps {
  title: string;
  paragraphs: string[];
  /** about_process_image — URL /r2/... (опционально) */
  imageUrl?: string;
}

export function AboutSection({ title, paragraphs, imageUrl }: AboutSectionProps) {
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <section id='about' className="scroll-mt-20 bg-surface-container-lowest py-12 md:py-24">
      <div className="section-container flex flex-col gap-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=''
              className='aspect-[516/495] w-full shrink-0 rounded-3xl bg-surface-container-low object-cover lg:w-[516px]'
            />
          ) : (
            <div className='w-full shrink-0 rounded-3xl bg-surface-container-low p-7 lg:w-[516px]' />
          )}

          <div className="flex w-full flex-col gap-8 lg:w-[516px]">
            <h2 className="font-display text-[32px] font-medium leading-[40px] text-on-surface lg:text-display-sm lg:leading-tight">
              {title}
            </h2>
            <div className="flex flex-col gap-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-body-lg font-normal text-on-surface-variant">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
