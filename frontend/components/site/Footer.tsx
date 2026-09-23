import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { NAV_LINKS } from "./Nav";

const SOCIALS = [
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
  { href: "https://discord.com/", label: "Discord" },
];

export function Footer() {
  return (
    <footer className="border-hairline bg-canvas mt-auto border-t">
      <Container className="py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-[34ch]">
            <p className="text-title-md text-ink font-semibold">
              OU <span className="text-brand-ink">SASE</span>
            </p>
            <p className="text-body-sm text-body mt-3">
              Society of Asian Scientists and Engineers at the University of
              Oklahoma. Preparing members to succeed professionally, achieve
              personally, and contribute locally.
            </p>
          </div>

          <div className="flex gap-12">
            <nav aria-label="Footer">
              <p className="text-caption-strong text-muted uppercase tracking-[0.08em]">
                Chapter
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-body hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/login"
                    className="text-body-sm text-body hover:text-ink transition-colors"
                  >
                    Exec login
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <p className="text-caption-strong text-muted uppercase tracking-[0.08em]">
                Connect
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm text-body hover:text-ink transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="text-caption text-muted border-hairline-soft mt-12 border-t pt-6">
          &copy; {new Date().getFullYear()} OU SASE. Built and maintained by
          chapter members.
        </p>
      </Container>
    </footer>
  );
}
