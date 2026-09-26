/** Public navigation. Admin is intentionally NOT listed — it's reachable
 *  from the auth slot once signed in, and advertising it invites poking.
 *
 * Lives in its own (non-"use client") module so both Nav (client, for the
 * mobile drawer/interactivity) and Footer (server) can import the plain
 * array without crossing a client-component boundary — importing a data
 * export from a "use client" file into a server component turns it into a
 * client reference, not the real array. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/sponsors", label: "Sponsors" },
] as const;
