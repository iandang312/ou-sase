import type { ElementType, ReactNode } from "react";

/**
 * Horizontal rhythm. DESIGN.md: 1200px max, generous gutters, and whitespace
 * is a feature — do not fill it.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

type Tone = "light" | "soft" | "dark";

const TONES: Record<Tone, string> = {
  light: "bg-canvas text-ink",
  soft: "bg-surface-soft text-ink",
  dark: "bg-surface-dark text-on-dark",
};

/**
 * A page band. The page rhythm rotates light -> soft -> dark; alternating
 * tones is what gives the design its editorial pacing, so prefer changing
 * tone between adjacent sections.
 */
export function Section({
  children,
  tone = "light",
  className = "",
  as: Tag = "section",
  id,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  as?: ElementType;
  id?: string;
}) {
  return (
    <Tag id={id} className={`${TONES[tone]} py-16 md:py-24 ${className}`}>
      {children}
    </Tag>
  );
}

/** Section heading + optional kicker//sub, at the DESIGN.md display sizes. */
export function SectionHeading({
  kicker,
  title,
  sub,
  tone = "light",
  align = "left",
}: {
  kicker?: string;
  title: string;
  sub?: string;
  tone?: Tone;
  align?: "left" | "center";
}) {
  const onDark = tone === "dark";
  return (
    <header
      className={`flex flex-col gap-3 ${align === "center" ? "items-center text-center" : ""}`}
    >
      {kicker ? (
        <span
          className={`text-caption-strong uppercase tracking-[0.08em] ${
            onDark ? "text-on-dark-soft" : "text-brand-ink"
          }`}
        >
          {kicker}
        </span>
      ) : null}
      <h2
        className={`font-display text-display-sm md:text-display-md ${
          onDark ? "text-on-dark" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub ? (
        <p
          className={`max-w-[60ch] text-body-md ${
            onDark ? "text-on-dark-soft" : "text-body"
          }`}
        >
          {sub}
        </p>
      ) : null}
    </header>
  );
}
