import type { Member } from "@/lib/types";

export type Seeking = Member["seeking"][number];

export const SEEKING_OPTIONS: Seeking[] = ["Internship", "Co-op", "Full-time", "Research"];

/**
 * One color per "seeking" category, shared by the filter chips and the
 * member cards so a recruiter can pattern-match by color across the whole
 * page (e.g. "I only care about mint = full-time"). Each pairs an existing
 * pastel fill with its readable -ink companion — never a bare pastel as type.
 */
export const SEEKING_BADGE_TONE: Record<Seeking, "brand" | "mint" | "peach" | "lavender"> = {
  Internship: "brand",
  "Co-op": "peach",
  "Full-time": "mint",
  Research: "lavender",
};

/** Solid-fill chip classes for the SELECTED filter state. */
export const SEEKING_FILL_CLASS: Record<Seeking, string> = {
  Internship: "bg-pastel-blue text-pastel-blue-ink",
  "Co-op": "bg-pastel-peach text-pastel-peach-ink",
  "Full-time": "bg-pastel-mint text-pastel-mint-ink",
  Research: "bg-pastel-lavender text-pastel-lavender-ink",
};

/** Soft-tint chip classes for the UNSELECTED (but still color-coded) state. */
export const SEEKING_SOFT_CLASS: Record<Seeking, string> = {
  Internship: "bg-pastel-blue-soft text-pastel-blue-ink",
  "Co-op": "bg-pastel-peach-soft text-pastel-peach-ink",
  "Full-time": "bg-pastel-mint-soft text-pastel-mint-ink",
  Research: "bg-pastel-lavender-soft text-pastel-lavender-ink",
};
