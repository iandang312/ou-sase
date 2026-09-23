import type { EventPhoto } from "@/lib/types";
import { CloudImage } from "./CloudImage";

/**
 * The tabletop: event photos spread out like prints scattered on a desk.
 *
 * Huy's brief: "imagine like a table top with photos, from our events,
 * spread out".
 *
 * Two layouts, one component:
 * - `lg+`  : true scatter. Absolutely positioned prints with per-photo
 *            rotation and overlap, so it reads as a physical pile.
 * - `<lg`  : a scroll-snap filmstrip. An absolute scatter on a 390px screen
 *            is unreadable and clips; a strip keeps every photo legible and
 *            is the more natural phone gesture.
 *
 * Rotation/scale come from the DATA (see EventPhoto), never Math.random() —
 * random values differ between server and client render and cause hydration
 * mismatches, and make the pile jump on every reload.
 */

/** Deterministic scatter slots. Extra photos wrap around and layer deeper. */
const SLOTS = [
  { left: "2%", top: "10%", z: 3 },
  { left: "20%", top: "2%", z: 5 },
  { left: "39%", top: "14%", z: 4 },
  { left: "57%", top: "1%", z: 6 },
  { left: "74%", top: "12%", z: 2 },
  { left: "11%", top: "46%", z: 6 },
  { left: "31%", top: "54%", z: 3 },
  { left: "50%", top: "44%", z: 7 },
  { left: "68%", top: "52%", z: 4 },
  { left: "83%", top: "38%", z: 5 },
];

function Print({
  photo,
  className = "",
  style,
}: {
  photo: EventPhoto;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure
      className={`bg-canvas border-hairline rounded-sm border p-2 shadow-[0_1px_2px_rgba(10,11,13,0.06)] ${className}`}
      style={style}
    >
      <CloudImage
        publicId={photo.photoPublicId}
        alt={photo.alt}
        width={320}
        height={240}
        sizes="(max-width: 1024px) 60vw, 260px"
        className="block h-auto w-full rounded-[2px] object-cover"
      />
      {photo.caption ? (
        <figcaption className="text-caption text-muted px-1 pt-2">
          {photo.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function TabletopGallery({
  photos,
  className = "",
}: {
  photos: EventPhoto[];
  className?: string;
}) {
  if (photos.length === 0) return null;

  const ordered = [...photos].sort((a, b) => a.order - b.order);

  return (
    <div className={className}>
      {/* Phone / tablet: filmstrip ------------------------------------- */}
      <ul
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Photos from chapter events"
      >
        {ordered.map((photo) => (
          <li key={photo.id} className="w-[62%] shrink-0 snap-center sm:w-[42%]">
            <Print photo={photo} />
          </li>
        ))}
      </ul>

      {/* Desktop: scatter ----------------------------------------------- */}
      <div
        className="relative hidden h-[520px] w-full lg:block xl:h-[560px]"
        aria-label="Photos from chapter events"
        role="group"
      >
        {ordered.map((photo, i) => {
          const slot = SLOTS[i % SLOTS.length];
          // Photos past the first pass sit slightly deeper in the pile.
          const depth = Math.floor(i / SLOTS.length);
          return (
            <Print
              key={photo.id}
              photo={photo}
              className="absolute w-[228px] transition-transform duration-200 hover:z-20 hover:scale-[1.03] xl:w-[252px]"
              style={{
                left: slot.left,
                top: slot.top,
                zIndex: slot.z - depth,
                transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Placeholder pile used until real event photos are uploaded to Cloudinary.
 * Replace by seeding the `eventPhotos` collection — see HANDOFF.md.
 */
export const PLACEHOLDER_PHOTOS: EventPhoto[] = [
  { id: "p1", photoPublicId: "", alt: "Members at the fall general body meeting", caption: "Fall GBM", rotation: -5, scale: 1, featured: true, order: 0 },
  { id: "p2", photoPublicId: "", alt: "Chapter members at the SASE national convention", caption: "National Convention", rotation: 3, scale: 1.04, featured: true, order: 1 },
  { id: "p3", photoPublicId: "", alt: "Resume workshop with industry mentors", caption: "Resume workshop", rotation: -2, scale: 0.98, featured: false, order: 2 },
  { id: "p4", photoPublicId: "", alt: "Lunar New Year celebration on campus", caption: "Lunar New Year", rotation: 6, scale: 1.02, featured: true, order: 3 },
  { id: "p5", photoPublicId: "", alt: "Corporate networking night with sponsors", caption: "Networking night", rotation: -4, scale: 1, featured: false, order: 4 },
  { id: "p6", photoPublicId: "", alt: "Volunteers at the STEM outreach day", caption: "STEM outreach", rotation: 2, scale: 1.03, featured: false, order: 5 },
  { id: "p7", photoPublicId: "", alt: "Intramural team after the championship game", caption: "Intramurals", rotation: -6, scale: 0.97, featured: false, order: 6 },
  { id: "p8", photoPublicId: "", alt: "Graduating seniors at the end of year banquet", caption: "Senior banquet", rotation: 4, scale: 1.01, featured: true, order: 7 },
];
