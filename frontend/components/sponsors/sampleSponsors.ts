import type { Sponsor } from "@/lib/types";

/**
 * PLACEHOLDER SPONSOR DATA.
 *
 * Firestore has no seeded sponsors yet, so /sponsors falls back to this list
 * so the page still renders with a realistic layout. Every name here is an
 * obviously-fake placeholder ("Example", "Placeholder", "Sample") — none of
 * these are real companies and none of this should be read as an actual
 * sponsorship claim. Replace by seeding the `sponsors` collection in
 * Firestore (see lib/firestore.ts `upsertSponsor`), then delete this file's
 * usage in app/sponsors/page.tsx.
 */
export const SAMPLE_SPONSORS: Sponsor[] = [
  {
    id: "sample-platinum-1",
    name: "Example Energy Co.",
    tier: "Platinum",
    blurb: "Sample data — presenting partner for the annual SASE banquet.",
    since: 2023,
    active: true,
    order: 0,
  },
  {
    id: "sample-gold-1",
    name: "Placeholder Robotics",
    tier: "Gold",
    blurb: "Sample data — hosts a spring resume workshop and info session.",
    since: 2024,
    active: true,
    order: 0,
  },
  {
    id: "sample-gold-2",
    name: "Sample Aerodyne Systems",
    tier: "Gold",
    blurb: "Sample data — recruits new grads through the chapter each fall.",
    since: 2023,
    active: true,
    order: 1,
  },
  {
    id: "sample-silver-1",
    name: "Fictitious Manufacturing Group",
    tier: "Silver",
    blurb: "Sample data — sponsors general body meeting pizza nights.",
    since: 2025,
    active: true,
    order: 0,
  },
  {
    id: "sample-silver-2",
    name: "Demo Semiconductor Labs",
    tier: "Silver",
    blurb: "Sample data — provided swag for the fall welcome social.",
    since: 2024,
    active: true,
    order: 1,
  },
  {
    id: "sample-partner-1",
    name: "Test Logistics Partners",
    tier: "Partner",
    blurb: "Sample data — community partner supporting outreach events.",
    since: 2025,
    active: true,
    order: 0,
  },
];
