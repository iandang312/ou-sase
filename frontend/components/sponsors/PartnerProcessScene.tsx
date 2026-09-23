"use client";

import { motion, useTransform } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollScene, SceneStep, SceneProgressBar, useScene, useSceneValue } from "@/components/ui/ScrollScene";

/**
 * Generic process description — no dollar amounts, dates, or company names,
 * since none of those are established facts in this repo yet. Pricing per
 * tier is still a TODO(content) on the tier comparison section below.
 */
const STEPS = [
  {
    tone: "brand" as const,
    kicker: "1. Reach out",
    title: "Tell us what you're looking for.",
    body: "Recruiting, brand visibility, or community investment — a short email is all it takes to start the conversation.",
  },
  {
    tone: "yellow" as const,
    kicker: "2. Pick a tier",
    title: "We build a package around your goals.",
    body: "Every tier below is a starting point, not a fixed menu — most partnerships end up custom.",
  },
  {
    tone: "mint" as const,
    kicker: "3. We coordinate together",
    title: "Workshops, tabling, and intro to the chapter's officers.",
    body: "Your sponsorship contact works directly with chapter leadership to schedule events and get your brand in front of members.",
  },
  {
    tone: "peach" as const,
    kicker: "4. Partnership goes live",
    title: "Your logo, blurb, and link appear on this page.",
    body: "Current sponsors are listed above by tier — that's exactly where your organization will show up.",
  },
] as const;

function Stage({ children }: { children: React.ReactNode }) {
  const { isStatic } = useScene();
  return (
    <div
      className={
        isStatic
          ? "flex flex-col gap-10 py-16"
          : "flex h-full flex-col justify-center gap-6 pt-16"
      }
    >
      {children}
    </div>
  );
}

/** A thin horizontal rail that fills left-to-right as the scene scrubs. */
function ProcessRail() {
  const { isStatic } = useScene();
  const fill = useSceneValue([0, 1], [0, 100]);
  const width = useTransform(fill, (v) => `${v}%`);
  if (isStatic) return null;
  return (
    <div
      className="pointer-events-none absolute bottom-10 left-0 h-1.5 w-full max-w-xs overflow-hidden rounded-pill bg-white/15"
      aria-hidden="true"
    >
      <motion.div className="h-full rounded-pill bg-pastel-yellow" style={{ width }} />
    </div>
  );
}

export function PartnerProcessScene({ sponsorEmail }: { sponsorEmail: string }) {
  return (
    <ScrollScene
      length={4}
      className="bg-surface-dark"
      stageClassName="px-5 md:px-8"
      aria-label="How to partner with OU SASE"
    >
      <SceneProgressBar />
      <div className="relative mx-auto h-full w-full max-w-[1200px]">
        <Stage>
          {STEPS.map((step, i) => (
            <SceneStep className="flex flex-col items-start justify-center pt-16"
              key={step.kicker}
              from={i / STEPS.length}
              to={(i + 1) / STEPS.length}
              first={i === 0}
              last={i === STEPS.length - 1}
            >
              {i === 0 ? (
                <span className="text-caption-strong uppercase tracking-[0.08em] text-on-dark-soft">
                  How to partner
                </span>
              ) : null}
              <Badge tone={step.tone} className="mt-3">
                {step.kicker}
              </Badge>
              {i === 0 ? (
                <h2 className="mt-4 font-display text-display-sm md:text-display-md text-on-dark max-w-[26ch]">
                  {step.title}
                </h2>
              ) : (
                <h3 className="mt-4 font-display text-display-sm md:text-display-md text-on-dark max-w-[26ch]">
                  {step.title}
                </h3>
              )}
              <p className="mt-4 max-w-[60ch] text-body-md text-on-dark-soft">{step.body}</p>
              {i === STEPS.length - 1 ? (
                <div className="mt-6">
                  <ButtonLink
                    href={`mailto:${sponsorEmail}?subject=OU%20SASE%20Sponsorship`}
                    variant="primary"
                  >
                    Start the conversation
                  </ButtonLink>
                </div>
              ) : null}
            </SceneStep>
          ))}
          <ProcessRail />
        </Stage>
      </div>
    </ScrollScene>
  );
}
