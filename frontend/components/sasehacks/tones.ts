import type { PastelTone } from "./content";

/**
 * Maps our PastelTone (which includes "blue" for the brand family, matching
 * DESIGN.md's family table) to Tailwind class fragments and to the Badge
 * component's tone prop (which spells the brand family "brand" instead of
 * "blue"). Centralized here so no section hand-rolls the pastel trio.
 */

export const BADGE_TONE: Record<PastelTone, "brand" | "mint" | "lavender" | "yellow" | "peach" | "pink"> = {
  blue: "brand",
  mint: "mint",
  lavender: "lavender",
  yellow: "yellow",
  peach: "peach",
  pink: "pink",
};

export const TONE_SOFT_BG: Record<PastelTone, string> = {
  blue: "bg-pastel-blue-soft",
  mint: "bg-pastel-mint-soft",
  lavender: "bg-pastel-lavender-soft",
  yellow: "bg-pastel-yellow-soft",
  peach: "bg-pastel-peach-soft",
  pink: "bg-pastel-pink-soft",
};

export const TONE_FILL_BG: Record<PastelTone, string> = {
  blue: "bg-pastel-blue",
  mint: "bg-pastel-mint",
  lavender: "bg-pastel-lavender",
  yellow: "bg-pastel-yellow",
  peach: "bg-pastel-peach",
  pink: "bg-pastel-pink",
};

export const TONE_INK_TEXT: Record<PastelTone, string> = {
  blue: "text-brand-ink",
  mint: "text-pastel-mint-ink",
  lavender: "text-pastel-lavender-ink",
  yellow: "text-pastel-yellow-ink",
  peach: "text-pastel-peach-ink",
  pink: "text-pastel-pink-ink",
};

export const TONE_BORDER: Record<PastelTone, string> = {
  blue: "border-pastel-blue-ink/25",
  mint: "border-pastel-mint-ink/25",
  lavender: "border-pastel-lavender-ink/25",
  yellow: "border-pastel-yellow-ink/25",
  peach: "border-pastel-peach-ink/25",
  pink: "border-pastel-pink-ink/25",
};
