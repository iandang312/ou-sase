"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal. See DESIGN.md "Motion & Interaction".
 *
 * Rules this implements, and why each one matters:
 * - **Reveals once.** The observer disconnects after firing. Content that
 *   re-animates every time it scrolls back into view is exhausting to read.
 * - **Moves a little.** 16px of travel plus a fade (in globals.css). Large
 *   slides feel cheap and cause jank.
 * - **IntersectionObserver, not a scroll listener.** A scroll handler runs on
 *   every frame of every scroll; the observer costs nothing until it fires.
 * - **Fails open.** If IntersectionObserver is missing, or the observer somehow
 *   never fires, a timeout reveals the content anyway. A missing animation must
 *   never mean missing content. `<noscript>` in the root layout covers the
 *   JS-disabled case.
 * - **Respects reduced motion** via the media query in globals.css, which
 *   forces the shown state rather than merely zeroing the duration — otherwise
 *   the element would sit at opacity 0 forever.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  /** ms of delay, for staggering siblings. Cap a stagger at ~4 items. */
  delay = 0,
  /** Fraction of the element that must be visible before revealing. */
  threshold = 0.15,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const node = ref.current;

    // No element or no observer support: show it and move on.
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Already on screen at mount (above the fold) — reveal without waiting.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      // Negative bottom margin so content reveals a little before it reaches
      // the very edge of the viewport, which reads as more natural.
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);

    // Belt and braces: if the observer never fires for any reason, the content
    // still appears. Silent invisible content is far worse than a missed
    // animation.
    const failSafe = window.setTimeout(() => {
      setShown(true);
      observer.disconnect();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failSafe);
    };
  }, [shown, threshold]);

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={shown ? "shown" : ""}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Convenience wrapper for staggering a list. Caps the stagger at 4 steps —
 * beyond that the last item feels broken rather than choreographed.
 */
export function RevealGroup({
  children,
  className = "",
  step = 70,
  as,
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  as?: ElementType;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} as={as} className={className} delay={Math.min(i, 3) * step}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
