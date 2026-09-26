/**
 * Pre-save checks for the admin forms. The forms save from a button click
 * (there is no <form>, so native `required` never runs), so these are the
 * only thing standing between an empty draft and a blank Firestore document.
 *
 * Each returns a user-facing message, or null when the draft is valid.
 */
import { safeHttpUrl } from "./safeUrl";
import type { Member, Sponsor } from "./types";

type MemberDraft = Omit<Member, "id" | "createdAt" | "updatedAt">;
type SponsorDraft = Omit<Sponsor, "id">;

export const MIN_YEAR = 1990;
export const MAX_YEAR_AHEAD = 10;

function isPlausibleYear(value: unknown, maxAhead = MAX_YEAR_AHEAD): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_YEAR &&
    value <= new Date().getFullYear() + maxAhead
  );
}

/** True when a free-text URL is empty (allowed) or normalizes to http(s). */
function urlOk(raw?: string): boolean {
  return !raw?.trim() || safeHttpUrl(raw) !== undefined;
}

export function validateMemberDraft(draft: MemberDraft): string | null {
  const missing = [
    ["first name", draft.firstName],
    ["last name", draft.lastName],
    ["email", draft.email],
    ["major", draft.major],
  ]
    .filter(([, v]) => !v?.trim())
    .map(([label]) => label);
  if (missing.length) return `Fill in all required fields (missing: ${missing.join(", ")}).`;
  if (!isPlausibleYear(draft.gradYear)) {
    return `Grad year must be a valid year (${MIN_YEAR}–${new Date().getFullYear() + MAX_YEAR_AHEAD}).`;
  }
  const badUrl = (
    [
      ["LinkedIn", draft.linkedinUrl],
      ["GitHub", draft.githubUrl],
      ["Portfolio", draft.portfolioUrl],
    ] as const
  ).find(([, v]) => !urlOk(v));
  if (badUrl) return `${badUrl[0]} URL must be a valid http(s) link.`;
  return null;
}

export function validateSponsorDraft(draft: SponsorDraft): string | null {
  if (!draft.name?.trim()) return "Sponsor name is required.";
  if (draft.since !== undefined && !isPlausibleYear(draft.since, 0)) {
    return `"Partner since" must be a valid year, or left blank.`;
  }
  if (!Number.isFinite(draft.order)) return "Order must be a number.";
  if (!urlOk(draft.websiteUrl)) return "Website URL must be a valid http(s) link.";
  return null;
}
