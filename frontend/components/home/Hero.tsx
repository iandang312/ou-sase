"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { ScrollScene, SceneStep } from "@/components/ui/ScrollScene";
import { SquiggleRails } from "@/components/site/SquiggleRails";

/**
 * The opener, told in three beats as the reader scrolls: who we are, what we
 * do, who it's for. font-display stays weight 400 throughout — the restraint
 * is the whole voice, so nothing here gets a font-semibold/font-bold slapped
 * on it. Under reduced motion (ScrollScene's static mode) the three beats
 * stack in normal flow, fully visible, so the page still reads top to bottom.
 */
export function Hero() {
  return (
    <ScrollScene
      length={3}
      className="bg-canvas text-ink"
      stageClassName="pt-16 pb-10 md:pb-14"
      aria-label="Introduction to the chapter"
    >
      {/* Ambient washes behind the type — fill tokens, not text, softened
          with blur so they read as light rather than shapes. Shared across
          all three beats so the backdrop doesn't jump between them. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-pastel-blue-soft/80 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-16 hidden h-40 w-40 rounded-full bg-pastel-peach-soft/70 blur-2xl md:block"
      />
      <SquiggleRails tone="blue" />

      {/* Beat 1 — who we are. */}
      <SceneStep from={0} to={0.36} fade={0.08} first>
        <Container className="relative flex h-full flex-col items-center justify-center gap-7 text-center">
          <span className="text-caption-strong text-brand-ink uppercase tracking-[0.14em]">
            OU Chapter
          </span>
          {/* Two-line composition: scale and color carry the hierarchy, not
              weight — the second line sits a size down and in brand-ink, so
              it reads as a quiet answer to the first rather than a repeat. */}
          <h1 className="font-display flex flex-col gap-1 md:gap-2">
            <span className="text-display-lg md:text-display-mega text-ink">
              Engineers first.
            </span>
            <span className="text-display-sm md:text-display-lg text-brand-ink">
              Community always.
            </span>
          </h1>
          <p className="text-body-md md:text-title-md text-body max-w-[52ch]">
            SASE at OU is where Asian-heritage scientists and engineers build
            careers, find people who get it, and give back to campus and
            community along the way.
          </p>
        </Container>
      </SceneStep>

      {/* Beat 2 — what we do, previewed. The full breakdown arrives a
          section later; this is the one-line version of each pillar. */}
      <SceneStep from={0.32} to={0.68} fade={0.08}>
        <Container className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
          <span className="text-caption-strong text-brand-ink uppercase tracking-[0.14em]">
            What we do
          </span>
          <h2 className="font-display text-display-sm md:text-display-md text-ink max-w-[20ch]">
            Careers, community, and service — in one chapter
          </h2>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <span className="rounded-pill bg-pastel-blue-soft px-4 py-2 text-caption-strong text-pastel-blue-ink">
              Professional development
            </span>
            <span className="rounded-pill bg-pastel-peach-soft px-4 py-2 text-caption-strong text-pastel-peach-ink">
              Community
            </span>
            <span className="rounded-pill bg-pastel-mint-soft px-4 py-2 text-caption-strong text-pastel-mint-ink">
              Service
            </span>
          </div>
        </Container>
      </SceneStep>

      {/* Beat 3 — who it's for, plus the CTAs. Stays put at the end of the
          scene (last) so the reader lands on something actionable. */}
      <SceneStep from={0.64} to={1} fade={0.08} last>
        <Container className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
          <span className="text-caption-strong text-brand-ink uppercase tracking-[0.14em]">
            Who it&apos;s for
          </span>
          <h2 className="font-display text-display-sm md:text-display-md text-ink max-w-[24ch]">
            Students building a career. Recruiters building a pipeline.
          </h2>
          <p className="text-body-md text-body max-w-[48ch]">
            Whether you&apos;re looking for your people on campus or for
            talent that&apos;s ready to work, there&apos;s a place to start.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/recruitment" size="lg">
              Join the chapter
            </ButtonLink>
            <ButtonLink href="/sponsors" variant="secondary" size="lg">
              For recruiters
            </ButtonLink>
          </div>
        </Container>
      </SceneStep>
    </ScrollScene>
  );
}
