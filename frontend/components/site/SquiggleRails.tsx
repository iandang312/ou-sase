/**
 * The squiggle rails: one wavy vertical line down each side of the page.
 *
 * Huy's brief: "a blue or white swiggle line down both sides of the page."
 *
 * Implementation notes worth keeping:
 * - Pure decoration -> aria-hidden, and it must never intercept clicks
 *   (pointer-events-none), or it will eat taps near the page edges on mobile.
 * - The path is a repeating cubic wave generated once, so it tiles cleanly at
 *   any viewport height via preserveAspectRatio="none".
 * - Hidden below `lg`. On a phone there is no margin to put it in, and
 *   squeezing it against the text is worse than not having it.
 */

const WAVE_PERIOD = 120; // px of vertical travel per full S-curve
const WAVE_AMPLITUDE = 14; // px of horizontal swing
const PERIODS = 8;

/** Builds a vertical sine-ish path out of alternating cubic segments. */
function buildWavePath(): string {
  const cx = WAVE_AMPLITUDE + 2; // centre line, leaving room for stroke width
  let d = `M ${cx} 0`;
  for (let i = 0; i < PERIODS; i += 1) {
    const y0 = i * WAVE_PERIOD;
    const half = WAVE_PERIOD / 2;
    // out, then back — one full S per period
    d += ` C ${cx + WAVE_AMPLITUDE} ${y0 + half * 0.33}, ${cx + WAVE_AMPLITUDE} ${y0 + half * 0.66}, ${cx} ${y0 + half}`;
    d += ` C ${cx - WAVE_AMPLITUDE} ${y0 + half * 1.33}, ${cx - WAVE_AMPLITUDE} ${y0 + half * 1.66}, ${cx} ${y0 + WAVE_PERIOD}`;
  }
  return d;
}

const PATH = buildWavePath();
const VIEW_W = WAVE_AMPLITUDE * 2 + 4;
const VIEW_H = WAVE_PERIOD * PERIODS;

function Rail({
  side,
  tone,
}: {
  side: "left" | "right";
  tone: "blue" | "white";
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      className={[
        "pointer-events-none absolute top-0 hidden h-full w-[36px] lg:block",
        side === "left" ? "left-3 xl:left-8" : "right-3 xl:right-8",
        tone === "blue" ? "text-brand-ink/25" : "text-white/25",
        // mirror the right rail so the two sides curve symmetrically inward
        side === "right" ? "scale-x-[-1]" : "",
      ].join(" ")}
    >
      <path
        d={PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Wrap any section in this to get the rails down both sides.
 * `tone="white"` on dark bands, `tone="blue"` on light ones.
 */
export function SquiggleRails({ tone = "blue" }: { tone?: "blue" | "white" }) {
  return (
    <>
      <Rail side="left" tone={tone} />
      <Rail side="right" tone={tone} />
    </>
  );
}
