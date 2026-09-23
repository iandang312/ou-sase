---
version: 1.0
name: OU-SASE-design-system
description: >
  The design system for the OU SASE chapter site. A warm, editorial, pastel
  system on a white canvas: six pastel families, each paired with a readable
  ink shade, over generous whitespace and a light/soft/dark band rhythm.
  Structure, type scale and page rhythm descend from a Coinbase-style
  editorial reference; the palette deliberately does not. Where this file and
  frontend/app/globals.css disagree, globals.css wins and this file is stale —
  fix it.

colors:
  # --- Brand ---------------------------------------------------------------
  # The brand blue is a PASTEL. It is a fill, never type on white.
  brand: "#bdd4e7"
  brand-active: "#a6c4dd"
  brand-disabled: "#e3ecf4"
  brand-ink: "#1f5077"
  brand-ink-active: "#163c5a"

  # --- Text ----------------------------------------------------------------
  ink: "#0a0b0d"
  body: "#5b616e"
  muted: "#7c828a"
  muted-soft: "#a8acb3"

  # --- Hairlines -----------------------------------------------------------
  hairline: "#dee1e6"
  hairline-soft: "#eef0f3"

  # --- Surfaces ------------------------------------------------------------
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-card: "#ffffff"
  surface-strong: "#eef0f3"
  surface-dark: "#0a0b0d"
  surface-dark-elevated: "#16181c"

  # --- On-color ------------------------------------------------------------
  # A pastel fill takes DARK type. White on #bdd4e7 is ~1.4:1.
  on-brand: "#0a0b0d"
  on-dark: "#ffffff"
  on-dark-soft: "#a8acb3"

  # --- Pastel families -----------------------------------------------------
  # Each family is a trio: -soft (wash) / base (fill) / -ink (type).
  pastel-blue: "#bdd4e7"
  pastel-blue-ink: "#1f5077"
  pastel-blue-soft: "#edf4f9"
  pastel-yellow: "#f6e7b4"
  pastel-yellow-ink: "#7a5a10"
  pastel-yellow-soft: "#fdf7e6"
  pastel-pink: "#f2c9d4"
  pastel-pink-ink: "#8a3d55"
  pastel-pink-soft: "#fcedf1"
  pastel-mint: "#c3e0cd"
  pastel-mint-ink: "#2c6b48"
  pastel-mint-soft: "#e9f5ee"
  pastel-lavender: "#d4cbe8"
  pastel-lavender-ink: "#57458f"
  pastel-lavender-soft: "#f1eef8"
  pastel-peach: "#f7d5bd"
  pastel-peach-ink: "#8a4f26"
  pastel-peach-soft: "#fdf0e7"

  # --- Semantic ------------------------------------------------------------
  # Status stays saturated on purpose: a destructive confirm must not read
  # as decoration.
  positive: "#05b169"
  positive-soft: "#e9f5ee"
  negative: "#cf202f"
  negative-soft: "#fbeaec"
  accent-yellow: "#f4b000"

typography:
  display-mega: { fontSize: 80px, fontWeight: 400, lineHeight: 1.0, letterSpacing: -2px }
  display-xl:   { fontSize: 64px, fontWeight: 400, lineHeight: 1.0, letterSpacing: -1.6px }
  display-lg:   { fontSize: 52px, fontWeight: 400, lineHeight: 1.0, letterSpacing: -1.3px }
  display-md:   { fontSize: 44px, fontWeight: 400, lineHeight: 1.09, letterSpacing: -1px }
  display-sm:   { fontSize: 36px, fontWeight: 400, lineHeight: 1.11, letterSpacing: -0.5px }
  title-lg:     { fontSize: 32px, fontWeight: 400, lineHeight: 1.13, letterSpacing: -0.4px }
  title-md:     { fontSize: 18px, fontWeight: 600, lineHeight: 1.33 }
  title-sm:     { fontSize: 16px, fontWeight: 600, lineHeight: 1.25 }
  body-md:      { fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  body-sm:      { fontSize: 14px, fontWeight: 400, lineHeight: 1.5 }
  caption:      { fontSize: 13px, fontWeight: 400, lineHeight: 1.5 }
  caption-strong: { fontSize: 12px, fontWeight: 600, lineHeight: 1.5 }
  nav-link:     { fontSize: 14px, fontWeight: 500, lineHeight: 1.4 }
  button:       { fontSize: 16px, fontWeight: 600, lineHeight: 1.15 }

fontFamilies:
  display: "Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  sans: "Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

motion:
  duration-instant: 120ms
  duration-fast: 180ms
  duration-base: 240ms
  duration-slow: 320ms
  duration-reveal: 520ms
  ease-standard: "cubic-bezier(0.2, 0, 0, 1)"
  ease-entrance: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-exit: "cubic-bezier(0.4, 0, 1, 1)"
  stagger-step: 70ms
  reveal-offset: 16px
---

# OU SASE — Design System

The source of truth for color is `frontend/app/globals.css`. This document
explains the system: what the tokens mean, when to reach for each one, and the
rules that keep the site coherent as different people add to it over the years.

Contents: [Overview](#overview) · [Colors](#colors) · [Typography](#typography)
· [Layout](#layout) · [Imagery & Media](#imagery--media) · [Elevation &
Depth](#elevation--depth) · [Shapes](#shapes) · [Motion &
Interaction](#motion--interaction) · [Components](#components) · [Do's and
Don'ts](#dos-and-donts) · [Responsive Behavior](#responsive-behavior) ·
[Iteration Guide](#iteration-guide) · [Known Gaps](#known-gaps)

---

## Overview

OU SASE is a student chapter, not a bank. The site should feel like a group of
people you'd want to spend a Thursday evening with, while still being credible
to a recruiter deciding whether to fund a sponsorship.

That tension is the whole design brief, and the system resolves it like this:

- **Editorial structure, warm surface.** Generous whitespace, a restrained type
  scale and a 1200px measure do the credibility work. Color and photography do
  the warmth.
- **Pastels carry the personality.** Six families, used as fills and washes —
  never as type. They let sections feel distinct without the site turning into
  a rainbow, because each one is anchored by a dark ink partner.
- **Display type stays at weight 400.** Impact comes from scale, spacing and
  composition, not from bolding. This single choice is most of the voice.
- **Photography is the emotional payload.** The chapter's own event photos,
  treated as physical prints rather than stock imagery.
- **Motion is confirmation, not decoration.** Things move to show that
  something happened or that content has arrived — never to entertain.

---

## Colors

### The pastel trio rule

This is the most important rule in the system, and the easiest to get wrong.
Every pastel family exists as **three** tokens:

| Role | Token | Use for |
|---|---|---|
| Wash | `{colors.pastel-x-soft}` | Section bands, card backgrounds, badge fills |
| Fill | `{colors.pastel-x}` | Buttons, chips, illustrative shapes, rails |
| Ink | `{colors.pastel-x-ink}` | Type, icons, links, borders on that family |

> **Never set type in a bare pastel.** `pastel-blue` (`#bdd4e7`) on white is
> roughly **1.4:1** — below every accessibility threshold and genuinely hard to
> read. `pastel-blue-ink` (`#1f5077`) on white is about **8:1**.
>
> Fill → `--color-<name>`. Text and icons → `--color-<name>-ink`.

The same applies to `brand`: `--color-on-brand` is **ink, not white**, because
a pale fill takes dark type.

### The families and what they mean

Color carries meaning here; it is not random decoration. Keep these
associations stable, because people learn them.

| Family | Meaning | Where it appears |
|---|---|---|
| **Blue** (`pastel-blue`) | The brand. Default, neutral, primary | Primary CTAs, squiggle rails, brand mark, links |
| **Mint** (`pastel-mint`) | Growth, availability, "yes" | Internship / full-time availability, positive states |
| **Lavender** (`pastel-lavender`) | Prestige, top tier | Platinum sponsors, featured cards |
| **Yellow** (`pastel-yellow`) | Attention, highlight | Gold tier, callouts, "new" markers |
| **Peach** (`pastel-peach`) | Warmth, people, community | Social/community sections, event categories |
| **Pink** (`pastel-pink`) | Energy, celebration | Culture and celebration events, accents |

### How much color

The failure mode of a pastel system is confetti. Three limits:

1. **One family leads per section.** A band picks a family and commits. Other
   families may appear inside it only as small data-driven chips.
2. **Two families per component, maximum.** A card tinted lavender with a mint
   badge is fine. Three is noise.
3. **The full set may run together only where it is encoding data** — sponsor
   tiers, "seeking" chips on member cards. There the variety *is* the
   information, and repeating it in the filter controls lets people
   pattern-match by color.

### Neutrals do the heavy lifting

Most of the page is `canvas` white, `surface-soft` grey and `ink` type. The
pastels punctuate. If a screenshot looks mostly neutral with a few points of
color, it is correct.

### Semantic colors are not pastels

`positive` and `negative` stay saturated. A destructive confirmation must not
read as decoration. Use `-soft` variants for their *backgrounds* only, with the
saturated shade for the type and icon.

### Contrast floor

Body text meets 4.5:1. Large display type and non-text UI meet 3:1. Every
`-ink` token clears 4.5:1 on both `canvas` and its own `-soft` wash. If you
introduce a new pastel, produce all three shades and check the ink against
both, or don't add it.

---

## Typography

### Families

Inter for everything, Geist Mono for numerals in tabular contexts. Inter is the
documented substitute for the licensed typeface the structure descends from.

### The scale

`display-mega` · `display-xl` · `display-lg` · `display-md` · `display-sm` ·
`title-lg` · `title-md` · `title-sm` · `body-md` · `body-sm` · `caption` ·
`caption-strong` · `nav-link` · `button`.

### Principles

- **Display weight stays 400.** The single most distinctive choice in the
  system. Bolding a display headline changes the brand voice from composed to
  loud. If a headline is not landing, increase its size or the space around it.
- **Negative tracking on display only.** −1px to −2px on display sizes; body
  stays at 0.
- **Hierarchy through scale and color, not weight.** A two-line hero where the
  second line drops one step and shifts to `brand-ink` reads as a considered
  composition; the same lines in bold read as shouting.
- **Measure caps at ~65 characters** for body copy, ~40 for display.
- **Numbers in mono** wherever they are compared — stats, tier pricing, tabular
  data. Mono keeps digits aligned.

---

## Layout

### Spacing system

Base unit 4px. Tokens `xxs` 4 · `xs` 8 · `sm` 12 · `base` 16 · `md` 20 ·
`lg` 24 · `xl` 32 · `xxl` 48 · `section` 96.

Section padding is `{spacing.section}` (96px) for major bands, dropping to
~64px on tablet and ~48px on mobile. Card padding is `{spacing.xl}` (32px),
`{spacing.lg}` (24px) on mobile.

### Grid and container

Content caps at **1200px**, centered, with a 20px gutter on mobile and 32px
from `md` up. Photography and full-bleed bands may exceed the container; text
never does.

### Band rhythm

Pages rotate tones: **light → soft → light → dark**. Adjacent bands should
differ. Two consecutive white sections read as one long undifferentiated page.

Dark bands (`surface-dark`) are editorial punctuation — the hero of a page, or
a closing call to action. They are not a theme. The site does not ship a
`prefers-color-scheme` dark mode; the dark surfaces are chosen per section, and
`color-scheme: light` is forced so browser UA styles don't invert form controls
for users whose OS is dark.

### Layout patterns

| Pattern | Use |
|---|---|
| **Editorial split** | 2-up: display type one side, media the other. Hero sections. |
| **Benefit grid** | 3-up cards at desktop, 2-up tablet, 1-up mobile. |
| **Bento** | Mixed-size tiles in one grid — one large anchor plus smaller supporting tiles. Good for "what we do" sections where items have unequal weight. |
| **Scatter / tabletop** | Absolutely positioned, rotated media over a surface. The home page signature. Desktop only; collapses to a filmstrip. |
| **Roster grid** | Dense, uniform cards optimized for scanning. Recruitment. |
| **Stat row** | 3–4 large mono numerals with small captions, tight vertical padding. |
| **Filmstrip** | Horizontal scroll-snap row. The mobile fallback for any scatter or wide grid. |

---

## Imagery & Media

Photography is what makes this site feel like a real chapter rather than a
template. Treat it with intent.

### Photo treatment

- **Prints, not tiles.** Event photos get a white frame (8px padding), a
  `hairline` border, `{rounded.sm}` corners and a soft shadow — the look of a
  physical print. This is what lets them be scattered without looking broken.
- **Rotation is data, never random.** Each photo record stores its own
  `rotation` and `scale`. `Math.random()` at render time produces different
  values on server and client, which causes hydration mismatches and makes the
  layout jump on every reload.
- **Vary the size.** Uniform prints read as a rotated grid. Varied widths read
  as objects resting at different depths.
- **Non-sequential stacking.** A pile where each photo sits neatly on the last
  looks stacked; an uneven z-order looks strewn.
- **Faces near the top.** Crop with `gravity: auto` so automatic cropping keeps
  people in frame.

### Placeholders and empty states

Every media component must render without its image. Missing photos show a
neutral `surface-strong` tile at the correct aspect ratio with an accessible
label, so layout is identical and only the pixels are absent.

Sample content — invented sponsors, fictional students — is **development
only**. Production shows an honest empty state. Publishing invented companies
or students would be a false claim about real people.

### Alt text

Required on every photo, and it describes the event, not the file: "Members at
the fall general body meeting", never "image" or "IMG_4821".

### Decorative graphics

The **squiggle rails** running down both page edges are the site's signature
graphic. They are decorative: `aria-hidden`, `pointer-events-none` (otherwise
they swallow taps near the screen edge), and hidden below `lg` where there is
no margin to hold them. Blue on light bands, white on dark.

---

## Elevation & Depth

Depth comes from **layering and hairlines**, not from a shadow scale.

| Level | Treatment |
|---|---|
| Flat | Tone change only — `surface-soft` against `canvas` |
| Card | `hairline` border, no shadow |
| Raised | Border plus a soft shadow: `0 1px 2px rgba(10,11,13,0.06)` |
| Lifted | Two-part shadow with a long soft falloff — hovering a print, an open drawer |
| Overlay | Backdrop dim plus blur behind a drawer or modal |

A tinted wash behind an element reads as depth more cheaply than a shadow, and
suits this palette better. Reach for `-soft` before reaching for shadow.

---

## Shapes

Radius scale: `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `pill` 100 ·
`full` 9999.

- **Every button is a pill.** No exceptions.
- **Cards are `xl`** (24px). Large soft corners are much of the friendliness.
- **Inputs are `md`** (12px).
- **Badges and chips are `pill`.**
- **Photo prints are `sm`** (8px) — paper has a tight corner, not a soft one.
- **Avatars and icon plates are `full`.**

---

## Motion & Interaction

Motion earns its place by answering a question: *did that work?*, *what just
arrived?*, *where did this come from?* If a movement answers none of those,
remove it.

### Duration and easing

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 120ms | Color and opacity on hover |
| `duration-fast` | 180ms | Small transforms, chips, checkboxes |
| `duration-base` | 240ms | Cards, buttons, most interactive feedback |
| `duration-slow` | 320ms | Drawers, disclosures, layout shifts |
| `duration-reveal` | 520ms | Scroll reveals |

`ease-standard` for state changes, `ease-entrance` for things arriving (a
decelerating curve makes entrances feel settled), `ease-exit` for things
leaving.

**Animate `transform` and `opacity`.** Both are compositor-friendly. Animating
`width`, `height`, `top` or `margin` forces layout on every frame and stutters
on the mid-range phones most students carry.

### Interactive states

Every interactive element defines all five: **default, hover, focus-visible,
active, disabled.** Hover alone is not enough — most of your audience is on a
touchscreen and will never hover.

- **Focus-visible is never removed.** A 2px `brand-ink` ring at 2px offset.
  Officers use the admin at 2am; do not make them guess where they are.
- **Hover** shifts fill by one step (`brand` → `brand-active`), or lifts an
  element 1–2px.
- **Active** returns to 0 translation — the press should feel like contact.
- **Disabled** drops fill *and* type contrast. A paler pastel alone still reads
  as enabled.

### Signature interactions

- **Picking up a print.** Hovering a scattered photo straightens it to level,
  scales it ~7% and raises it above the pile, like tilting a photo toward you.
  Drive rotation through a CSS custom property rather than an inline
  `transform` — an inline transform wins on specificity and the hover rule
  would silently never apply.
- **Filter chips** fill with their family color when active, so the filter row
  and the cards share a visual language.
- **The mobile drawer** slides from the top with a dimmed, blurred backdrop.
- **Save feedback** transitions saving → saved → idle, holding "saved" long
  enough to be read (~700ms) before collapsing.

### Scroll animation

Scroll reveals give the page pacing. They are also the easiest thing in this
document to overdo.

**The rules:**

1. **Reveal once.** Content that re-animates every time it scrolls back into
   view is exhausting. Unobserve after the first reveal.
2. **Move a little.** 16px of travel plus a fade. Large slides feel cheap and
   cause layout jank.
3. **Use `IntersectionObserver`**, never a scroll event listener. Trigger at
   ~15% visibility with a negative bottom root margin so content reveals
   slightly before it reaches the viewport edge.
4. **Stagger siblings by 70ms**, and cap the stagger at ~4 items. Beyond that
   the last item feels broken rather than choreographed.
5. **Never hide content that has not revealed yet in a way that survives
   failure.** If JavaScript fails or the observer never fires, the content must
   still be visible and readable. Start from the visible state and enhance, or
   apply the hidden state only after JS confirms it can undo it.
6. **Headings and body copy are the last things to animate.** Reveal
   containers, cards and media. A paragraph that fades in as you try to read it
   is an obstacle.
7. **Parallax is capped at very subtle** — a few percent of travel on
   decorative elements only. Never on text.

### Reduced motion

`prefers-reduced-motion: reduce` is respected globally in `globals.css`:
animations and transitions collapse to ~0.01ms and smooth scrolling is
disabled. **Any new animation must degrade to its end state** — reduced motion
means content arrives instantly, never that content never arrives. Test it; it
is a real accessibility requirement, not a nicety.

---

## Components

### Top navigation
Sticky, 64px, `canvas` at 90% with a backdrop blur, `hairline` bottom border.
Active route marked with a `brand-ink` indicator. Below `md` the links move
into a drawer behind a 44px hamburger; the auth control stays reachable in
both layouts.

### Mobile drawer
Slides from under the header. Dimmed blurred backdrop. Closes on Escape,
outside click and route change. Traps Tab focus while open, returns focus to
the toggle on close, and locks body scroll.

### Buttons
Pill, 44px (`md`) or 56px (`lg`). Variants: `primary` (pastel brand fill, ink
type), `secondary` (`surface-strong`), `dark`, `outlineOnDark`, `text`
(`brand-ink`, underline on hover). **One primary per view.** A second primary
means one of them is a secondary.

### Cards
`canvas` fill, `hairline` border, `xl` radius, 32px padding. Interactive cards
shift their border to `brand-ink/40` on hover and focus-within.

### Badges and chips
Pill, `caption-strong`, `-soft` fill with matching `-ink` type. Chips that
filter are toggle buttons with a pressed state, not decoration.

### Forms
48px inputs, `md` radius, `hairline` border, `brand-ink` focus ring. Every
control has a real associated label. Required fields are marked at the field,
not only in a legend. Errors sit next to the field they concern and say what
to do.

### Photo print
White frame with 8px padding, `hairline` border, `sm` radius, soft shadow,
optional caption in `caption`/`muted` beneath.

### Hero bands
96px padding. Display type at `display-mega` / `display-xl`, weight 400, with
a soft tinted wash behind for depth. Squiggle rails on both edges.

### Stat row
3–4 mono numerals at `display-sm`+ with `caption` labels. Tighter vertical
padding than a standard band.

### Empty states
An icon or tile, a sentence explaining *why* it is empty, and — where one
exists — the action that fills it. Distinguish "nothing published yet" from
"no results for your filters"; they need different words and different actions.

### Admin shell
Persistent bar showing who is signed in and their role, plus section
navigation with the current page marked. Destructive actions are two-step.
Saving states are explicit.

---

## Do's and Don'ts

### Do
- Pair every pastel fill with its `-ink` shade for type.
- Let one pastel family lead each section.
- Keep display type at weight 400 and get impact from scale and space.
- Alternate band tones for page rhythm.
- Store photo rotation and scale in data.
- Animate `transform` and `opacity`, and reveal on scroll exactly once.
- Define focus-visible on everything interactive.
- Render every media component gracefully with no image.
- Use mono for numbers that get compared.

### Don't
- **Don't set type in a bare pastel.** `text-brand` on white is ~1.4:1. This is
  the single most likely way to wreck this site.
- Don't put white type on a pastel fill — `on-brand` is ink.
- Don't bold display copy.
- Don't run more than two pastel families inside one component, unless the
  color is encoding data.
- Don't add a shadow scale; use layering, hairlines and tinted washes.
- Don't animate layout properties, or animate text as it is being read.
- Don't re-trigger scroll reveals on every pass.
- Don't ship an animation that has no reduced-motion fallback.
- Don't let decorative graphics take pointer events.
- Don't show invented sponsors or students in production.
- Don't introduce a new color without producing all three shades and checking
  contrast.

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key changes |
|---|---|---|
| Mobile | < 640px | Display steps down to 36–40px; grids 1-up; scatter → filmstrip; nav → drawer; filters → disclosure; section padding 48px |
| Tablet | 640–1024px | Display 52–64px; grids 2-up; filters inline; section padding 64px |
| Desktop | 1024–1280px | Full display scale; grids 3-up; scatter active; squiggle rails appear |
| Wide | > 1280px | Content caps at 1200px; rails move outward; media may go full-bleed |

### Touch targets
Minimum 44px on any control, including icon buttons, chips and the nav toggle.
Inline text links inside body copy are exempt but should sit in comfortably
spaced lines.

### Collapsing strategy
- Nav links → drawer below `md`; auth control stays reachable.
- Scatter layouts → scroll-snap filmstrip with edge fades and a swipe hint.
- Filter sets → a disclosure with an active-count badge.
- Multi-column forms → single column, sections preserved.
- Squiggle rails → hidden below `lg`.

### Mobile is the common case
Most students open this on a phone between classes. A layout that merely
survives mobile is not finished.

---

## Iteration Guide

1. **`globals.css` is the source of truth for color.** Change tokens there;
   update this document to match. Never inline a hex in a component.
2. **Adding a pastel** means adding all three shades (`-soft`, base, `-ink`)
   and verifying the ink clears 4.5:1 on both white and its own wash.
3. **One component at a time.** Reference token names, not values.
4. **New buttons are pills; new cards are `xl`; new inputs are `md`.**
5. **New interactive elements define all five states**, focus-visible included.
6. **New animations** pick a duration token, animate transform/opacity only,
   and state their reduced-motion fallback.
7. **New scroll reveals** use `IntersectionObserver`, fire once, and leave
   content visible if JavaScript never runs.
8. **Check the phone layout before calling anything done.**

---

## Known Gaps

- **No dark mode.** Dark surfaces are editorial bands, not a theme. Adding a
  true dark mode means a second value for every surface and ink token, plus
  re-checking every pastel's contrast — a real project, not a toggle.
- **Pastel families lack full tonal ramps.** Three shades each. A data
  visualization needing five steps of one hue would need new tokens.
- **Chart and data-visualization styling is undefined.** Nothing on the site
  charts anything yet.
- **No illustration style is defined.** The squiggle rails are the only
  bespoke graphic; a broader illustrative language has not been decided.
- **Print stylesheet undefined** — a recruiter printing a member list gets
  browser defaults.
- **Internationalization untested.** The type scale assumes Latin script and
  English-length strings.
- **Email templates are out of scope** and share none of these tokens.
