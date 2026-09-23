"use client";

import { Container } from "@/components/ui/Layout";
import { ScrollScene, SceneStep, SceneProgressBar } from "@/components/ui/ScrollScene";
import { WHAT_IS_BEATS } from "./content";
import { TONE_FILL_BG, TONE_INK_TEXT, TONE_SOFT_BG } from "./tones";

/**
 * Three beats, one per screen: build -> with people you just met -> show it
 * off. Each beat is a full SceneStep so only one is on screen at a time,
 * which is the point — it paces the three ideas instead of listing them.
 */
export function WhatIs() {
  return (
    <ScrollScene length={3} className="bg-canvas" aria-label="What SASEHacks is">
      <div className="relative h-full w-full pt-16">
        <SceneProgressBar colorClass="bg-brand-ink/70" />
        <Container className="flex h-full items-center">
          <h2 className="sr-only">What is SASEHacks</h2>
          {WHAT_IS_BEATS.map((beat, i) => (
            <SceneStep
              key={beat.step}
              from={i === 0 ? 0 : i / WHAT_IS_BEATS.length - 0.03}
              to={i === WHAT_IS_BEATS.length - 1 ? 1 : (i + 1) / WHAT_IS_BEATS.length + 0.03}
              first={i === 0}
              last={i === WHAT_IS_BEATS.length - 1}
              className="flex w-full flex-col items-center justify-center gap-6 pt-16 text-center"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full ${TONE_SOFT_BG[beat.tone]}`}
              >
                <span
                  className={`font-[family-name:var(--font-sase-mono)] text-title-lg ${TONE_INK_TEXT[beat.tone]}`}
                >
                  {beat.step}
                </span>
              </div>
              <h3 className="font-display text-display-sm text-ink md:text-display-md">
                {beat.title}
              </h3>
              <p className="max-w-[52ch] text-body-md text-body md:text-title-md">{beat.body}</p>
              <span
                aria-hidden
                className={`h-1.5 w-16 rounded-pill ${TONE_FILL_BG[beat.tone]}`}
              />
            </SceneStep>
          ))}
        </Container>
      </div>
    </ScrollScene>
  );
}
