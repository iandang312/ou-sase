import type { ReactNode } from "react";

type Tone =
  | "neutral"
  | "brand"
  | "onDark"
  | "positive"
  | "yellow"
  | "pink"
  | "mint"
  | "lavender"
  | "peach";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-strong text-ink",
  // Pastel fill + its matching ink. Never the pastel as type.
  brand: "bg-pastel-blue-soft text-brand-ink",
  onDark: "bg-white/10 text-on-dark",
  positive: "bg-positive-soft text-positive",
  yellow: "bg-pastel-yellow-soft text-pastel-yellow-ink",
  pink: "bg-pastel-pink-soft text-pastel-pink-ink",
  mint: "bg-pastel-mint-soft text-pastel-mint-ink",
  lavender: "bg-pastel-lavender-soft text-pastel-lavender-ink",
  peach: "bg-pastel-peach-soft text-pastel-peach-ink",
};

/** DESIGN.md badge-pill: 12px/600, pill radius, 4px 12px. */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-caption-strong ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
