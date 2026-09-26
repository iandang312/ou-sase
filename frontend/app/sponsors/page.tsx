import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CloudImage } from "@/components/site/CloudImage";
import { SquiggleRails } from "@/components/site/SquiggleRails";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { listSponsors } from "@/lib/firestore";
import { safeHttpUrl } from "@/lib/safeUrl";
import { SPONSOR_TIERS, type Sponsor, type SponsorTier } from "@/lib/types";
import { SAMPLE_SPONSORS } from "@/components/sponsors/sampleSponsors";
import { SHOW_PLACEHOLDER_DATA } from "@/lib/placeholders";
import { SupportFundsScene } from "@/components/sponsors/SupportFundsScene";
import { PartnerProcessScene } from "@/components/sponsors/PartnerProcessScene";

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
   secondary palette is allowed to run as a set (DESIGN.md "How much color").
   Lavender = prestige, yellow = attention, blue = neutral default, peach =
   warmth/community — kept identical across badge, card wash and the tier
   comparison table so a color always means the same tier everywhere. */
const TIER_BADGE_TONE: Record<SponsorTier, "brand" | "yellow" | "lavender" | "peach"> = {
  Platinum: "lavender",
  Gold: "yellow",
  Silver: "brand",
  Partner: "peach",
};

/** Soft wash behind each sponsor card — same family as its badge. */
const TIER_CARD_BG: Record<SponsorTier, string> = {
  Platinum: "bg-pastel-lavender-soft",
  Gold: "bg-pastel-yellow-soft",
  Silver: "bg-pastel-blue-soft",
  Partner: "bg-pastel-peach-soft",
};

/* Bento-ish rhythm: Platinum tiles are large and few per row, tapering down
   to a dense roster grid for Partner. Makes rank legible from layout alone,
   not just the badge label. */
const TIER_GRID_COLS: Record<SponsorTier, string> = {
  Platinum: "grid-cols-1 sm:grid-cols-2",
  Gold: "grid-cols-2 sm:grid-cols-3",
  Silver: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  Partner: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
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
      <Section tone="dark" className="relative min-h-svh flex flex-col justify-center overflow-hidden">
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

      {/* 2. Current sponsors grouped by tier. A live, reference-able roster
          with logos and outbound links — kept as a normal scrollable
          section, never inside a sticky scene, for the same reason the
          recruitment browser stays out of one: people need to scan and
          click freely, not scrub through it one company at a time. */}
      <Section tone="light" className="min-h-svh">
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
                <Reveal key={tier} className="flex flex-col gap-6">
                  <div className="flex items-baseline gap-3">
                    <Badge tone={TIER_BADGE_TONE[tier]}>
                      {SPONSOR_TIERS[tier].label}
                    </Badge>
                    <span className="text-body-sm text-muted">
                      {SPONSOR_TIERS[tier].blurb}
                    </span>
                  </div>
                  <div className={`grid gap-6 ${TIER_GRID_COLS[tier]}`}>
                    <RevealGroup>
                      {tierSponsors.map((sponsor) => {
                        const content = (
                          <Card
                            interactive
                            className={`flex h-full flex-col items-center gap-4 text-center transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1 ${TIER_CARD_BG[tier]}`}
                          >
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
                        );
                        // Render-time guard: only absolute http(s) links.
                        const website = safeHttpUrl(sponsor.websiteUrl);
                        return website ? (
                          <a
                            key={sponsor.id}
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2"
                            aria-label={`Visit ${sponsor.name}'s website`}
                          >
                            {content}
                          </a>
                        ) : (
                          <div key={sponsor.id} className="h-full">
                            {content}
                          </div>
                        );
                      })}
                    </RevealGroup>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <SupportFundsScene sponsorEmail={SPONSOR_EMAIL} />

      {/* 3. Why sponsor us — value props */}
      <Section tone="soft" className="min-h-svh flex flex-col justify-center">
        <Container>
          <SectionHeading
            kicker="Why sponsor OU SASE"
            title="Three reasons companies partner with us"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <RevealGroup>
              <Card
                interactive
                className="bg-pastel-mint-soft transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1"
              >
                <span className="text-caption-strong uppercase tracking-[0.08em] text-pastel-mint-ink">
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
              <Card
                interactive
                className="bg-pastel-blue-soft transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1"
              >
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
              <Card
                interactive
                className="bg-pastel-peach-soft transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1"
              >
                <span className="text-caption-strong uppercase tracking-[0.08em] text-pastel-peach-ink">
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
            </RevealGroup>
          </div>
        </Container>
      </Section>

      {/* 4. Tier comparison — kept as a normal, all-at-once section (not a
          ScrollScene) so a company can compare tiers side by side instead of
          scrubbing through them one at a time. */}
      <Section tone="light" className="min-h-svh flex flex-col justify-center">
        <Container>
          <SectionHeading
            kicker="Partnership tiers"
            title="What each tier includes"
            sub="Every tier is customizable — reach out and we'll build a package around your goals."
          />
          {/* Bento: Platinum runs twice as wide as Partner/Silver, and Gold
              is the one tier featured on a dark card — rank reads from the
              layout itself, not just the badge. */}
          <div className="mt-12 grid gap-6 md:grid-cols-5">
            <Reveal className="md:col-span-2" delay={0}>
              <Card
                interactive
                className="h-full bg-pastel-lavender-soft transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1 md:p-10"
              >
                <Badge tone="lavender">Platinum — presenting partner</Badge>
                <p className="mt-5 font-display text-title-lg text-ink">
                  {/* TODO: Huy — confirm pricing */}
                  Presenting partner tier
                </p>
                <ul className="mt-4 grid gap-2 text-body-sm text-body sm:grid-cols-2">
                  <li>Everything in Gold</li>
                  <li>Presenting sponsor of the annual banquet</li>
                  <li>Featured logo placement, largest size</li>
                  <li>First right of refusal to renew</li>
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={70}>
              <Card
                tone="dark"
                interactive
                className="h-full transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1 md:scale-105 md:shadow-xl"
              >
                <Badge tone="yellow">Gold — most popular</Badge>
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
            </Reveal>
            <Reveal delay={140}>
              <Card
                interactive
                className="h-full bg-pastel-blue-soft transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1"
              >
                <Badge tone="brand">Silver</Badge>
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
            </Reveal>
            <Reveal delay={210}>
              <Card
                interactive
                className="h-full bg-pastel-peach-soft transition-transform duration-base ease-standard hover:-translate-y-1 focus-within:-translate-y-1"
              >
                <Badge tone="peach">Partner</Badge>
                <p className="mt-4 text-title-md text-ink">
                  {/* TODO: Huy — confirm pricing */}
                  Community tier
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-body-sm text-body">
                  <li>Logo on website</li>
                  <li>Social media shoutout</li>
                </ul>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      <PartnerProcessScene sponsorEmail={SPONSOR_EMAIL} />

      {/* 5. Dark CTA band */}
      <Section tone="dark" className="relative min-h-svh flex flex-col justify-center overflow-hidden">
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
