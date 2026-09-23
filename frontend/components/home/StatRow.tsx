import { Container, Section } from "@/components/ui/Layout";

interface Stat {
  value: string;
  label: string;
}

// TODO: Huy — confirm every figure below against real chapter records before
// this goes live. Placeholders only; do not treat as verified counts.
const STATS: Stat[] = [
  { value: "100+", label: "active members" },
  { value: "12+", label: "events per year" },
  { value: "5+", label: "partner companies" },
];

/** A quiet stat strip — three numbers, no chart, no animation. */
export function StatRow() {
  return (
    <Section tone="light" className="!py-10 md:!py-14">
      <Container>
        <div className="border-hairline grid grid-cols-1 divide-y divide-hairline rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-6 py-8 text-center"
            >
              <span className="font-display text-display-sm text-ink">
                {stat.value}
              </span>
              <span className="text-caption text-muted uppercase tracking-[0.06em]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
