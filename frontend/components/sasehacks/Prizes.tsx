"use client";

import { motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Layout";
import { ScrollScene, SceneStep, useSceneValue } from "@/components/ui/ScrollScene";
import { JUDGING_CRITERIA, PRIZES_NOTE } from "./content";

/**
 * Judging criteria accumulate one at a time as the reader scrolls (each row
 * has its own opacity/y window so earlier rows stay visible once shown),
 * then a "prizes: coming soon" banner arrives as the closing SceneStep.
 */
function FadeUp({
  opacity,
  y,
  children,
  className = "",
}: {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

function CriteriaRow({
  index,
  count,
  label,
  body,
}: {
  index: number;
  count: number;
  label: string;
  body: string;
}) {
  const start = 0.05 + (index / count) * 0.6;
  const end = start + 0.22;
  const opacity = useSceneValue([start, end], [0, 1]);
  const y = useSceneValue([start, end], [20, 0]);
  return (
    <FadeUp opacity={opacity} y={y} className="flex items-start gap-4">
      <span className="font-[family-name:var(--font-sase-mono)] text-title-md text-pastel-pink-ink">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-title-sm text-ink">{label}</h3>
        <p className="text-body-sm text-body">{body}</p>
      </div>
    </FadeUp>
  );
}

export function Prizes() {
  return (
    <ScrollScene length={3} className="bg-pastel-pink-soft" aria-label="Judging criteria and prizes">
      <div className="relative flex h-full w-full items-center pt-16">
        <Container className="flex w-full flex-col gap-10">
          <div className="text-center">
            <span className="text-caption-strong uppercase tracking-[0.08em] text-pastel-pink-ink">
              Judging
            </span>
            <h2 className="font-display mt-2 text-display-sm text-ink md:text-display-md">
              What judges look for
            </h2>
          </div>
          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6">
            {JUDGING_CRITERIA.map((criterion, i) => (
              <CriteriaRow
                key={criterion.label}
                index={i}
                count={JUDGING_CRITERIA.length}
                label={criterion.label}
                body={criterion.body}
              />
            ))}
          </div>
          <SceneStep
            from={0.78}
            to={1}
            last
            inFlow
            className="mx-auto flex max-w-[52ch] flex-col items-center gap-3 rounded-xl border border-pastel-pink-ink/25 bg-canvas/80 p-6 text-center"
          >
            <span className="text-caption-strong uppercase tracking-[0.08em] text-pastel-pink-ink">
              Prizes
            </span>
            <p className="text-body-md text-body">{PRIZES_NOTE}</p>
          </SceneStep>
        </Container>
      </div>
    </ScrollScene>
  );
}
