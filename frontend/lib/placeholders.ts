/**
 * Whether the site may fall back to built-in sample data when a Firestore
 * collection is empty.
 *
 * The sample sets contain invented sponsor companies and fictional students.
 * That is useful while building — you can see the layout before anything is
 * seeded — but it must never reach the public site: a recruiter seeing
 * "Example Energy Co." listed as a sponsor is a false claim about a real
 * chapter, and invented student cards are worse.
 *
 * So: placeholders in development, honest empty states in production.
 *
 * Override with NEXT_PUBLIC_SHOW_PLACEHOLDERS=true when you deliberately want
 * a populated-looking preview deployment (e.g. showing the design to the exec
 * board before real data exists). Do not set it on the live site.
 */
export const SHOW_PLACEHOLDER_DATA =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";
