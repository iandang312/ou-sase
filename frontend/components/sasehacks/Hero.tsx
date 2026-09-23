"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { ScrollScene, SceneStep, useSceneValue } from "@/components/ui/ScrollScene";
import { EVENT } from "./content";

/**
 * Dark kinetic hero. The title itself only ever animates via SceneStep's
 * fade/rise (per DESIGN.md: parallax and continuous scroll-scrubbing stay off
 * text) — the "kinetic" feel comes from the decorative glow and grid scaling
 * under it via useSceneValue. Centered with flex rather than translate
 * utilities, since a MotionValue in `style` replaces the whole inline
 * transform and would otherwise clobber a Tailwind translate.
 */
function HeroGlow() {
  const scale = useSceneValue([0, 1], [0.85, 1.25]);
  const opacity = useSceneValue([0, 0.7, 1], [0.5, 0.9, 0.6]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        style={{ scale, opacity }}
        className="h-[420px] w-[620px] rounded-full bg-pastel-blue/30 blur-3xl md:h-[560px] md:w-[860px]"
      />
    </div>
  );
}

export function Hero() {
  return (
    <ScrollScene length={2} className="bg-surface-dark" aria-label="SASEHacks introduction">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden pt-16">
        <HeroGlow />
        <Container className="relative">
          <SceneStep from={0} to={0.55} first className="flex flex-col items-center gap-5 text-center">
            <span className="font-[family-name:var(--font-sase-mono)] text-caption-strong text-pastel-blue uppercase tracking-[0.2em]">
              {EVENT.kicker}
            </span>
            <h1 className="font-display text-display-lg text-on-dark md:text-display-mega">
              {EVENT.name}
            </h1>
            <p className="max-w-[46ch] text-body-md text-on-dark-soft md:text-title-md">
              {EVENT.tagline}
            </p>
          </SceneStep>

          <SceneStep
            from={0.4}
            to={1}
            last
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-pill border border-white/20 bg-white/5 px-4 py-2 text-caption-strong text-on-dark">
                {EVENT.dateLabel}
              </span>
              <span className="rounded-pill border border-white/20 bg-white/5 px-4 py-2 text-caption-strong text-on-dark">
                {EVENT.venueLabel}
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={EVENT.registerHref} size="lg">
                Register your team
              </ButtonLink>
              <ButtonLink href={EVENT.notifyHref} variant="outlineOnDark" size="lg">
                Get notified
              </ButtonLink>
            </div>
          </SceneStep>
        </Container>
      </div>
    </ScrollScene>
  );
}
