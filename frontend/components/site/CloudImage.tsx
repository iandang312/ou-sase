import { CldImage } from "next-cloudinary";

export const isCloudinaryConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
);

/**
 * Cloudinary image with a graceful unconfigured state.
 *
 * Tonight there are no uploaded photos yet, and a half-built site that
 * white-screens on a missing cloud name is useless for reviewing layout.
 * So when Cloudinary isn't configured (or a record has no public_id) we
 * render a neutral placeholder tile at the same dimensions — the layout is
 * identical, only the pixels are missing.
 */
export function CloudImage({
  publicId,
  alt,
  width,
  height,
  className = "",
  sizes,
  priority,
}: {
  publicId?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!publicId || !isCloudinaryConfigured) {
    return (
      <div
        role="img"
        aria-label={alt}
        style={{ aspectRatio: `${width} / ${height}` }}
        className={`flex items-center justify-center bg-surface-strong ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 text-muted-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="M4 18l5-5 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      crop="fill"
      gravity="auto"
      className={className}
    />
  );
}
