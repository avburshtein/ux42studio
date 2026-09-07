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
        {/* lg: две колонки одной высоты — картинка тянется по высоте текстового
            блока (align-items: stretch), верх текста = верх картинки.
            Figma-эталон: ~516×495; min-h защищает пропорцию при коротком тексте.
            img — absolute, чтобы не влиять на высоту ряда: высоту определяет
            только текст (или min-h). */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-10">
          {/* Image: высоту держит wrapper (aspect на мобиле, stretch на lg) */}
          <div className='relative aspect-[516/495] w-full shrink-0 overflow-hidden rounded-3xl bg-surface-container-low lg:aspect-auto lg:w-[516px] lg:min-h-[495px]'>
            {imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrl}
                alt=''
                className='absolute inset-0 h-full w-full object-cover'
              />
            )}
          </div>

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
