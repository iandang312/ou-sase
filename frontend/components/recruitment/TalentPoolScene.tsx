"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollScene, SceneStep, SceneProgressBar, useScene } from "@/components/ui/ScrollScene";
import type { Member } from "@/lib/types";

/**
 * Aggregate stats only — never an individual member's contact details. Those
 * live exclusively in <RecruitmentBrowser>, which stays a normal scrollable
 * list outside any sticky scene. This scene tells the shape of the pool
 * before a recruiter starts filtering it.
 */
function summarize(members: Member[]) {
  const majors = new Map<string, number>();
  const skills = new Map<string, number>();
  const seeking = new Map<string, number>();
  for (const m of members) {
    majors.set(m.major, (majors.get(m.major) ?? 0) + 1);
    for (const s of m.skills) skills.set(s, (skills.get(s) ?? 0) + 1);
    for (const s of m.seeking) seeking.set(s, (seeking.get(s) ?? 0) + 1);
  }
  const topMajors = [...majors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topSkills = [...skills.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const seekingBreakdown = [...seeking.entries()].sort((a, b) => b[1] - a[1]);
  return { topMajors, topSkills, seekingBreakdown };
}

function DecorativeBlob({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    />
  );
}

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

export function TalentPoolScene({ members }: { members: Member[] }) {
  const { topMajors, topSkills, seekingBreakdown } = summarize(members);

  if (members.length === 0) return null;

  return (
    <ScrollScene
      length={3}
      className="bg-canvas"
      stageClassName="px-5 md:px-8"
      aria-label="Who is in OU SASE's talent pool"
    >
      <SceneProgressBar />
      <DecorativeBlob className="bg-pastel-mint-soft -left-24 top-10 h-72 w-72" />
      <DecorativeBlob className="bg-pastel-blue-soft -right-20 bottom-0 h-80 w-80" />
      <div className="relative mx-auto h-full w-full max-w-[1200px]">
        <Stage>
          <SceneStep className="flex flex-col items-start justify-center pt-16" from={0} to={0.34} first>
            <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
              The talent pool
            </span>
            <h2 className="mt-3 font-display text-display-sm md:text-display-md text-ink max-w-[20ch]">
              Engineers and scientists, already organized for you.
            </h2>
            <p className="mt-4 max-w-[60ch] text-body-md text-body">
              Every profile below is a real OU SASE member who chose to be
              visible to recruiters. Scroll to see the shape of the pool
              before you start filtering it.
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-mono text-display-sm text-ink">{members.length}</span>
              <span className="text-body-sm text-muted">
                member{members.length === 1 ? "" : "s"} visible right now
              </span>
            </div>
          </SceneStep>

          <SceneStep className="flex flex-col items-start justify-center pt-16" from={0.33} to={0.67}>
            <span className="text-caption-strong uppercase tracking-[0.08em] text-pastel-mint-ink">
              Majors represented
            </span>
            <h3 className="mt-3 font-display text-title-lg text-ink max-w-[26ch]">
              Not just computer science.
            </h3>
            <p className="mt-2 max-w-[60ch] text-body-sm text-body">
              The chapter spans engineering and the physical sciences —
              useful if you are hiring beyond a single department.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {topMajors.map(([major, count]) => (
                <li key={major}>
                  <Badge tone="mint">
                    {major} · {count}
                  </Badge>
                </li>
              ))}
            </ul>
          </SceneStep>

          <SceneStep className="flex flex-col items-start justify-center pt-16" from={0.66} to={1} last>
            <span className="text-caption-strong uppercase tracking-[0.08em] text-pastel-lavender-ink">
              Skills &amp; what they&rsquo;re seeking
            </span>
            <h3 className="mt-3 font-display text-title-lg text-ink max-w-[28ch]">
              Ready for internships, co-ops, and full-time roles.
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {topSkills.map(([skill, count]) => (
                <li key={skill}>
                  <Badge tone="lavender">
                    {skill} · {count}
                  </Badge>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-2">
              {seekingBreakdown.map(([label, count]) => (
                <li key={label}>
                  <Badge tone="brand">
                    {label} · {count}
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <ButtonLink href="mailto:sase@ou.edu" variant="primary">
                Contact the chapter
              </ButtonLink>
            </div>
          </SceneStep>
        </Stage>
      </div>
    </ScrollScene>
  );
}
