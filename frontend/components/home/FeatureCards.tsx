import { Card } from "@/components/ui/Card";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";

interface Feature {
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    title: "Professional development",
    body: "Resume workshops, mock interviews, and a straight line to recruiters who are actually hiring — built around what engineering and science recruiting looks like for us.",
  },
  {
    title: "A community that gets it",
    body: "Study nights, socials, and a chapter of people who understand both the coursework grind and the identity questions nobody else on campus asks about.",
  },
  {
    title: "Give back, on and off campus",
    body: "STEM outreach for younger students, cultural celebrations open to the whole OU community, and volunteer days that put the chapter's time where its values are.",
  },
];

/** 3-up feature cards — what SASE is and does, told through what members get. */
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
        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <h3 className="text-title-md text-ink">{feature.title}</h3>
              <p className="text-body-sm text-body mt-2">{feature.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
