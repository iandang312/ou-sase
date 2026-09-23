import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { RecruitmentBrowser } from "@/components/recruitment/RecruitmentBrowser";
import { SAMPLE_MEMBERS } from "@/components/recruitment/sampleMembers";
import { listVisibleMembers } from "@/lib/firestore";
import { SHOW_PLACEHOLDER_DATA } from "@/lib/placeholders";

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

export default async function RecruitmentPage(_props: PageProps<"/recruitment">) {
  const visibleMembers = await listVisibleMembers();
  // Sample members are fictional people. Build-time convenience only —
  // publishing invented students to recruiters would be indefensible.
  const usingSampleData = visibleMembers.length === 0 && SHOW_PLACEHOLDER_DATA;
  const members = usingSampleData ? SAMPLE_MEMBERS : visibleMembers;

  return (
    <>
      <Section tone="light">
        <Container>
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
          <div className="mt-6">
            <ButtonLink href="mailto:sase@ou.edu" variant="primary">
              Contact the chapter
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <RecruitmentBrowser members={members} />
        </Container>
      </Section>

      <Section tone="dark">
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
