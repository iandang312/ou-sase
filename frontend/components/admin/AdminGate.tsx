"use client";

/**
 * Client-side gate for everything under /admin.
 *
 * UX ONLY — NOT THE SECURITY BOUNDARY. This is a static-friendly Firebase
 * app with no server session, so there is no way to enforce this on a
 * server. Anyone can view page source or disable JS and never see this
 * check run. The REAL enforcement is firestore.rules (owned by another
 * agent), which re-checks `execs/{uid}.active === true` on every read and
 * write. This component only prevents an authorized-looking flash of admin
 * UI for people who shouldn't see it, and gives a clear message instead of
 * a broken screen.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Section } from "@/components/ui/Layout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useAuth, isFirebaseConfigured } from "@/lib/useAuth";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/sponsors", label: "Sponsors" },
  { href: "/admin/photos", label: "Event photos" },
  { href: "/admin/execs", label: "Officers" },
] as const;

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, exec, loading, isAuthorized, notice, signOut } = useAuth();
  const pathname = usePathname();

  if (!isFirebaseConfigured) {
    return (
      <Section tone="soft">
        <Container className="max-w-[560px]">
          <Card>
            <h1 className="font-display text-title-lg text-ink mb-3">Admin unavailable</h1>
            <p className="text-body-md text-body">
              Firebase environment variables are not set for this deployment. See{" "}
              <code className="text-caption-strong">HANDOFF.md</code> for setup.
            </p>
          </Card>
        </Container>
      </Section>
    );
  }

  if (loading) {
    return (
      <Section tone="soft">
        <Container className="max-w-[560px]">
          <p className="text-body-md text-body">Checking session…</p>
        </Container>
      </Section>
    );
  }

  if (!user) {
    return (
      <Section tone="soft">
        <Container className="max-w-[560px]">
          <Card>
            <h1 className="font-display text-title-lg text-ink mb-3">Sign in required</h1>
            <p className="text-body-md text-body mb-6">
              You need to sign in as an authorized exec to view this page.
            </p>
            <ButtonLink href="/login">Go to login</ButtonLink>
          </Card>
        </Container>
      </Section>
    );
  }

  if (!isAuthorized) {
    return (
      <Section tone="soft">
        <Container className="max-w-[560px]">
          <Card>
            <h1 className="font-display text-title-lg text-ink mb-3">
              Your account isn&apos;t authorized
            </h1>
            <p className="text-body-md text-body mb-6">
              Signed in as {user.email}, but there&apos;s no active exec record for this account.
              Ask a current officer to add you before you can manage the site.
            </p>
            {notice ? (
              <p className="text-body-sm text-negative mb-6" role="alert">
                {notice}
              </p>
            ) : null}
            <Button variant="secondary" onClick={() => signOut()}>
              Sign out
            </Button>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <div className="min-h-[70vh]">
      <div className="border-hairline bg-surface-card border-b">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="min-w-0">
            <p className="text-caption-strong text-muted uppercase tracking-[0.08em]">
              OU SASE admin
            </p>
            <p className="text-body-sm text-body truncate">
              Signed in as <span className="text-ink font-semibold">{exec?.displayName || user.email}</span>
              {exec?.role ? (
                <Badge tone="brand" className="ml-2 align-middle">
                  {exec.role}
                </Badge>
              ) : null}
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => signOut()}>
            Sign out
          </Button>
        </Container>
      </div>

      <div className="border-hairline bg-surface-soft border-b">
        <Container>
          <nav
            aria-label="Admin sections"
            className="-mb-px flex flex-wrap gap-1 overflow-x-auto py-1"
          >
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-body-sm whitespace-nowrap rounded-t-md border-b-2 px-3 py-2.5 font-medium transition-colors ${
                    active
                      ? "border-brand-ink text-brand-ink"
                      : "text-muted hover:text-ink border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      <Section tone="soft" className="pt-6">
        <Container>{children}</Container>
      </Section>
    </div>
  );
}
