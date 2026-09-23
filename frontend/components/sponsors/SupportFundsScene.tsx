"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollScene, SceneStep, SceneProgressBar, useScene } from "@/components/ui/ScrollScene";

/**
 * Reuses the SAME facts already stated in the page hero — "workshops,
 * socials, and travel to the national SASE conference" — split into one
 * beat per item instead of inventing new ones.
 */
const FUNDS = [
  {
    tone: "mint" as const,
    kicker: "Workshops & info sessions",
    title: "Resume reviews, technical workshops, and employer info sessions.",
    body: "Sponsorship covers the space, materials, and speaker coordination so members show up ready to talk to recruiters.",
  },
  {
    tone: "peach" as const,
    kicker: "Socials & community events",
    title: "General body meetings, socials, and the events that keep members coming back.",
    body: "A chapter people actually show up to is what makes the talent pool on the recruitment page worth meeting.",
  },
  {
    tone: "lavender" as const,
    kicker: "National SASE conference travel",
    title: "Sending members to the national SASE conference.",
    body: "Travel, registration, and lodging for students to attend — often their first national engineering conference.",
  },
] as const;

function Stage({ children }: { children: React.ReactNode }) {
  const { isStatic } = useScene();
  return (
    <div
      className={
        isStatic
          ? "flex flex-col gap-10 py-16"
          : "flex h-full flex-col justify-center gap-6 pt-16"
      }
    >
      {children}
    </div>
  );
}

export function SupportFundsScene({ sponsorEmail }: { sponsorEmail: string }) {
  return (
    <ScrollScene
      length={3}
      className="bg-surface-soft"
      stageClassName="px-5 md:px-8"
      aria-label="What sponsorship funds"
    >
      <SceneProgressBar />
      <div
        aria-hidden="true"
        className="bg-pastel-mint-soft pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full blur-3xl"
      />
      <div className="relative mx-auto h-full w-full max-w-[1200px]">
        <Stage>
          {FUNDS.map((item, i) => (
            <SceneStep className="flex flex-col items-start justify-center pt-16"
              key={item.kicker}
              from={i / FUNDS.length}
              to={(i + 1) / FUNDS.length}
              first={i === 0}
              last={i === FUNDS.length - 1}
            >
              {i === 0 ? (
                <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
                  What your support funds
                </span>
              ) : null}
              <Badge tone={item.tone} className="mt-3">
                {item.kicker}
              </Badge>
              {i === 0 ? (
                <h2 className="mt-4 font-display text-display-sm md:text-display-md text-ink max-w-[24ch]">
                  {item.title}
                </h2>
              ) : (
                <h3 className="mt-4 font-display text-display-sm md:text-display-md text-ink max-w-[24ch]">
                  {item.title}
                </h3>
              )}
              <p className="mt-4 max-w-[60ch] text-body-md text-body">{item.body}</p>
              {i === FUNDS.length - 1 ? (
                <div className="mt-6">
                  <ButtonLink href={`mailto:${sponsorEmail}?subject=OU%20SASE%20Sponsorship`} variant="primary">
                    Become a sponsor
                  </ButtonLink>
                </div>
              ) : null}
            </SceneStep>
          ))}
        </Stage>
      </div>
    </ScrollScene>
  );
}
