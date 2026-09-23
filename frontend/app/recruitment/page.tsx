import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { RecruitmentBrowser } from "@/components/recruitment/RecruitmentBrowser";
import { TalentPoolScene } from "@/components/recruitment/TalentPoolScene";
import { HowRecruitingWorksScene } from "@/components/recruitment/HowRecruitingWorksScene";
import { SAMPLE_MEMBERS } from "@/components/recruitment/sampleMembers";
import { listVisibleMembers } from "@/lib/firestore";
import { SHOW_PLACEHOLDER_DATA } from "@/lib/placeholders";
import type { Member } from "@/lib/types";

/**
 * Re-render from Firestore at most once a minute.
 *
 * Without this Next prerenders this page at BUILD time and bakes the data in,
 * so anything an exec changes in /admin would never appear on the live site
 * until someone redeployed. 60s keeps Firestore reads bounded while making
 * admin edits show up on their own.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Recruitment",
  description:
    "Browse OU SASE members who have opted in to be seen by recruiters — majors, skills, and resumes for engineering and science talent at the University of Oklahoma.",
};

/** Three quick-scan numbers for the hero. Derived from the SAME already
 * privacy-filtered list rendered below — never a wider query. */
function heroStats(members: Member[]) {
  const majorCount = new Set(members.map((m) => m.major)).size;
  const seekingSoon = members.filter(
    (m) => m.seeking.includes("Internship") || m.seeking.includes("Co-op"),
  ).length;
  return [
    { value: members.length, label: members.length === 1 ? "Member visible" : "Members visible" },
    { value: majorCount, label: majorCount === 1 ? "Major represented" : "Majors represented" },
    { value: seekingSoon, label: "Seeking an internship or co-op" },
  ];
}

export default async function RecruitmentPage(_props: PageProps<"/recruitment">) {
  const visibleMembers = await listVisibleMembers();
  // Sample members are fictional people. Build-time convenience only —
  // publishing invented students to recruiters would be indefensible.
  const usingSampleData = visibleMembers.length === 0 && SHOW_PLACEHOLDER_DATA;
  const members = usingSampleData ? SAMPLE_MEMBERS : visibleMembers;
  const stats = heroStats(members);

  return (
    <>
      <Section tone="light" className="relative min-h-svh flex flex-col justify-center overflow-hidden">
        {/* Soft tinted wash behind the hero for depth, per DESIGN.md "Hero
            bands". Decorative only: aria-hidden, no pointer events, and it
            never touches text contrast since nothing sits inside it. */}
        <div
          aria-hidden="true"
          className="bg-pastel-blue-soft pointer-events-none absolute -right-24 -top-40 h-96 w-96 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-pastel-peach-soft pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full blur-3xl"
        />
        <Container className="relative">
          <h1 className="sr-only">OU SASE recruitment</h1>
          <SectionHeading
            kicker="For recruiters"
            title="Meet OU SASE's talent pipeline"
            sub="These are OU SASE members who have chosen to be visible to recruiters. Filter by graduation year, major, or what they're seeking, then reach out directly or contact the chapter to coordinate a broader search."
          />
          {usingSampleData ? (
            <p className="text-caption text-muted mt-4">
              Sample profiles shown below — placeholder data while chapter members
              publish their own.
            </p>
          ) : null}
          <Reveal as="div" className="mt-6">
            <ButtonLink href="mailto:sase@ou.edu" variant="primary">
              Contact the chapter
            </ButtonLink>
          </Reveal>

          {members.length > 0 ? (
            <div className="border-hairline mt-8 grid grid-cols-3 gap-6 border-t pt-6 sm:gap-10">
              <RevealGroup as="div">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="font-mono text-display-sm text-ink">{stat.value}</span>
                    <span className="text-caption text-muted">{stat.label}</span>
                  </div>
                ))}
              </RevealGroup>
            </div>
          ) : null}
        </Container>
      </Section>

      <TalentPoolScene members={members} />

      {/* The interactive browser stays a normal, freely scrollable section —
          never inside a sticky ScrollScene — so filtering, focus and the
          member cards keep working exactly as before. */}
      <Section tone="soft" className="min-h-svh">
        <Container>
          <h2 className="font-display text-display-sm md:text-display-md text-ink">
            Browse the roster
          </h2>
          <p className="mt-3 max-w-[60ch] text-body-md text-body">
            Filter by graduation year, major, or what a member is seeking.
            Results update as you type.
          </p>
          <div className="mt-8">
            <RecruitmentBrowser members={members} />
          </div>
        </Container>
      </Section>

      <HowRecruitingWorksScene />

      <Section tone="dark" className="min-h-svh flex flex-col justify-center">
        <Container>
          <SectionHeading
            tone="dark"
            kicker="Partner with us"
            title="Sponsor OU SASE or host an event"
            sub="Want first access to this talent pool at a career fair, info session, or workshop? See how chapter sponsorship works."
          />
          <div className="mt-6">
            <ButtonLink href="/sponsors" variant="outlineOnDark">
              View sponsorship options
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
