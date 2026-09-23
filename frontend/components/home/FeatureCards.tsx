"use client";

import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { ScrollScene, SceneProgressBar, SceneStep } from "@/components/ui/ScrollScene";

interface Feature {
  title: string;
  body: string;
  tag: string;
  /** What the supporting visual on this beat says in one line. */
  caption: string;
  /** Pastel family leading this beat. Two families max per component. */
  tone: "blue" | "peach" | "mint";
}

const FEATURES: Feature[] = [
  {
    title: "Professional development",
    body: "Resume workshops, mock interviews, and a straight line to recruiters who are actually hiring — built around what engineering and science recruiting looks like for us.",
    tag: "Careers",
    caption: "Workshops, interviews, and warm intros",
    tone: "blue",
  },
  {
    title: "A community that gets it",
    body: "Study nights, socials, and a chapter of people who understand both the coursework grind and the identity questions nobody else on campus asks about.",
    tag: "Belonging",
    caption: "Study nights and socials, every semester",
    tone: "peach",
  },
  {
    title: "Give back, on and off campus",
    body: "STEM outreach for younger students, cultural celebrations open to the whole OU community, and volunteer days that put the chapter's time where its values are.",
    tag: "Service",
    caption: "Outreach, culture nights, and volunteer days",
    tone: "mint",
  },
];

const TONE_STYLES: Record<Feature["tone"], { wash: string; fill: string; ink: string }> = {
  blue: { wash: "bg-pastel-blue-soft", fill: "bg-pastel-blue", ink: "text-pastel-blue-ink" },
  peach: { wash: "bg-pastel-peach-soft", fill: "bg-pastel-peach", ink: "text-pastel-peach-ink" },
  mint: { wash: "bg-pastel-mint-soft", fill: "bg-pastel-mint", ink: "text-pastel-mint-ink" },
};

const STEP_COUNT = FEATURES.length;

/**
 * "Why SASE", told one pillar at a time. Each scroll beat brings its own
 * tag, title, body copy and a supporting shape in the pillar's pastel
 * family, so the reader takes in one idea before the next arrives instead
 * of scanning three cards at once. Under reduced motion the beats stack in
 * normal flow — same content, no scrubbing.
 */
export function FeatureCards() {
  return (
    <Section tone="soft" className="relative">
      {/* Soft vignette at the seam with the light band above, so the tone
          change reads as a gradient shift rather than a hard cut. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/[0.03] to-transparent"
      />
      <Container>
        <SectionHeading
          kicker="Why SASE"
          title="Built for Asian-heritage scientists and engineers at OU"
          sub="SASE's national mission is simple: prepare us for success in the global business world, celebrate our diversity, and put that success to work for the community. Here's what that looks like at OU, one pillar at a time."
        />
      </Container>

      <ScrollScene length={3} className="mt-6 md:mt-10" stageClassName="pt-16">
        <SceneProgressBar colorClass="bg-brand-ink/30" />
        {FEATURES.map((feature, i) => {
          const tone = TONE_STYLES[feature.tone];
          const from = i / STEP_COUNT;
          const to = (i + 1) / STEP_COUNT;
          return (
            <SceneStep
              key={feature.title}
              from={from}
              to={to}
              fade={0.07}
              first={i === 0}
              last={i === STEP_COUNT - 1}
            >
              <Container className="grid h-full items-center gap-6 md:grid-cols-2 md:gap-14">
                <div className="flex flex-col items-start gap-3 md:gap-4">
                  <span className="text-caption text-muted font-mono uppercase tracking-[0.08em]">
                    {String(i + 1).padStart(2, "0")} / {String(STEP_COUNT).padStart(2, "0")}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-pill px-3 py-1 text-caption-strong uppercase tracking-[0.06em] ${tone.fill} ${tone.ink}`}
                  >
                    {feature.tag}
                  </span>
                  <h3 className="text-title-lg text-ink">{feature.title}</h3>
                  <p className="text-body-md text-body max-w-[48ch]">{feature.body}</p>
                </div>

                {/* Supporting visual: a pastel plate with the beat's caption
                    — a shape, not a photo, so it stays decorative. Hidden on
                    phones so a beat's text never has to compete with it for
                    the limited height inside the sticky stage. */}
                <div className="relative mx-auto hidden h-56 w-full max-w-sm items-center justify-center md:flex md:h-72">
                  <div
                    aria-hidden
                    className={`absolute h-48 w-48 rounded-full ${tone.wash} blur-xl md:h-60 md:w-60`}
                  />
                  <div
                    aria-hidden
                    className={`relative flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-card p-6 text-center shadow-[0_1px_2px_rgba(10,11,13,0.06)] md:h-48 md:w-48`}
                  >
                    <span className={`h-3 w-16 rounded-pill ${tone.fill}`} />
                    <span className={`h-3 w-10 rounded-pill ${tone.fill}`} />
                    <p className="text-caption text-muted mt-2">{feature.caption}</p>
                  </div>
                </div>
              </Container>
            </SceneStep>
          );
        })}
      </ScrollScene>
    </Section>
  );
}
