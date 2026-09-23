import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "dark"
  | "outlineOnDark"
  | "text";
type Size = "md" | "lg";

/**
 * DESIGN.md: every button is a pill. Primary is the pastel brand blue and is
 * used SCARCELY — one primary per view. If you find yourself adding a second,
 * one of them is a secondary.
 *
 * A pastel fill carries dark type (text-on-brand is ink, not white), so the
 * disabled state has to drop the TEXT contrast too — a paler pastel alone
 * still reads as enabled.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-active active:bg-brand-active " +
    "disabled:bg-brand-disabled disabled:text-muted-soft",
  secondary:
    "bg-surface-strong text-ink hover:bg-hairline active:bg-hairline",
  dark: "bg-surface-dark-elevated text-on-dark hover:bg-black/80",
  outlineOnDark:
    "bg-transparent text-on-dark border border-white/30 hover:bg-white/10",
  text: "bg-transparent text-brand-ink hover:text-brand-ink-active hover:underline underline-offset-4 px-0",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-button",
  lg: "h-14 px-8 text-button",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold " +
  "transition-colors duration-150 disabled:cursor-not-allowed select-none whitespace-nowrap";

function classes(variant: Variant, size: Size, className?: string) {
  const sizing = variant === "text" ? "text-button" : SIZES[size];
  return [BASE, VARIANTS[variant], sizing, className].filter(Boolean).join(" ");
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

/** Same pill, but navigates. Use for CTAs that go somewhere. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
