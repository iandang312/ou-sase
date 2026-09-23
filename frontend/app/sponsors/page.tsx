import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CloudImage } from "@/components/site/CloudImage";
import { SquiggleRails } from "@/components/site/SquiggleRails";
import { listSponsors } from "@/lib/firestore";
import { SPONSOR_TIERS, type Sponsor, type SponsorTier } from "@/lib/types";
import { SAMPLE_SPONSORS } from "@/components/sponsors/sampleSponsors";
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
  title: "Sponsors",
  description:
    "Partner with the OU SASE chapter: sponsor events, recruit engineering talent, and put your brand in front of Oklahoma's Asian American and Pacific Islander STEM community.",
};

const SPONSOR_EMAIL = "sase@ou.edu";

function sortSponsors(sponsors: Sponsor[]): Sponsor[] {
  return [...sponsors].sort((a, b) => {
    const tierDiff = SPONSOR_TIERS[a.tier].order - SPONSOR_TIERS[b.tier].order;
    if (tierDiff !== 0) return tierDiff;
    return a.order - b.order;
  });
}

function groupByTier(sponsors: Sponsor[]): Partial<Record<SponsorTier, Sponsor[]>> {
  const groups: Partial<Record<SponsorTier, Sponsor[]>> = {};
  for (const sponsor of sortSponsors(sponsors)) {
    const bucket = groups[sponsor.tier] ?? (groups[sponsor.tier] = []);
    bucket.push(sponsor);
  }
  return groups;
}

/** Logo tile size by tier — Platinum is visibly bigger, descending from there. */
const LOGO_SIZE: Record<SponsorTier, { width: number; height: number }> = {
  Platinum: { width: 240, height: 120 },
  Gold: { width: 192, height: 96 },
  Silver: { width: 160, height: 80 },
  Partner: { width: 140, height: 70 },
};

/* One pastel per tier — the tiers are the one place in the site where the
   secondary palette is allowed to run as a set. */
const TIER_BADGE_TONE: Record<SponsorTier, "brand" | "yellow" | "lavender" | "neutral"> = {
  Platinum: "lavender",
  Gold: "yellow",
  Silver: "brand",
  Partner: "neutral",
};

export default async function SponsorsPage(_props: PageProps<"/sponsors">) {
  const liveSponsors = await listSponsors(true);
  // Sample sponsors are invented company names. They are a build-time
  // convenience only — never show them on the live site.
  const usingSampleData = liveSponsors.length === 0 && SHOW_PLACEHOLDER_DATA;
  const sponsors = usingSampleData ? SAMPLE_SPONSORS : liveSponsors;
  const grouped = groupByTier(sponsors);
  const tiersInOrder = (Object.keys(SPONSOR_TIERS) as SponsorTier[]).sort(
    (a, b) => SPONSOR_TIERS[a].order - SPONSOR_TIERS[b].order,
  );

  return (
    <>
      {/* 1. Header band */}
      <Section tone="dark" className="relative overflow-hidden">
        <SquiggleRails tone="white" />
        <Container>
          <div className="flex max-w-[70ch] flex-col gap-6">
            <span className="text-caption-strong uppercase tracking-[0.08em] text-on-dark-soft">
              Sponsors &amp; recruiters
            </span>
            <h1 className="font-display text-display-md md:text-display-lg text-on-dark">
              Back the engineers and scientists OU sends into industry.
            </h1>
            <p className="text-body-md text-on-dark-soft max-w-[60ch]">
              OU SASE connects your company with a diverse, high-performing
              pipeline of engineering and STEM talent — plus visibility across
              campus all year. Sponsorship funds our workshops, socials, and
              travel to the national SASE conference, and puts your name in
              front of the students you want to hire.
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href={`mailto:${SPONSOR_EMAIL}?subject=OU%20SASE%20Sponsorship`}
                variant="primary"
                size="lg"
              >
                Become a sponsor
              </ButtonLink>
              <ButtonLink href="/recruitment" variant="outlineOnDark" size="lg">
                See our talent pipeline
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Current sponsors grouped by tier */}
      <Section tone="light">
        <Container>
          <SectionHeading
            kicker="Thank you"
            title="Our current sponsors"
            sub="Organizations supporting OU SASE this year, grouped by partnership tier."
          />

          {usingSampleData ? (
            <p className="mt-6 rounded-md border border-hairline bg-surface-soft px-4 py-3 text-caption text-muted">
              Sample data shown below — no sponsors are configured in
              Firestore yet. These are placeholder names, not real
              sponsors.
            </p>
          ) : null}

          {sponsors.length === 0 ? (
            <p className="text-body-md text-body border-hairline bg-surface-soft mt-8 rounded-lg border px-6 py-8">
              We&rsquo;re building our sponsor roster for this year. If your
              company would like to be the first name on this page, get in
              touch — the tiers below show what a partnership includes.
            </p>
          ) : null}

          <div className="mt-12 flex flex-col gap-16">
            {tiersInOrder.map((tier) => {
              const tierSponsors = grouped[tier];
              if (!tierSponsors || tierSponsors.length === 0) return null;
              const logoSize = LOGO_SIZE[tier];
              return (
                <div key={tier} className="flex flex-col gap-6">
                  <div className="flex items-baseline gap-3">
                    <Badge tone={TIER_BADGE_TONE[tier]}>
                      {SPONSOR_TIERS[tier].label}
                    </Badge>
                    <span className="text-body-sm text-muted">
                      {SPONSOR_TIERS[tier].blurb}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                    {tierSponsors.map((sponsor) => (
                      <Card key={sponsor.id} className="flex flex-col items-center gap-4 text-center">
                        <CloudImage
                          publicId={sponsor.logoPublicId}
                          alt={`${sponsor.name} logo`}
                          width={logoSize.width}
                          height={logoSize.height}
                          className="w-full rounded-sm object-contain"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-title-sm text-ink">
                            {sponsor.name}
                          </span>
                          {sponsor.blurb ? (
                            <span className="text-caption text-muted">
                              {sponsor.blurb}
                            </span>
                          ) : null}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. Why sponsor us — value props */}
      <Section tone="soft">
        <Container>
          <SectionHeading
            kicker="Why sponsor OU SASE"
            title="Three reasons companies partner with us"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card>
              <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
                Talent pipeline
              </span>
              <h3 className="mt-3 font-display text-title-lg text-ink">
                Direct access to engineers ready to intern and hire.
              </h3>
              <p className="mt-3 text-body-md text-body">
                Meet students across engineering, computer science, and
                the physical sciences before they hit the general applicant
                pool — through resume workshops, socials, and info sessions.
              </p>
            </Card>
            <Card>
              <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
                Brand on campus
              </span>
              <h3 className="mt-3 font-display text-title-lg text-ink">
                Visibility with OU’s engineering community all year.
              </h3>
              <p className="mt-3 text-body-md text-body">
                Your logo and presence show up at general body meetings,
                socials, and on this site — consistent exposure, not a
                one-day career fair booth.
              </p>
            </Card>
            <Card>
              <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
                Community impact
              </span>
              <h3 className="mt-3 font-display text-title-lg text-ink">
                Support belonging for Asian American &amp; Pacific
                Islander students in STEM.
              </h3>
              <p className="mt-3 text-body-md text-body">
                SASE builds community and professional development for a
                group historically underrepresented in engineering
                leadership. Your sponsorship funds that directly.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 4. Tier comparison */}
      <Section tone="light">
        <Container>
          <SectionHeading
            kicker="Partnership tiers"
            title="What each tier includes"
            sub="Every tier is customizable — reach out and we'll build a package around your goals."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <Card>
              <Badge tone="neutral">Partner</Badge>
              <p className="mt-4 text-title-md text-ink">
                {/* TODO: Huy — confirm pricing */}
                Community tier
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-body-sm text-body">
                <li>Logo on website</li>
                <li>Social media shoutout</li>
              </ul>
            </Card>
            <Card>
              <Badge tone="neutral">Silver</Badge>
              <p className="mt-4 text-title-md text-ink">
                {/* TODO: Huy — confirm pricing */}
                Supporting tier
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-body-sm text-body">
                <li>Everything in Partner</li>
                <li>Logo at general body meetings</li>
                <li>Newsletter mention</li>
              </ul>
            </Card>
            <Card tone="dark" className="md:scale-105 md:shadow-xl">
              <Badge tone="onDark">Gold — most popular</Badge>
              <p className="mt-4 text-title-md text-on-dark">
                {/* TODO: Huy — confirm pricing */}
                Career partner tier
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-body-sm text-on-dark-soft">
                <li>Everything in Silver</li>
                <li>Host a workshop or info session</li>
                <li>Resume book access</li>
                <li>Priority table at career fair socials</li>
              </ul>
            </Card>
            <Card>
              <Badge tone="lavender">Platinum</Badge>
              <p className="mt-4 text-title-md text-ink">
                {/* TODO: Huy — confirm pricing */}
                Presenting partner tier
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-body-sm text-body">
                <li>Everything in Gold</li>
                <li>Presenting sponsor of the annual banquet</li>
                <li>Featured logo placement, largest size</li>
                <li>First right of refusal to renew</li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 5. Dark CTA band */}
      <Section tone="dark" className="relative overflow-hidden">
        <SquiggleRails tone="white" />
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-display-sm md:text-display-md text-on-dark">
              Let’s build a partnership that fits your goals.
            </h2>
            <p className="max-w-[60ch] text-body-md text-on-dark-soft">
              Tell us what you’re looking for — recruiting, brand visibility,
              or community investment — and we’ll put together a proposal.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink
                href={`mailto:${SPONSOR_EMAIL}?subject=OU%20SASE%20Sponsorship`}
                variant="primary"
                size="lg"
              >
                Email sase@ou.edu
              </ButtonLink>
              <Button variant="outlineOnDark" size="lg" disabled>
                Download sponsor packet (coming soon)
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
