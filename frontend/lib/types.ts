/**
 * OU SASE shared data model.
 *
 * This file is the contract every page and every agent codes against.
 * Firestore is schemaless, so THIS is the schema — if a field is not here,
 * it does not exist. Change it here first, then change consumers.
 */

/** Firestore collection names. Never inline these strings. */
export const COLLECTIONS = {
  members: "members",
  sponsors: "sponsors",
  eventPhotos: "eventPhotos",
  execs: "execs",
  execInvites: "execInvites",
} as const;

/* -------------------------------------------------------------------------- */
/* Members                                                                     */
/* -------------------------------------------------------------------------- */

export type Classification =
  | "Freshman"
  | "Sophomore"
  | "Junior"
  | "Senior"
  | "Graduate"
  | "Alumni";

/**
 * A member profile card. Shown to recruiters on /recruitment ONLY when
 * `visibleToRecruiters` is true — this is the member's consent flag and the
 * security rules enforce it. Treat it as privacy-critical, not cosmetic.
 */
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  /** Contact email shown to recruiters. May differ from the auth account. */
  email: string;
  major: string;
  /** Four-digit graduation year, e.g. 2027. */
  gradYear: number;
  classification: Classification;
  /** Cloudinary public_id for the profile photo. Not a URL — build with CldImage. */
  photoPublicId?: string;
  /** Cloudinary public_id of the uploaded resume PDF. */
  resumePublicId?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  /** Short skills list, rendered as pill badges. Keep to ~8 for layout. */
  skills: string[];
  /** One- or two-sentence blurb. Keep under ~240 chars. */
  bio?: string;
  /** Member's consent to appear on the public recruiter-facing page. */
  visibleToRecruiters: boolean;
  /** Seeking: drives the filter chips on /recruitment. */
  seeking: ("Internship" | "Co-op" | "Full-time" | "Research")[];
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Sponsors                                                                    */
/* -------------------------------------------------------------------------- */

export type SponsorTier = "Platinum" | "Gold" | "Silver" | "Partner";

/** Display order and relative logo scale per tier. */
export const SPONSOR_TIERS: Record<
  SponsorTier,
  { order: number; label: string; blurb: string }
> = {
  Platinum: { order: 0, label: "Platinum", blurb: "Presenting partners" },
  Gold: { order: 1, label: "Gold", blurb: "Career partners" },
  Silver: { order: 2, label: "Silver", blurb: "Supporting partners" },
  Partner: { order: 3, label: "Partner", blurb: "Community partners" },
};

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  /** Cloudinary public_id for the logo. Prefer a transparent PNG/SVG. */
  logoPublicId?: string;
  websiteUrl?: string;
  /** One sentence on what they do with the chapter. */
  blurb?: string;
  /** Year the partnership started, e.g. 2024. */
  since?: number;
  active: boolean;
  /** Manual ordering within a tier; lower sorts first. */
  order: number;
}

/* -------------------------------------------------------------------------- */
/* Event photos (the tabletop hero)                                            */
/* -------------------------------------------------------------------------- */

/**
 * A photo scattered on the "tabletop" hero. `rotation` and `offset` are
 * baked into the data, not randomised at render time — random rotation
 * causes hydration mismatches and makes the layout jump on every reload.
 */
export interface EventPhoto {
  id: string;
  photoPublicId: string;
  /** Required. Screen-reader users get the event, not "image". */
  alt: string;
  caption?: string;
  eventName?: string;
  /** ISO date string. */
  date?: string;
  /** Degrees, roughly -8..8. Stored, never random. */
  rotation: number;
  /** Larger photos read as "closer" on the table. 1 = default. */
  scale: number;
  featured: boolean;
  order: number;
}

/* -------------------------------------------------------------------------- */
/* Execs / authorization                                                       */
/* -------------------------------------------------------------------------- */

export type ExecRole = "president" | "officer" | "admin";

/**
 * Authorization is a Firestore document, NOT a field on the user.
 * An `execs/{uid}` doc existing is what grants admin access; security rules
 * read this collection. Never trust a client-side role claim.
 */
export interface Exec {
  /** Firebase Auth uid. Document id === uid. */
  id: string;
  email: string;
  displayName?: string;
  role: ExecRole;
  /** Set false to revoke access without deleting history. */
  active: boolean;
  addedAt: string;
  addedBy?: string;
}

/**
 * An invitation for someone to become an exec.
 *
 * Why this exists: an `Exec` document is keyed by Firebase Auth uid, and a new
 * officer has no uid until the first time they sign in. So a current exec
 * cannot pre-create their record. Instead they create an invite keyed by
 * EMAIL; when that person signs in, the app exchanges the invite for a real
 * exec document.
 *
 * The security rules allow that self-creation ONLY when a matching invite
 * exists and only with the role the invite specifies — so this is not a hole:
 * an existing exec still has to authorise every new officer, and the invitee
 * cannot promote themselves beyond what they were offered.
 */
export interface ExecInvite {
  /** Document id IS the lowercased email address. */
  id: string;
  email: string;
  role: ExecRole;
  invitedBy: string;
  invitedAt: string;
}
