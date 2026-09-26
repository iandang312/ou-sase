/**
 * Every fact about SASEHacks lives here. Nothing below is invented: dates,
 * venues, prize amounts, sponsor names and track names are all placeholders
 * marked `// TODO(content):` for chapter officers to fill in once they're
 * confirmed. Generic, true hackathon copy (what a hackathon is, who can
 * come) is not a TODO — it doesn't depend on this year's specifics.
 */

export type PastelTone = "blue" | "mint" | "lavender" | "yellow" | "peach" | "pink";

export const EVENT = {
  name: "SASEHacks",
  kicker: "OU SASE presents",
  // TODO(content): confirm the tagline copy with the organizing team.
  tagline: "Build something real, with people you just met, in a weekend.",
  // TODO(content): set real dates once the venue is booked.
  dateLabel: "Date TBA",
  // TODO(content): confirm venue / building + room once reserved.
  venueLabel: "Venue TBA · Norman, OK",
  // TODO(content): swap for the real registration form URL (Google Form / Luma / etc).
  registerHref: "#register",
  // TODO(content): swap for a real interest form or mailing list signup.
  notifyHref: "#notify",
  // TODO(content): confirm the hack window length (24h / 36h / 48h).
  hoursLabel: "24",
  // TODO(content): confirm max team size.
  maxTeamSize: 4,
} as const;

export const WHAT_IS_BEATS: Array<{
  step: string;
  title: string;
  body: string;
  tone: PastelTone;
}> = [
  {
    step: "01",
    title: "Build something",
    body: `In ${EVENT.hoursLabel} hours, you and a team turn an idea into a working project — an app, a hardware hack, a website, whatever you can ship.`,
    tone: "blue",
  },
  {
    step: "02",
    title: "With people you just met",
    body: "Come solo or with friends. Team-formation happens at check-in, so first-time hackers leave with a team and new people to build with.",
    tone: "peach",
  },
  {
    step: "03",
    title: "And show it off",
    body: "Every team demos in front of judges and the room. Win or not, you leave with a project, a portfolio piece, and a story.",
    tone: "mint",
  },
];

export const TRACKS: Array<{
  name: string;
  description: string;
  tone: PastelTone;
}> = [
  // TODO(content): confirm real track names and prompts with sponsors/organizers.
  {
    name: "Track 1 — TBA",
    description: "General track. Build anything that fits the theme once it's announced.",
    tone: "blue",
  },
  {
    name: "Track 2 — TBA",
    description: "Sponsor-prompted track. Details land once a sponsor signs on.",
    tone: "lavender",
  },
  {
    name: "Track 3 — TBA",
    description: "Beginner-friendly track for first-time hackers.",
    tone: "mint",
  },
  {
    name: "Track 4 — TBA",
    description: "Open / wildcard track for projects that don't fit elsewhere.",
    tone: "peach",
  },
];

export type ScheduleItem = {
  day: string;
  time: string;
  label: string;
  tone: PastelTone;
};

export const SCHEDULE: ScheduleItem[] = [
  // TODO(content): every time below is a placeholder — confirm the real run of show.
  { day: "Day 1", time: "TBA", label: "Check-in & team formation", tone: "blue" },
  { day: "Day 1", time: "TBA", label: "Opening ceremony", tone: "blue" },
  { day: "Day 1", time: "TBA", label: "Hacking begins", tone: "mint" },
  { day: "Day 1", time: "TBA", label: "Dinner", tone: "peach" },
  { day: "Day 2", time: "TBA", label: "Workshops", tone: "lavender" },
  { day: "Day 2", time: "TBA", label: "Breakfast", tone: "peach" },
  { day: "Day 2", time: "TBA", label: "Hacking ends", tone: "mint" },
  { day: "Day 2", time: "TBA", label: "Judging", tone: "yellow" },
  { day: "Day 2", time: "TBA", label: "Awards & closing", tone: "pink" },
];

export const JUDGING_CRITERIA: Array<{ label: string; body: string }> = [
  {
    label: "Technical difficulty",
    body: "How much your team stretched to build it — new tools, hard problems, real engineering.",
  },
  {
    label: "Creativity",
    body: "Is the idea original, or a fresh take on a real problem?",
  },
  {
    label: "Execution",
    body: "Does it actually work? A working demo beats a good pitch about a broken one.",
  },
  {
    label: "Presentation",
    body: "Can your team explain what you built and why it matters in the time you get?",
  },
];

// TODO(content): prize tiers and dollar amounts once sponsorship is confirmed.
export const PRIZES_NOTE =
  "Prize details are coming soon — we're finalizing sponsorships. Every participant leaves with swag either way.";

export const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Who can attend?",
    a: "Any current student, any major, any experience level. You don't need to be a SASE member or a computer science major to come build.",
  },
  {
    q: "Does it cost anything?",
    // TODO(content): confirm final ticket price / whether it's free.
    a: "Pricing TBA — we're aiming to keep it free or as close to free as possible for students.",
  },
  {
    q: "Do I need experience?",
    a: "No. Beginners are welcome and encouraged — there will be workshops and mentors throughout the weekend, and teams are a great place to learn by doing.",
  },
  {
    q: "Can I come without a team?",
    a: `Yes. Team formation happens at check-in for anyone who comes solo. Teams can have up to ${EVENT.maxTeamSize} people.`,
  },
  {
    q: "What should I bring?",
    // TODO(content): confirm final packing list (laptop, charger, ID, sleeping bag, etc).
    a: "A laptop and charger at minimum. A full packing list is coming closer to the event.",
  },
];
