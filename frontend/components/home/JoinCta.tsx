import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { SquiggleRails } from "@/components/site/SquiggleRails";

/** Closing dark band: one CTA for students, one for recruiters. */
export function JoinCta() {
  return (
    <Section tone="dark" className="relative overflow-hidden">
      {/* This is the biggest tonal jump on the page (light -> dark); a
          deeper vignette right at the seam makes the drop feel intentional
          instead of abrupt. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent"
      />
      <SquiggleRails tone="white" />
      <Container>
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-5 text-center">
          <h2 className="font-display text-display-sm md:text-display-md text-on-dark">
            Come build with us
          </h2>
          <p className="text-body-md text-on-dark-soft max-w-[52ch]">
            Whether you&apos;re a student looking for your people or a
            recruiter looking for talent, there&apos;s a place to start below.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/recruitment" size="lg">
              Join the chapter
            </ButtonLink>
            <ButtonLink href="/sponsors" variant="outlineOnDark" size="lg">
              Recruiters, contact us
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
