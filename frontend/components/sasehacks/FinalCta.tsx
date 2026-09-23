import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { SquiggleRails } from "@/components/site/SquiggleRails";
import { Reveal } from "@/components/ui/Reveal";
import { EVENT } from "./content";

/** Closing dark band. Editorial punctuation per DESIGN.md — the last thing read. */
export function FinalCta() {
  return (
    <Section tone="dark" className="relative overflow-hidden">
      <SquiggleRails tone="white" />
      <Container>
        <Reveal className="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center">
          <span className="font-[family-name:var(--font-sase-mono)] text-caption-strong uppercase tracking-[0.2em] text-pastel-blue">
            {EVENT.dateLabel} · {EVENT.venueLabel}
          </span>
          <h2 className="font-display text-display-sm text-on-dark md:text-display-md">
            See you at {EVENT.name}.
          </h2>
          <p className="text-body-md text-on-dark-soft max-w-[48ch]">
            Bring a team, or come find one. Beginners and veterans build side by side.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={EVENT.registerHref} size="lg">
              Register your team
            </ButtonLink>
            <ButtonLink href={EVENT.notifyHref} variant="outlineOnDark" size="lg">
              Get notified
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
