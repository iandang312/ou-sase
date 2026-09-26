import { PLACEHOLDER_PHOTOS, TabletopGallery } from "@/components/site/TabletopGallery";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { SHOW_PLACEHOLDER_DATA } from "@/lib/placeholders";
import type { EventPhoto } from "@/lib/types";

/**
 * The emotional centre of the page. Falls back to PLACEHOLDER_PHOTOS when
 * Firestore has no eventPhotos yet, but ONLY in development — on the live
 * site an empty gallery hides the whole band rather than showing a spread of
 * blank photo frames captioned with events that may not have happened.
 */
export function TabletopSection({ photos }: { photos: EventPhoto[] }) {
  const displayPhotos =
    photos.length > 0
      ? photos
      : SHOW_PLACEHOLDER_DATA
        ? PLACEHOLDER_PHOTOS
        : [];

  if (displayPhotos.length === 0) return null;

  return (
    <Section tone="light" className="relative min-h-svh flex flex-col justify-center">
      <Container>
        <SectionHeading
          kicker="Around campus"
          title="Life in the chapter"
          sub="A season on the table: GBMs, the national convention, Lunar New Year, and the people who show up for all of it."
          align="center"
        />

        {/*
         * The desk. TabletopGallery owns the scatter/filmstrip mechanics
         * (rotation, overlap, hover) — this wrapper is everything AROUND it
         * that makes the prints read as resting on a surface rather than
         * floating on white: a framed backdrop with a soft inset shadow on
         * desktop, and edge fades + a swipe hint on the phone filmstrip.
         */}
        <div className="relative mt-10 md:mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden rounded-xl border border-hairline bg-gradient-to-b from-pastel-blue-soft to-surface-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_12px_rgba(10,11,13,0.05)] lg:block"
          />
          <TabletopGallery
            photos={displayPhotos}
            className="relative lg:p-8 xl:p-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-canvas to-transparent lg:hidden"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas to-transparent lg:hidden"
          />
        </div>
        <p className="text-caption text-muted mt-3 text-center lg:hidden">
          Swipe to see more →
        </p>
      </Container>
    </Section>
  );
}
