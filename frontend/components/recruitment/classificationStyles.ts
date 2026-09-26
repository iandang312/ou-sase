import type { Classification } from "@/lib/types";

/**
 * Quiet color coding for a member's classification, mirroring the "seeking"
 * chip pattern (see seekingStyles.ts): pastel soft fill + matching ink type.
 * The six classifications map 1:1 onto the six pastel families, which is
 * exactly the case DESIGN.md carves out for the full set to run together —
 * the variety here *is* the information. Kept to a single small badge per
 * card (not repeated as a filter row) so it stays quiet next to the louder
 * "seeking" chips.
 */
export const CLASSIFICATION_BADGE_TONE: Record<
  Classification,
  "brand" | "yellow" | "pink" | "mint" | "lavender" | "peach"
> = {
  Freshman: "peach",
  Sophomore: "yellow",
  Junior: "brand",
  Senior: "lavender",
  Graduate: "pink",
  Alumni: "mint",
};
