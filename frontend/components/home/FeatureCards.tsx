import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { RevealGroup } from "@/components/ui/Reveal";

interface Feature {
  title: string;
  body: string;
  tag: string;
  /** Pastel family leading this tile. Two families max per component. */
  tone: "blue" | "peach" | "mint";
  /** Bento sizing: the anchor tile is large, the rest are supporting tiles. */
  size: "anchor" | "support";
}

const FEATURES: Feature[] = [
  {
    title: "Professional development",
    body: "Resume workshops, mock interviews, and a straight line to recruiters who are actually hiring — built around what engineering and science recruiting looks like for us.",
    tag: "Careers",
    tone: "blue",
    size: "anchor",
  },
  {
    title: "A community that gets it",
    body: "Study nights, socials, and a chapter of people who understand both the coursework grind and the identity questions nobody else on campus asks about.",
    tag: "Belonging",
    tone: "peach",
    size: "support",
  },
  {
    title: "Give back, on and off campus",
    body: "STEM outreach for younger students, cultural celebrations open to the whole OU community, and volunteer days that put the chapter's time where its values are.",
    tag: "Service",
    tone: "mint",
    size: "support",
  },
];

const TONE_STYLES: Record<Feature["tone"], { wash: string; fill: string; ink: string }> = {
  blue: { wash: "bg-pastel-blue-soft", fill: "bg-pastel-blue", ink: "text-pastel-blue-ink" },
  peach: { wash: "bg-pastel-peach-soft", fill: "bg-pastel-peach", ink: "text-pastel-peach-ink" },
  mint: { wash: "bg-pastel-mint-soft", fill: "bg-pastel-mint", ink: "text-pastel-mint-ink" },
};

/**
 * Bento layout: one large anchor tile plus two smaller supporting tiles.
 * DESIGN.md "Layout patterns" — bento suits "what we do" content where items
 * carry unequal weight, and reads with far more personality than a flat 3-up.
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
          sub="SASE's national mission is simple: prepare us for success in the global business world, celebrate our diversity, and put that success to work for the community. Here's what that looks like at OU."
        />
        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:grid-rows-2">
          <RevealGroup className="contents" step={70}>
            {FEATURES.map((feature) => {
              const tone = TONE_STYLES[feature.tone];
              const isAnchor = feature.size === "anchor";
              return (
                <div
                  key={feature.title}
                  className={
                    "group relative overflow-hidden rounded-xl border border-hairline bg-surface-card p-6 " +
                    "transition-transform duration-base ease-standard hover:-translate-y-1 md:p-8 " +
                    (isAnchor ? "md:row-span-2" : "")
                  }
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ${tone.wash} blur-2xl transition-transform duration-slow ease-standard group-hover:scale-110`}
                  />
                  <span
                    className={`relative inline-flex items-center rounded-pill px-3 py-1 text-caption-strong uppercase tracking-[0.06em] ${tone.fill} ${tone.ink}`}
                  >
                    {feature.tag}
                  </span>
                  <h3
                    className={`relative mt-4 text-ink ${isAnchor ? "text-title-lg" : "text-title-md"}`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-body relative mt-2 max-w-[48ch]">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
