import type { ReactNode } from "react";

/**
 * DESIGN.md: depth comes from card-on-card layering and hairlines, NOT from
 * decorative drop shadows. A border plus a tone shift is the whole vocabulary.
 */
export function Card({
  children,
  className = "",
  tone = "light",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
  interactive?: boolean;
}) {
  const base =
    tone === "dark"
      ? "bg-surface-dark-elevated text-on-dark border-white/10"
      : "bg-surface-card text-ink border-hairline";
  return (
    <div
      className={`rounded-xl border p-6 md:p-8 ${base} ${
        interactive
          ? "transition-colors duration-150 hover:border-brand-ink/40 focus-within:border-brand-ink/40"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
