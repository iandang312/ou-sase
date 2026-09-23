import { ButtonLink } from "@/components/ui/Button";
import { Section, Container } from "@/components/ui/Layout";
import { SquiggleRails } from "@/components/site/SquiggleRails";

/**
 * The opener. font-display at weight 400 (inherited from the token) — the
 * restraint is the whole voice, so this never gets a font-semibold/font-bold
 * slapped on it.
 */
export function Hero() {
  return (
    <Section tone="light" className="relative overflow-hidden pt-20 md:pt-28">
      <SquiggleRails tone="blue" />
      <Container>
        <div className="mx-auto flex max-w-[820px] flex-col items-center gap-6 text-center">
          <span className="text-caption-strong text-brand-ink uppercase tracking-[0.08em]">
            OU Chapter
          </span>
          <h1 className="font-display text-display-lg md:text-display-mega text-ink">
            Engineers first. Community always.
          </h1>
          <p className="text-body-md md:text-title-md text-body max-w-[56ch]">
            SASE at OU is where Asian-heritage scientists and engineers build
            careers, find people who get it, and give back to campus and
            community along the way.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
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
