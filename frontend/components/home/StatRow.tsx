import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";

interface Stat {
  value: string;
  label: string;
  tone: "blue" | "mint" | "lavender";
}

// TODO: Huy — confirm every figure below against real chapter records before
// this goes live. Placeholders only; do not treat as verified counts.
const STATS: Stat[] = [
  { value: "100+", label: "active members", tone: "blue" },
  { value: "12+", label: "events per year", tone: "mint" },
  { value: "5+", label: "partner companies", tone: "lavender" },
];

const TONE_WASH: Record<Stat["tone"], string> = {
  blue: "group-hover:bg-pastel-blue-soft",
  mint: "group-hover:bg-pastel-mint-soft",
  lavender: "group-hover:bg-pastel-lavender-soft",
};

/** A stat strip — three numbers that lift and tint on hover. */
export function StatRow() {
  return (
    <Section tone="light" className="relative !py-10 md:!py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/[0.02] to-transparent"
      />
      <Container>
        <Reveal className="border-hairline grid grid-cols-1 divide-y divide-hairline overflow-hidden rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={`group flex flex-col items-center gap-1 px-6 py-8 text-center transition-colors duration-base ease-standard ${TONE_WASH[stat.tone]}`}
            >
              <span className="font-display text-display-sm text-ink transition-transform duration-base ease-standard group-hover:-translate-y-0.5">
                {stat.value}
              </span>
              <span className="text-caption text-muted uppercase tracking-[0.06em]">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
