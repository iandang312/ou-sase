"use client";

import { motion, useTransform } from "motion/react";

import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { ScrollScene, useScene, useSceneValue } from "@/components/ui/ScrollScene";

interface TimelineItem {
  tag: string;
  title: string;
  body: string;
  tone: "blue" | "peach" | "mint";
}

// Generic, true-to-the-chapter copy — the recurring shape of a SASE year, not
// specific dates or counts. Reuses categories already established by
// FeatureCards (careers / community / service) and events already named
// elsewhere on the site (national convention, Lunar New Year).
const YEAR_ITEMS: TimelineItem[] = [
  {
    tag: "Welcome",
    title: "Involvement fair & welcome social",
    body: "New members find SASE early in the semester — tabling, an info session, and a first social to meet the chapter.",
    tone: "peach",
  },
  {
    tag: "Community",
    title: "General body meetings",
    body: "Regular GBMs mix chapter updates, speakers, and food — the steady heartbeat between the bigger events.",
    tone: "peach",
  },
  {
    tag: "Careers",
    title: "Recruiting season",
    body: "Resume workshops and mock interviews line up with employer info sessions, so members walk in prepared.",
    tone: "blue",
  },
  {
    tag: "Culture",
    title: "Cultural celebrations",
    body: "Lunar New Year and other celebrations, open to the whole OU community, not just the chapter.",
    tone: "peach",
  },
  {
    tag: "Careers",
    title: "National convention",
    body: "Chapter members travel to SASE's national convention to recruit, learn, and represent OU.",
    tone: "blue",
  },
  {
    tag: "Service",
    title: "Outreach & volunteer days",
    body: "STEM outreach for younger students and volunteer days that put the chapter's time where its values are.",
    tone: "mint",
  },
];

const TONE_STYLES: Record<TimelineItem["tone"], { wash: string; fill: string; ink: string }> = {
  blue: { wash: "bg-pastel-blue-soft", fill: "bg-pastel-blue", ink: "text-pastel-blue-ink" },
  peach: { wash: "bg-pastel-peach-soft", fill: "bg-pastel-peach", ink: "text-pastel-peach-ink" },
  mint: { wash: "bg-pastel-mint-soft", fill: "bg-pastel-mint", ink: "text-pastel-mint-ink" },
};

const COUNT = YEAR_ITEMS.length;

/**
 * The horizontal scrub. Reads scene progress and slides a track that is
 * `COUNT * 100%` wide by `-100 * (COUNT - 1) / COUNT` percent of its own
 * width — percentage math, not a measured pixel width, so it holds at any
 * viewport size without a resize observer.
 */
function TimelineTrack() {
  const { isStatic } = useScene();
  const raw = useSceneValue([0.06, 0.94], [0, (-100 * (COUNT - 1)) / COUNT]);
  const x = useTransform(raw, (v) => `${v}%`);

  if (isStatic) {
    return (
      <Container>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {YEAR_ITEMS.map((item, i) => {
            const tone = TONE_STYLES[item.tone];
            return (
              <li
                key={item.title}
                className="rounded-xl border border-hairline bg-surface-card p-6"
              >
                <span className="text-caption text-muted font-mono uppercase tracking-[0.08em]">
                  {String(i + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
                </span>
                <span
                  className={`mt-2 inline-flex items-center rounded-pill px-3 py-1 text-caption-strong uppercase tracking-[0.06em] ${tone.fill} ${tone.ink}`}
                >
                  {item.tag}
                </span>
                <h3 className="text-title-sm text-ink mt-3">{item.title}</h3>
                <p className="text-body-sm text-body mt-2">{item.body}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    );
  }

  return (
    <motion.div className="flex h-full" style={{ width: `${COUNT * 100}%`, x }}>
      {YEAR_ITEMS.map((item, i) => {
        const tone = TONE_STYLES[item.tone];
        return (
          <div
            key={item.title}
            className="flex h-full flex-shrink-0 items-center justify-center px-4"
            style={{ width: `${100 / COUNT}%` }}
          >
            <div className="relative mx-auto flex max-w-[560px] flex-col items-center gap-4 text-center">
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full ${tone.wash} blur-2xl`}
              />
              <span className="text-caption text-muted font-mono relative uppercase tracking-[0.08em]">
                {String(i + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
              </span>
              <span
                className={`relative inline-flex items-center rounded-pill px-3 py-1 text-caption-strong uppercase tracking-[0.06em] ${tone.fill} ${tone.ink}`}
              >
                {item.tag}
              </span>
              <h3 className="text-title-lg text-ink relative max-w-[26ch]">{item.title}</h3>
              <p className="text-body-md text-body relative max-w-[44ch]">{item.body}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

/** "Year at a glance" — the chapter's recurring rhythm, scrubbed horizontally. */
export function YearTimeline() {
  return (
    <Section tone="soft" className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/[0.03] to-transparent"
      />
      <Container>
        <SectionHeading
          kicker="Year at a glance"
          title="What a year in the chapter looks like"
          sub="No two semesters are identical, but the rhythm repeats: welcome, community, career prep, celebration, and service. Scroll to move through it."
        />
      </Container>
      <ScrollScene length={3} className="mt-6 md:mt-10" stageClassName="pt-16">
        <TimelineTrack />
      </ScrollScene>
    </Section>
  );
}
