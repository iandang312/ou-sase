/**
 * Normalize a free-text URL from an admin form into a safe external link.
 *
 * - Trims whitespace; empty input returns undefined.
 * - A bare host like `linkedin.com/in/jane` (very common when copying from a
 *   browser bar) gets `https://` prepended, so it does not render as a
 *   relative link into this site.
 * - Anything that is not http(s) — `javascript:`, `data:`, `mailto:`, … — is
 *   rejected (undefined), so it can never be stored or rendered as an href.
 *
 * Used at save time in the admin forms and again at render time on the public
 * pages, as defense in depth for documents written before this existed.
 */
export function safeHttpUrl(raw?: string | null): string | undefined {
  const v = raw?.trim();
  if (!v) return undefined;
  try {
    // A leading `word:` is a scheme, unless a port number follows it
    // (`www.site.com:8080/x` is a bare host, not a `www.site.com:` scheme).
    const hasScheme = /^[a-z][a-z\d+.-]*:(?!\d)/i.test(v);
    const u = new URL(hasScheme ? v : `https://${v}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
    // `https://foo` with no dot is almost certainly a typo, not a real site.
    if (!u.hostname.includes(".") && u.hostname !== "localhost") return undefined;
    return u.href;
  } catch {
    return undefined;
  }
}
