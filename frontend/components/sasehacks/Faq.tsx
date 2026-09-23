import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { RevealGroup } from "@/components/ui/Reveal";
import { FAQ_ITEMS } from "./content";

/**
 * Native <details> accordion — normal flow, not a scroll scene. Each summary
 * is a 44px+ tap target and the browser handles keyboard/AT semantics for
 * free, which is worth more here than a custom animated disclosure.
 */
export function Faq() {
  return (
    <Section tone="light">
      <Container className="flex flex-col gap-10">
        <SectionHeading kicker="Good to know" title="Frequently asked questions" />
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
          <RevealGroup>
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-hairline bg-surface-card open:bg-surface-soft"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-title-sm text-ink">
                  {item.q}
                  <span aria-hidden className="text-body-md text-brand-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 text-body-sm text-body">{item.a}</p>
              </details>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
