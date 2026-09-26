import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SquiggleRails } from "@/components/site/SquiggleRails";

interface Step {
  step: string;
  title: string;
  body: string;
}

const STUDENT_STEPS: Step[] = [
  {
    step: "01",
    title: "Fill out the interest form",
    body: "Tell us a little about yourself — it takes a couple of minutes and gets you on the chapter's mailing list.",
  },
  {
    step: "02",
    title: "Come to a GBM",
    body: "No commitment required. Come see what a meeting feels like before deciding it's for you.",
  },
  {
    step: "03",
    title: "Get involved",
    body: "Workshops, socials, service days — join whatever fits your schedule and interests first.",
  },
];

/** Closing dark band: what happens next, then one CTA for students, one for recruiters. */
export function JoinCta() {
  return (
    <Section tone="dark" className="relative min-h-svh overflow-hidden flex flex-col justify-center">
      {/* This is the biggest tonal jump on the page (light -> dark); a
          deeper vignette right at the seam makes the drop feel intentional
          instead of abrupt. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent"
      />
      <SquiggleRails tone="white" />
      <Container>
        <Reveal className="mx-auto flex max-w-[720px] flex-col items-center gap-5 text-center">
          <h2 className="font-display text-display-sm md:text-display-md text-on-dark">
            Come build with us
          </h2>
          <p className="text-body-md text-on-dark-soft max-w-[52ch]">
            Whether you&apos;re a student looking for your people or a
            recruiter looking for talent, there&apos;s a place to start below.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[920px] gap-5 sm:grid-cols-3">
          <RevealGroup className="contents" step={70}>
            {STUDENT_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center sm:text-left"
              >
                <span className="text-caption font-mono text-on-dark-soft">{item.step}</span>
                <h3 className="text-title-sm text-on-dark mt-2">{item.title}</h3>
                <p className="text-body-sm text-on-dark-soft mt-2">{item.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>

        <Reveal className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/recruitment" size="lg">
            Join the chapter
          </ButtonLink>
          <ButtonLink href="/sponsors" variant="outlineOnDark" size="lg">
            Recruiters, contact us
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
