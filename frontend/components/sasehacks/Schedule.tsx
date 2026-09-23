"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Layout";
import { ScrollScene, SceneProgressBar, useScene, useSceneValue } from "@/components/ui/ScrollScene";
import { SCHEDULE } from "./content";
import { TONE_FILL_BG, TONE_INK_TEXT, TONE_SOFT_BG } from "./tones";

function ScheduleCard({
  item,
  fullWidth = false,
}: {
  item: (typeof SCHEDULE)[number];
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 flex-row items-center gap-4 rounded-xl border border-hairline p-5 sm:flex-col sm:items-start sm:gap-2 ${
        fullWidth ? "w-full" : "w-[220px]"
      } ${TONE_SOFT_BG[item.tone]}`}
    >
      <span className={`text-caption-strong uppercase tracking-[0.08em] ${TONE_INK_TEXT[item.tone]}`}>
        {item.day}
      </span>
      <span className="font-[family-name:var(--font-sase-mono)] text-title-md text-ink">
        {item.time}
      </span>
      <p className="text-body-sm text-body">{item.label}</p>
      <span aria-hidden className={`h-1 w-8 rounded-pill ${TONE_FILL_BG[item.tone]}`} />
    </div>
  );
}

/** The horizontal scrubbing track, animated mode only. */
function HorizontalTimeline() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [travel, setTravel] = useState(0);

  // Scroll just far enough that the last card ends at the right edge. A fixed
  // distance overshoots on wide screens and leaves a single card stranded.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Leave the first and last ~8% of progress still, so the reader has a moment
  // to land before and after the horizontal move.
  const x = useSceneValue([0.08, 0.92], [0, -travel]);
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-4 px-5 md:px-8">
        {SCHEDULE.map((item, i) => (
          <ScheduleCard key={`${item.day}-${item.label}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

function StaticSchedule() {
  return (
    <Container>
      <ol className="flex flex-col gap-3">
        {SCHEDULE.map((item, i) => (
          <li key={`${item.day}-${item.label}-${i}`}>
            <ScheduleCard item={item} />
          </li>
        ))}
      </ol>
    </Container>
  );
}

function ScheduleBody() {
  const { isStatic } = useScene();
  return isStatic ? <StaticSchedule /> : <HorizontalTimeline />;
}

export function Schedule() {
  return (
    <ScrollScene length={3} className="bg-canvas" aria-label="SASEHacks weekend schedule">
      <div className="relative flex h-full w-full flex-col justify-center gap-8 pt-16">
        <SceneProgressBar colorClass="bg-brand-ink/70" />
        <Container>
          <div className="mb-8 text-center">
            <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
              The weekend
            </span>
            <h2 className="font-display mt-2 text-display-sm text-ink md:text-display-md">
              A run of show, roughly
            </h2>
            <p className="mx-auto mt-2 max-w-[52ch] text-body-md text-body">
              Every time below is a placeholder. Scroll through the weekend — or read it top to
              bottom if you&apos;d rather.
            </p>
          </div>
        </Container>
        <div className="w-full">
          <ScheduleBody />
        </div>
      </div>
    </ScrollScene>
  );
}
