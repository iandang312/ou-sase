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
import { Container, Section } from "@/components/ui/Layout";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useAuth, isFirebaseConfigured } from "@/lib/useAuth";

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, exec, loading, isAuthorized, signOut } = useAuth();

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
            <Button variant="secondary" onClick={() => signOut()}>
              Sign out
            </Button>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section tone="soft" className="min-h-[60vh]">
      <Container>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-caption-strong text-muted uppercase tracking-[0.08em]">Admin</p>
            <h1 className="font-display text-title-lg text-ink">
              Welcome, {exec?.displayName || user.email}
            </h1>
          </div>
          <nav aria-label="Admin sections" className="flex flex-wrap items-center gap-2">
            <Link href="/admin" className="text-body-md text-brand-ink hover:underline">
              Overview
            </Link>
            <Link href="/admin/members" className="text-body-md text-brand-ink hover:underline">
              Members
            </Link>
            <Link href="/admin/sponsors" className="text-body-md text-brand-ink hover:underline">
              Sponsors
            </Link>
            <Link href="/admin/photos" className="text-body-md text-brand-ink hover:underline">
              Event photos
            </Link>
            <Button variant="text" onClick={() => signOut()}>
              Sign out
            </Button>
          </nav>
        </div>
        {children}
      </Container>
    </Section>
  );
}
