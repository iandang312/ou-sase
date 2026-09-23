import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { NavAuthSlot } from "./NavAuthSlot";

/** Public navigation. Admin is intentionally NOT listed — it's reachable
 *  from the auth slot once signed in, and advertising it invites poking. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/sponsors", label: "Sponsors" },
] as const;

export function Nav() {
  return (
    <header className="border-hairline bg-canvas/90 sticky top-0 z-50 border-b backdrop-blur-sm">
      <Container>
        <nav
          aria-label="Primary"
          className="flex h-16 items-center justify-between gap-6"
        >
          <Link
            href="/"
            className="text-title-md text-ink flex items-center gap-2 font-semibold"
          >
            <span
              aria-hidden="true"
              className="bg-brand ring-brand-ink/20 h-6 w-6 rounded-md ring-1 ring-inset"
            />
            <span>
              OU <span className="text-brand-ink">SASE</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-nav-link text-body hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <NavAuthSlot />
        </nav>
      </Container>
    </header>
  );
}
