import { TagBadge } from '../case/TagBadge';
import type { ToolGroup } from '@/lib/mainPageContent';

interface ProcessStep {
  number: string;    // "01", "02", etc.
  title: string;
  description: string;
}

interface SkillsSectionProps {
  skillsLabel?: string;
  expertiseTags: string[];
  /** Группы Tools (D-013): подзаголовок + чипы, вместо плоского списка. */
  toolGroups: ToolGroup[];
  /** Строка «Project stack» — честная пометка, с чем работали. */
  stackNote?: string;
  processLabel?: string;
  processSteps: ProcessStep[];
}

/**
 * Skills Section — Main_page_Spec §8
 * Instance ID: I124:576;87:3879;234:1488
 * 1200×842, Surface Container Lowest, border top
 * Лейблы секций редактируются в админке (/admin/profile → Main Page Content).
 */
export function SkillsSection({
  skillsLabel, expertiseTags, toolGroups, stackNote, processLabel, processSteps,
}: SkillsSectionProps) {
  const hasTools = toolGroups.some((g) => g.items.length > 0);
  if (expertiseTags.length === 0 && !hasTools && processSteps.length === 0) return null;

  return (
    <section className="bg-surface-container-lowest py-12 md:py-24">
      <div className="section-container flex flex-col gap-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          <div className="flex w-full flex-col gap-8 lg:w-[502px]">
            {expertiseTags.length > 0 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-title-sm font-medium text-on-surface-variant">{skillsLabel ?? 'Areas of expertise'}</h3>
                <div className="flex flex-wrap gap-3">
                  {expertiseTags.map((tag) => <TagBadge key={tag} label={tag} variant="outlined" size="lg" />)}
                </div>
              </div>
            )}

            {hasTools && (
              <div className="flex flex-col gap-8">
                {toolGroups.map(
                  (group) =>
                    group.items.length > 0 && (
                      <div key={group.label} className="flex flex-col gap-4">
                        {group.label && (
                          <h4 className="text-label-lg font-semibold text-on-surface-variant">
                            {group.label}
                          </h4>
                        )}
                        <div className="flex flex-wrap gap-3">
                          {group.items.map((tag) => <TagBadge key={tag} label={tag} variant="outlined" size="lg" />)}
                        </div>
                      </div>
                    ),
                )}
              </div>
            )}
          </div>

          {processSteps.length > 0 && (
            <div className="flex w-full flex-col gap-8 lg:w-[530px]">
              <h3 className="text-title-sm font-medium text-on-surface-variant">{processLabel ?? 'My process'}</h3>
              <div className="flex flex-col gap-6">
                {processSteps.map((step) => (
                  <div key={step.number} className="flex items-start gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface text-[11px] leading-4 tracking-[0.5px] font-semibold text-primary-text">
                      {step.number}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-label-lg font-semibold leading-snug text-on-surface">
                        {step.title}
                      </span>
                      {step.description && (
                        <span className="text-body-sm font-normal text-on-surface-variant">
                          {step.description}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Процесс занимает только верх колонки; остаток места — Project stack (D-013). */}
              {stackNote && (
                <p className="mt-4 text-body-md font-normal text-on-surface-variant">
                  {stackNote}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
