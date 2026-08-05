import Image from "next/image";
import Link from "next/link";
import { PortfolioHeader } from "@/components/portfolio-case/header";
import { PortfolioFooter } from "@/components/portfolio-case/footer";
import { ColorTokensPanel } from "@/components/portfolio-case/color-tokens";
import {
  CaseSection,
  ImagePlaceholder,
  LinkButton,
  MetadataCard,
  PrimaryButton,
} from "@/components/portfolio-case/shared";
import { caseMock } from "./mock-data";

export default async function CasePage({
  params,
}: {
  params: Promise<{ username: string; "case-slug": string }>;
}) {
  const { username } = await params;
  const data = caseMock;

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--md-sys-color-background)]">
      <PortfolioHeader username={username} />

      <main className="mx-auto flex w-full max-w-[var(--sizing-container-content)] flex-col">
        {/* Hero */}
        <section
          aria-labelledby="case-hero-title"
          className="flex flex-col gap-8 pb-8"
        >
          <div className="relative h-[320px] w-full overflow-hidden md:h-[555px]">
            <Image
              src={data.heroImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="hero-title-scrim absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-6 pt-16 md:px-16 md:pb-8">
              <h1
                id="case-hero-title"
                className="text-headline-sm text-[var(--md-sys-color-inverse-on-surface)] md:text-display-sm"
              >
                {data.title}
              </h1>
              <p className="max-w-3xl text-body-md text-[var(--md-sys-color-inverse-on-surface)] md:text-body-lg">
                {data.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 md:flex-row md:gap-6 md:px-16">
            {data.metadata.map((item) => (
              <MetadataCard
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </section>

        {/* Main content sections */}
        <div className="flex flex-col gap-12 px-4 py-12 md:gap-16 md:px-16 md:py-20">
          {/* 01 Problem & Audience */}
          <CaseSection
            id="problem"
            number={data.problem.number}
            name={data.problem.name}
            heading={data.problem.heading}
            description={data.problem.description}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {data.problem.cards.map((card) => (
                <article
                  key={card.title}
                  className="flex flex-col gap-3 rounded-[var(--radius-lg)] bg-[var(--md-sys-color-surface-container-low)] p-6"
                >
                  <h3 className="text-title-md text-[var(--md-sys-color-on-surface)]">
                    {card.title}
                  </h3>
                  <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </CaseSection>

          {/* 02 User Research */}
          <CaseSection
            id="research"
            number={data.research.number}
            name={data.research.name}
            heading={data.research.heading}
            description={data.research.description}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {data.research.metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="flex flex-col gap-2 rounded-[var(--radius-base)] bg-[var(--md-sys-color-surface-container-low)] p-6"
                >
                  <p className="text-headline-md text-[var(--md-sys-color-primary)]">
                    {metric.value}
                  </p>
                  <p className="text-label-md text-[var(--md-sys-color-on-surface-variant)]">
                    {metric.label}
                  </p>
                </article>
              ))}
            </div>

            <article className="flex flex-col gap-6 rounded-[var(--radius-lg)] bg-[var(--md-sys-color-surface-container-low)] p-6 md:flex-row md:items-center md:gap-8 md:p-8">
              <div
                aria-hidden
                className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[var(--md-sys-color-primary-container)] text-title-lg text-[var(--md-sys-color-on-primary-container)]"
              >
                {data.research.persona.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div>
                  <h3 className="text-title-md text-[var(--md-sys-color-on-surface)]">
                    {data.research.persona.name}
                  </h3>
                  <p className="text-body-sm text-[var(--md-sys-color-on-surface-variant)]">
                    {data.research.persona.role}
                  </p>
                </div>
                <blockquote className="text-body-md text-[var(--md-sys-color-on-surface)]">
                  “{data.research.persona.quote}”
                </blockquote>
                <ul className="flex flex-wrap gap-2">
                  {data.research.persona.traits.map((trait) => (
                    <li
                      key={trait}
                      className="rounded-[var(--radius-base)] bg-[var(--md-sys-color-surface-container-high)] px-3 py-1 text-label-sm text-[var(--md-sys-color-on-surface-variant)]"
                    >
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </CaseSection>

          {/* 03 Design Process */}
          <CaseSection
            id="process"
            number={data.process.number}
            name={data.process.name}
            heading={data.process.heading}
            description={data.process.description}
          >
            <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">
              {data.process.body}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {data.process.wireframes.map((label) => (
                <ImagePlaceholder
                  key={label}
                  label={label}
                  className="aspect-[4/3] min-h-[200px] rounded-[var(--radius-base)]"
                />
              ))}
            </div>
            <LinkButton href={data.process.prototypeHref}>
              {data.process.prototypeLabel}
            </LinkButton>
          </CaseSection>

          {/* 04 Design System */}
          <CaseSection
            id="design-system"
            number={data.designSystem.number}
            name={data.designSystem.name}
            heading={data.designSystem.heading}
            description={data.designSystem.description}
          >
            <div className="flex flex-col gap-3">
              <p className="text-label-md text-[var(--md-sys-color-on-surface-variant)]">
                Moodboard · Type scale
              </p>
              <div className="rounded-[var(--radius-2xl)] bg-[var(--md-sys-color-surface-container-low)] p-6 md:p-12">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                  {data.designSystem.typeSamples.map((sample) => (
                    <div
                      key={sample.label}
                      className="flex flex-col gap-1"
                    >
                      <span className="text-headline-md text-[var(--md-sys-color-on-surface)]">
                        {sample.sample}
                      </span>
                      <span className="text-label-sm text-[var(--md-sys-color-on-surface)]">
                        {sample.label}
                      </span>
                      <span className="text-label-overline text-[var(--md-sys-color-on-surface-variant)]">
                        {sample.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-label-md text-[var(--md-sys-color-on-surface-variant)]">
                Color tokens
              </p>
              <ColorTokensPanel />
            </div>
          </CaseSection>

          {/* 05 Testing & Iteration */}
          <CaseSection
            id="testing"
            number={data.testing.number}
            name={data.testing.name}
            heading={data.testing.heading}
            description={data.testing.description}
          >
            <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">
              {data.testing.body}
            </p>
            <div className="flex flex-col gap-8">
              {data.testing.comparisons.map((block) => (
                <div key={block.label} className="flex flex-col gap-4">
                  <p className="text-label-md text-[var(--md-sys-color-on-surface-variant)]">
                    {block.label}
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-label-overline text-[var(--md-sys-color-on-surface-variant)]">
                        Before
                      </span>
                      <ImagePlaceholder
                        label={block.before}
                        className="min-h-[120px] rounded-[var(--radius-base)]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-label-overline text-[var(--md-sys-color-primary)]">
                        After
                      </span>
                      <ImagePlaceholder
                        label={block.after}
                        className="min-h-[120px] rounded-[var(--radius-base)] bg-[var(--md-sys-surface-tint-11)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CaseSection>

          {/* 06 Final Design */}
          <CaseSection
            id="final"
            number={data.final.number}
            name={data.final.name}
            heading={data.final.heading}
            description={data.final.description}
          >
            <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">
              {data.final.body}
            </p>
            <div className="flex flex-col gap-6">
              {data.final.showcases.map((label) => (
                <ImagePlaceholder
                  key={label}
                  label={label}
                  className="min-h-[240px] rounded-[var(--radius-xl)] md:min-h-[420px]"
                />
              ))}
            </div>
            <LinkButton href={data.final.prototypeHref}>
              {data.final.prototypeLabel}
            </LinkButton>

            <div className="flex flex-col gap-4">
              <h3 className="text-title-md text-[var(--md-sys-color-on-surface)]">
                Results
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {data.final.results.map((result) => (
                  <article
                    key={result.label}
                    className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] bg-[var(--md-sys-color-surface-container-low)] p-5"
                  >
                    <span className="text-headline-sm text-[var(--md-sys-color-primary)]">
                      {result.value}
                    </span>
                    <span className="text-label-md text-[var(--md-sys-color-on-surface-variant)]">
                      {result.label}
                    </span>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-title-md text-[var(--md-sys-color-on-surface)]">
                Tools & technologies
              </h3>
              <ul className="flex flex-wrap gap-3">
                {data.final.tools.map((tool) => (
                  <li
                    key={tool}
                    className="inline-flex h-9 items-center rounded-[var(--radius-base)] bg-[var(--md-sys-color-surface-container-high)] px-4 text-label-md text-[var(--md-sys-color-on-surface)]"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </CaseSection>

          {/* 07 Reflection */}
          <CaseSection
            id="reflection"
            number={data.reflection.number}
            name={data.reflection.name}
            heading={data.reflection.heading}
            description={data.reflection.description}
          >
            <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">
              {data.reflection.body}
            </p>
            <div className="flex flex-col gap-4">
              <h3 className="text-title-md text-[var(--md-sys-color-on-surface)]">
                Next steps
              </h3>
              <ul className="flex flex-col gap-4">
                {data.reflection.nextSteps.map((step) => (
                  <li key={step} className="flex items-start gap-3.5">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--md-sys-color-primary)]"
                    />
                    <span className="text-body-md text-[var(--md-sys-color-on-surface)]">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CaseSection>
        </div>

        {/* Next Project Showcase */}
        <section
          aria-labelledby="next-project-heading"
          className="flex flex-col gap-8 px-4 py-12 md:gap-12 md:px-16 md:py-20"
        >
          <div
            aria-hidden
            className="h-px w-full bg-[var(--md-sys-color-outline-variant)]"
          />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2
                id="next-project-heading"
                className="text-headline-md text-[var(--md-sys-color-on-surface)]"
              >
                Let&apos;s work together.
              </h2>
              <p className="max-w-2xl text-body-md text-[var(--md-sys-color-on-surface-variant)]">
                Let&apos;s discuss how we can streamline your product experience
                with the same clarity and craft applied here.
              </p>
            </div>
            <PrimaryButton href="#contact">Start Project</PrimaryButton>
          </div>

          <Link
            href={`/${username}/mobile-banking-app`}
            className="flex flex-col gap-6 rounded-[var(--radius-2xl)] bg-[var(--md-sys-color-surface-container-low)] p-8 transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)] md:p-10"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4">
                <span className="text-label-overline text-[var(--md-sys-color-primary)]">
                  UP NEXT
                </span>
                <div
                  aria-hidden
                  className="h-px w-12 bg-[var(--md-sys-color-outline-variant)]"
                />
              </div>
              <span className="rounded-[var(--radius-base)] bg-[var(--md-sys-color-primary-container)] px-3 py-1 text-label-sm text-[var(--md-sys-color-on-primary-container)]">
                next case
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-title-md text-[var(--md-sys-color-on-surface)] md:text-[20px] md:leading-7">
                {data.nextProject.title}
              </p>
              <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">
                {data.nextProject.subtitle}
              </p>
            </div>
          </Link>
        </section>
      </main>

      <PortfolioFooter
        username={username}
        authorName={data.author.name}
        tagline={data.author.tagline}
      />
    </div>
  );
}
