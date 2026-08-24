import { TagBadge } from '../case/TagBadge';

interface ProcessStep {
  number: string;    // "01", "02", etc.
  title: string;
  description: string;
}

interface SkillsSectionProps {
  label?: string;
  expertiseTags: string[];
  toolTags: string[];
  processSteps: ProcessStep[];
}

/**
 * Skills Section — Main_page_Spec §8
 * Instance ID: I124:576;87:3879;234:1488
 * 1200×842, Surface Container Lowest, border top
 */
export function SkillsSection({
  label = 'Skills', expertiseTags, toolTags, processSteps,
}: SkillsSectionProps) {
  if (expertiseTags.length === 0 && toolTags.length === 0 && processSteps.length === 0) return null;

  return (
    <section className="bg-surface-container-lowest px-8 py-24 lg:px-16">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          <div className="flex w-full flex-col gap-8 lg:w-[502px]">
            {expertiseTags.length > 0 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-title-sm font-medium text-on-surface-variant">Areas of expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {expertiseTags.map((tag) => <TagBadge key={tag} label={tag} variant="outlined" />)}
                </div>
              </div>
            )}

            {toolTags.length > 0 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-title-sm font-medium text-on-surface-variant">Tools</h3>
                <div className="flex flex-wrap gap-3">
                  {toolTags.map((tag) => <TagBadge key={tag} label={tag} variant="outlined" />)}
                </div>
              </div>
            )}
          </div>

          {processSteps.length > 0 && (
            <div className="flex w-full flex-col gap-8 lg:w-[530px]">
              <h3 className="text-title-sm font-medium text-on-surface-variant">My process</h3>
              <div className="flex flex-col gap-6">
                {processSteps.map((step) => (
                  <div key={step.number} className="flex items-start gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface text-[11px] leading-4 tracking-[0.5px] font-semibold text-primary">
                      {step.number}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-label-lg font-semibold leading-snug text-on-surface">
                        {step.title}
                      </span>
                      <span className="text-body-sm font-normal text-on-surface-variant">
                        {step.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
