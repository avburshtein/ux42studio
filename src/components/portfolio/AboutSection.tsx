import { SectionHeader } from '../case/SectionHeader';

interface AboutSectionProps {
  label?: string;
  title: string;
  paragraphs: string[];
}

export function AboutSection({ label = 'About', title, paragraphs }: AboutSectionProps) {
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <section className="bg-surface-container-lowest px-8 py-24 lg:px-16">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          <div className="w-full shrink-0 rounded-3xl bg-surface-container-low p-7 lg:w-[516px]" />

          <div className="flex w-full flex-col gap-8 lg:w-[516px]">
            <h2 className="font-display text-display-sm font-medium leading-tight text-on-surface">
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
