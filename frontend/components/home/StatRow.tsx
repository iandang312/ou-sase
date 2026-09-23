"use client";

import { useMotionValueEvent } from "motion/react";
import { useState } from "react";

import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { ScrollScene, SceneStep, useSceneValue } from "@/components/ui/ScrollScene";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  caption: string;
  tone: "blue" | "mint" | "lavender";
}

// TODO(content): Huy — confirm every figure below against real chapter
// records before this goes live. Placeholders only; do not treat as verified
// counts.
const STATS: Stat[] = [
  {
    target: 100,
    suffix: "+",
    label: "active members",
    caption: "Students who show up to GBMs and events",
    tone: "blue",
  },
  {
    target: 12,
    suffix: "+",
    label: "events per year",
    caption: "Workshops, socials, and service days combined",
    tone: "mint",
  },
  {
    target: 5,
    suffix: "+",
    label: "partner companies",
    caption: "Recruiters who come back semester after semester",
    tone: "lavender",
  },
];

const TONE_WASH: Record<Stat["tone"], string> = {
  blue: "group-hover:bg-pastel-blue-soft",
  mint: "group-hover:bg-pastel-mint-soft",
  lavender: "group-hover:bg-pastel-lavender-soft",
};

/** Counts from 0 to `target` as the scene scrubs past its window. */
function StatCounter({
  target,
  suffix,
  from,
  to,
}: {
  target: number;
  suffix: string;
  from: number;
  to: number;
}) {
  const raw = useSceneValue([from, to], [0, target]);
  const [display, setDisplay] = useState(() => Math.round(raw.get()));
  useMotionValueEvent(raw, "change", (latest) => setDisplay(Math.round(latest)));

  return (
    <span className="font-mono text-display-sm text-ink transition-transform duration-base ease-standard group-hover:-translate-y-0.5">
      {display}
      {suffix}
    </span>
  );
}

/** A stat strip that counts itself up as the reader scrolls into it. */
export function StatRow() {
  return (
    <Section tone="light" className="relative !py-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/[0.02] to-transparent"
      />
      {/* Heading lives inside the stage so the pinned screen is one composed
          unit, centered below the nav, rather than cards stuck to the top of
          an otherwise empty screen. */}
      <ScrollScene length={2}>
        <SceneStep from={0} to={1} first last className="flex flex-col justify-center pt-16">
          <Container className="flex flex-col gap-10">
            <SectionHeading
              kicker="The chapter, in numbers"
              title="A season with SASE at OU"
              sub="A quick read on the size and rhythm of the chapter — scroll to watch the count."
              align="center"
            />
            <div className="border-hairline grid grid-cols-1 divide-y divide-hairline overflow-hidden rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className={`group flex flex-col items-center gap-2 px-6 py-8 text-center transition-colors duration-base ease-standard ${TONE_WASH[stat.tone]}`}
                >
                  <StatCounter target={stat.target} suffix={stat.suffix} from={0.1} to={0.75} />
                  <span className="text-caption text-muted uppercase tracking-[0.06em]">
                    {stat.label}
                  </span>
                  <p className="text-caption text-muted mt-1 max-w-[26ch]">{stat.caption}</p>
                </div>
              ))}
            </div>
          </Container>
        </SceneStep>
      </ScrollScene>
    </Section>
  );
}
