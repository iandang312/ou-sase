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
    <Section tone="light">
      <Container>
        <SectionHeading
          kicker="Around campus"
          title="Life in the chapter"
          sub="A season on the table: GBMs, the national convention, Lunar New Year, and the people who show up for all of it."
          align="center"
        />
        <TabletopGallery photos={displayPhotos} className="mt-10 md:mt-14" />
      </Container>
    </Section>
  );
}
