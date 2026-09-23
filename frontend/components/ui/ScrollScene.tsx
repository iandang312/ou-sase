"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { createContext, useContext, useRef, useSyncExternalStore, type ReactNode } from "react";

/**
 * Scroll-told sections. See DESIGN.md "Motion & Interaction".
 *
 * A ScrollScene is taller than the viewport (`length` screens tall). Inside it
 * a full-height stage sticks to the top while the scene scrolls past, and the
 * scene's scroll progress (0 → 1) drives what the stage shows. Content is
 * relayed by scrolling instead of all being on screen at once.
 *
 * Rules this implements, and why:
 * - **Static fallback.** Under prefers-reduced-motion the scene is NOT tall
 *   and NOT sticky: every step renders in normal flow, fully visible. Reduced
 *   motion means content arrives instantly, never that it never arrives.
 *   Consumers read `isStatic` from useScene() when their layout differs.
 * - **Fails open without JS.** Steps carry data-scene-step, which the root
 *   layout's <noscript> style forces visible.
 * - **Compositor-only.** Steps animate opacity and transform only.
 */

type SceneContext = { progress: MotionValue<number>; isStatic: boolean };

const Ctx = createContext<SceneContext | null>(null);

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCE);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Not Motion's useReducedMotion: that returns the real preference on the very
 * first client render, while the server always rendered the animated layout,
 * so reduced-motion users got a hydration mismatch. The server snapshot keeps
 * hydration identical; React then re-renders with the real value.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

export function useScene(): SceneContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useScene must be used inside <ScrollScene>");
  return ctx;
}

export function ScrollScene({
  children,
  /** Scene height in viewport heights. 2–4 is the useful range. */
  length = 3,
  className = "",
  stageClassName = "",
  id,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  length?: number;
  className?: string;
  stageClassName?: string;
  id?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Deliberately a function transform. Motion hands plain scroll-linked
  // transforms to a native ScrollTimeline animation, which does not hold its
  // end value once the scene scrolls past: finished steps snapped back to
  // their initial, invisible style. A function can't be offloaded, so every
  // derived value stays JS-driven, and the clamp pins it at 0 and 1.
  const progress = useTransform(scrollYProgress, (v) => Math.min(Math.max(v, 0), 1));

  return (
    <Ctx.Provider value={{ progress, isStatic: reduced }}>
      <section
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        className={`relative ${className}`}
        style={reduced ? undefined : { height: `${length * 100}svh` }}
      >
        <div
          className={
            reduced
              ? `relative ${stageClassName}`
              : `sticky top-0 h-svh overflow-hidden ${stageClassName}`
          }
        >
          {children}
        </div>
      </section>
    </Ctx.Provider>
  );
}

/**
 * One beat of a scene: visible while progress is within [from, to], fading and
 * rising in at the start of its window and out at the end. In the animated
 * mode steps are layered on top of each other (absolute, inset 0) unless
 * `inFlow` is set; in the static mode they stack in normal flow.
 *
 * Neighbouring windows may overlap by up to `fade`; more and two steps show at once.
 */
export function SceneStep({
  children,
  from,
  to,
  /** Portion of progress spent fading in and out at each edge. */
  fade = 0.06,
  /** Pixels of vertical travel on the way in and out. */
  travel = 24,
  /** First step: already visible at progress 0 instead of fading in. */
  first = false,
  /** Last step: stays visible at progress 1 instead of fading out. */
  last = false,
  /** Render in normal flow instead of layered absolutely. */
  inFlow = false,
  className = "",
}: {
  children: ReactNode;
  from: number;
  to: number;
  fade?: number;
  travel?: number;
  first?: boolean;
  last?: boolean;
  inFlow?: boolean;
  className?: string;
}) {
  const { progress, isStatic } = useScene();
  // Keep offsets inside [0, 1] and in order whatever the caller passes, and
  // shrink the fade if the window is too narrow for two of them.
  const a = Math.min(Math.max(from, 0), 1);
  const b = Math.min(Math.max(to, a), 1);
  const f = Math.min(fade, (b - a) / 2);
  // Fade in over the second half of the lead-in and out over the first half
  // of the lead-out, so neighbours whose windows overlap by up to `fade` hand
  // off cleanly instead of showing two half-transparent layers at once.
  const input = [first ? a : a + f / 2, a + f, b - f, last ? b : b - f / 2];
  const opacity = useTransform(progress, input, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, input, [first ? 0 : travel, 0, 0, last ? 0 : -travel]);
  // Hidden steps must not catch clicks or focus meant for the visible one.
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  if (isStatic) {
    return (
      <div data-scene-step className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      data-scene-step
      className={`${inFlow ? "relative" : "absolute inset-0"} ${className}`}
      style={{ opacity, y, pointerEvents }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Maps scene progress through a range to any numeric output, for bespoke
 * scrubbed effects (a counter, a line drawing, a card sliding across). In the
 * static mode it returns a value pinned at the END of the output range, so
 * reduced-motion users see the finished state.
 *
 * Two sharp edges:
 * - Only a `motion.*` element can take a MotionValue in `style`; a plain
 *   element won't animate.
 * - A transform MotionValue (`x`, `y`, `scale`) in `style` replaces the whole
 *   inline transform, so Tailwind `translate-*` / `-translate-x-1/2` on the
 *   same element stop working. Center with flex or a wrapper instead.
 */
export function useSceneValue(input: number[], output: number[]): MotionValue<number> {
  const { progress, isStatic } = useScene();
  const end = output[output.length - 1];
  return useTransform(progress, input, isStatic ? output.map(() => end) : output);
}

/** A thin bar showing how far through the scene the reader is. */
export function SceneProgressBar({
  className = "",
  /** Fill utility. A separate prop so it replaces, rather than competes with, the default. */
  colorClass = "bg-brand-ink",
}: {
  className?: string;
  colorClass?: string;
}) {
  const { progress, isStatic } = useScene();
  if (isStatic) return null;
  return (
    <motion.div
      aria-hidden
      className={`absolute left-0 top-0 h-1 w-full origin-left ${colorClass} ${className}`}
      style={{ scaleX: progress }}
    />
  );
}
