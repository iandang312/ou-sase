"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollScene, SceneStep, SceneProgressBar, useScene } from "@/components/ui/ScrollScene";

const STEPS = [
  {
    tone: "brand" as const,
    kicker: "1. Browse & filter",
    title: "Search the roster above by major, class, or what they want.",
    body: "Every card only shows what that member chose to publish — grad year, skills, links, and whether they're open to an internship, co-op, full-time role, or research.",
  },
  {
    tone: "mint" as const,
    kicker: "2. Reach out directly",
    title: "Email, LinkedIn, and portfolio links sit right on each card.",
    body: "No middleman required for a first message — contact a member the same way you'd reach any candidate, using the links they've shared.",
  },
  {
    tone: "peach" as const,
    kicker: "3. Coordinate with the chapter",
    title: "Want a table at a general body meeting, a workshop, or a broader search?",
    body: "The chapter can help you reach members beyond this page, host an info session, or set up interviews on campus.",
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

export function HowRecruitingWorksScene() {
  return (
    <ScrollScene
      length={3}
      className="bg-surface-dark"
      stageClassName="px-5 md:px-8"
      aria-label="How recruiting with OU SASE works"
    >
      <SceneProgressBar />
      <div
        aria-hidden="true"
        className="bg-pastel-lavender/20 pointer-events-none absolute -right-28 top-16 h-80 w-80 rounded-full blur-3xl"
      />
      <div className="relative mx-auto h-full w-full max-w-[1200px]">
        <Stage>
          {STEPS.map((step, i) => (
            <SceneStep className="flex flex-col items-start justify-center pt-16"
              key={step.kicker}
              from={i / STEPS.length}
              to={(i + 1) / STEPS.length}
              first={i === 0}
              last={i === STEPS.length - 1}
            >
              <Badge tone={step.tone}>{step.kicker}</Badge>
              <h3 className="mt-4 font-display text-title-lg md:text-display-sm text-on-dark max-w-[28ch]">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[60ch] text-body-md text-on-dark-soft">{step.body}</p>
              {i === STEPS.length - 1 ? (
                <div className="mt-6 flex flex-wrap gap-4">
                  <ButtonLink href="mailto:sase@ou.edu" variant="primary">
                    Contact the chapter
                  </ButtonLink>
                  <ButtonLink href="/sponsors" variant="outlineOnDark">
                    See sponsorship options
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
