import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";

/** Plain band, not a scroll scene — a short pointer to the existing sponsors page. */
export function SponsorCta() {
  return (
    <Section tone="soft">
      <Container>
        <Reveal className="mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center">
          <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
            Partner with us
          </span>
          <h2 className="font-display text-display-sm text-ink md:text-display-md">
            Want to sponsor SASEHacks?
          </h2>
          <p className="text-body-md text-body max-w-[52ch]">
            Sponsorship puts your company in front of a weekend of engaged, building students —
            and helps us keep the event accessible. See what partnership includes on our sponsors
            page.
          </p>
          <ButtonLink href="/sponsors" size="lg">
            Sponsor SASEHacks
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
