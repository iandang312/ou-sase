"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Section } from "@/components/ui/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth, isFirebaseConfigured } from "@/lib/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, exec, loading, isAuthorized, error, signInWithGoogle, signInWithEmail, signOut } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push("/admin");
    } catch {
      // error surfaced via useAuth().error
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/admin");
    } catch {
      // error surfaced via useAuth().error
    } finally {
      setSubmitting(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <Section tone="soft">
        <Container className="max-w-[560px]">
          <Card>
            <h1 className="font-display text-title-lg text-ink mb-3">Exec login unavailable</h1>
            <p className="text-body-md text-body">
              Firebase environment variables are not set for this deployment, so sign-in cannot
              work yet. See <code className="text-caption-strong">HANDOFF.md</code> at the repo
              root for the values to add to <code className="text-caption-strong">.env.local</code>{" "}
              (or the deployment&apos;s env settings), then reload this page.
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

  // Signed in, but not an authorized exec: do NOT show any admin UI.
  if (user && !isAuthorized) {
    return (
      <Section tone="soft">
        <Container className="max-w-[560px]">
          <Card>
            <Badge tone="neutral" className="mb-4">
              Signed in as {user.email}
            </Badge>
            <h1 className="font-display text-title-lg text-ink mb-3">
              Your account isn&apos;t authorized
            </h1>
            <p className="text-body-md text-body mb-6">
              You&apos;re signed in, but there&apos;s no active exec record for this account.
              Ask a current officer to add you in the admin panel before you can manage the site.
            </p>
            <Button variant="secondary" onClick={() => signOut()}>
              Sign out
            </Button>
          </Card>
        </Container>
      </Section>
    );
  }

  if (isAuthorized) {
    return (
      <Section tone="soft">
        <Container className="max-w-[560px]">
          <Card>
            <h1 className="font-display text-title-lg text-ink mb-3">You&apos;re signed in</h1>
            <p className="text-body-md text-body mb-6">
              Signed in as {exec?.displayName || user?.email}.
            </p>
            <Button onClick={() => router.push("/admin")}>Go to admin</Button>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section tone="soft">
      <Container className="max-w-[560px]">
        <Card>
          <h1 className="font-display text-title-lg text-ink mb-2">Exec login</h1>
          <p className="text-body-md text-body mb-6">
            Sign in with your chapter Google account, or with email and password.
          </p>

          {error ? (
            <p className="text-negative text-body-sm mb-4" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            variant="secondary"
            className="w-full mb-6"
            onClick={handleGoogleSignIn}
            disabled={submitting}
          >
            Continue with Google
          </Button>

          <div className="border-hairline mb-6 flex items-center gap-3 border-t pt-6">
            <span className="text-caption text-muted">or use email and password</span>
          </div>

          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-hairline rounded-md border px-3 py-2 text-body-md"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-hairline rounded-md border px-3 py-2 text-body-md"
              />
            </label>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </Container>
    </Section>
  );
}
