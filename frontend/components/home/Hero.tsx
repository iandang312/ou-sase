import { ButtonLink } from "@/components/ui/Button";
import { Section, Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SquiggleRails } from "@/components/site/SquiggleRails";

/**
 * The opener. font-display at weight 400 (inherited from the token) — the
 * restraint is the whole voice, so this never gets a font-semibold/font-bold
 * slapped on it.
 */
export function Hero() {
  return (
    <Section tone="light" className="relative overflow-hidden pt-24 md:pt-32 pb-20 md:pb-28">
      {/* Ambient wash behind the type. A fill token, not text — stays inside
          the pastel rule — softened with blur so it reads as light, not a
          shape. */}
      <Reveal className="pointer-events-none absolute left-1/2 top-[-220px] h-[480px] w-[820px] -translate-x-1/2">
        <div aria-hidden className="h-full w-full rounded-full bg-pastel-blue-soft/80 blur-3xl" />
      </Reveal>
      {/* Small peach accent — the one secondary family this hero permits,
          per DESIGN.md's two-families-per-component ceiling. */}
      <Reveal
        delay={120}
        className="pointer-events-none absolute right-[8%] top-16 hidden h-40 w-40 md:block"
      >
        <div aria-hidden className="h-full w-full rounded-full bg-pastel-peach-soft/70 blur-2xl" />
      </Reveal>
      <SquiggleRails tone="blue" />
      <Container>
        <div className="relative mx-auto flex max-w-[860px] flex-col items-center gap-7 text-center">
          <span className="text-caption-strong text-brand-ink uppercase tracking-[0.14em]">
            OU Chapter
          </span>
          {/* Two-line composition: scale and color carry the hierarchy, not
              weight — the display face stays 400 throughout. The second line
              sits a size down and in brand-ink, so it reads as a quiet answer
              to the first rather than a repeat of it. */}
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
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/recruitment" size="lg">
              Join the chapter
            </ButtonLink>
            <ButtonLink href="/sponsors" variant="secondary" size="lg">
              For recruiters
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
