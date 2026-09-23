"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmButton } from "./ConfirmButton";
import { useAuth } from "@/lib/useAuth";
import {
  inviteExec,
  listExecInvites,
  listExecs,
  revokeInvite,
  setExecActive,
  setExecRole,
} from "@/lib/firestore";
import type { Exec, ExecInvite, ExecRole } from "@/lib/types";

const ROLES: ExecRole[] = ["president", "officer", "admin"];

const ROLE_HELP: Record<ExecRole, string> = {
  president: "Full access. Intended for the chapter president.",
  officer: "Full access. The normal role for committee officers.",
  admin: "Full access. Use for whoever maintains the website itself.",
};

export function ExecsManager() {
  const { user, exec: me } = useAuth();
  const [execs, setExecs] = useState<Exec[]>([]);
  const [invites, setInvites] = useState<ExecInvite[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [listNotice, setListNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ExecRole>("officer");

  async function refresh() {
    try {
      const [rows, pending] = await Promise.all([listExecs(), listExecInvites()]);
      setExecs(rows);
      setInvites(pending);
      setLoadError(null);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load officers.",
      );
    }
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [rows, pending] = await Promise.all([
          listExecs(),
          listExecInvites(),
        ]);
        if (!cancelled) {
          setExecs(rows);
          setInvites(pending);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load officers.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    setFormError(null);
    setNotice(null);

    if (!trimmed || !trimmed.includes("@")) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (execs.some((x) => x.email.toLowerCase() === trimmed)) {
      setFormError("That person is already an officer.");
      return;
    }

    setBusy(true);
    try {
      await inviteExec(trimmed, role, user?.email ?? me?.email ?? "unknown");
      setEmail("");
      setNotice(
        `Invited ${trimmed}. They become an officer the first time they sign in with that exact address.`,
      );
      await refresh();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not create the invite.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function withRefresh(action: () => Promise<void>, successMessage?: string) {
    setBusy(true);
    setListError(null);
    setListNotice(null);
    try {
      await action();
      await refresh();
      if (successMessage) setListNotice(successMessage);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "That action failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <h2 className="font-display text-title-lg text-ink mb-2">Add an officer</h2>
        <p className="text-body-sm text-body mb-6 max-w-[62ch]">
          Enter the email address the person will sign in with. They do not need
          an account yet — the invite is claimed automatically the first time
          they sign in with that address. Only current officers can invite, so
          nobody can add themselves.
        </p>

        <form onSubmit={handleInvite} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="invite-email"
              className="text-caption-strong text-ink mb-2 block"
            >
              Email address
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@ou.edu"
              className="border-hairline text-body-md h-12 w-full rounded-md border px-4"
            />
          </div>
          <div>
            <label
              htmlFor="invite-role"
              className="text-caption-strong text-ink mb-2 block"
            >
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as ExecRole)}
              className="border-hairline text-body-md h-12 rounded-md border px-4"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Working…" : "Send invite"}
          </Button>
        </form>

        <p className="text-caption text-muted mt-3">{ROLE_HELP[role]}</p>

        {formError ? (
          <p className="text-body-sm text-negative mt-4">{formError}</p>
        ) : null}
        {notice ? (
          <p className="text-body-sm text-positive mt-4">{notice}</p>
        ) : null}
      </Card>

      {invites.length > 0 ? (
        <Card>
          <h2 className="font-display text-title-md text-ink mb-4">
            Pending invites
          </h2>
          <ul className="flex flex-col gap-3">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="border-hairline-soft flex items-center justify-between gap-4 border-b pb-3 last:border-0"
              >
                <div>
                  <p className="text-body-md text-ink">{invite.email}</p>
                  <p className="text-caption text-muted">
                    Invited as {invite.role}
                    {invite.invitedBy ? ` by ${invite.invitedBy}` : ""} — not
                    signed in yet
                  </p>
                </div>
                <ConfirmButton
                  label="Cancel invite"
                  confirmLabel="Confirm cancel?"
                  onConfirm={() =>
                    withRefresh(
                      () => revokeInvite(invite.email),
                      `Cancelled the invite for ${invite.email}.`,
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card>
        <h2 className="font-display text-title-md text-ink mb-4">Officers</h2>

        {loadError ? (
          <p className="text-body-sm text-negative">{loadError}</p>
        ) : null}
        {listError ? <p className="text-body-sm text-negative mb-4">{listError}</p> : null}
        {listNotice ? <p className="text-body-sm text-positive mb-4">{listNotice}</p> : null}

        {!loadError && execs.length === 0 ? (
          <p className="text-body-sm text-body">No officers yet.</p>
        ) : null}

        <ul className="flex flex-col gap-4">
          {execs.map((row) => {
            const isMe = row.id === user?.uid;
            return (
              <li
                key={row.id}
                className="border-hairline-soft flex flex-wrap items-center justify-between gap-4 border-b pb-4 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-body-md text-ink flex items-center gap-2">
                    {row.displayName ?? row.email}
                    {isMe ? <Badge tone="brand">You</Badge> : null}
                    {row.active ? null : <Badge tone="neutral">Revoked</Badge>}
                  </p>
                  <p className="text-caption text-muted">{row.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="sr-only" htmlFor={`role-${row.id}`}>
                    Role for {row.email}
                  </label>
                  <select
                    id={`role-${row.id}`}
                    value={row.role}
                    disabled={busy || isMe}
                    onChange={(e) =>
                      withRefresh(
                        () => setExecRole(row.id, e.target.value as ExecRole),
                        `Updated ${row.email} to ${e.target.value}.`,
                      )
                    }
                    className="border-hairline text-body-sm h-10 rounded-md border px-3 disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  {isMe ? (
                    // Guard rail: revoking yourself could leave the chapter
                    // with no way back in, which needs the console to fix.
                    <span className="text-caption text-muted">
                      You can&apos;t change your own access
                    </span>
                  ) : row.active ? (
                    <ConfirmButton
                      label="Revoke access"
                      confirmLabel="Confirm revoke?"
                      onConfirm={() =>
                        withRefresh(
                          () => setExecActive(row.id, false),
                          `Revoked access for ${row.email}. Their record is kept, not deleted.`,
                        )
                      }
                    />
                  ) : (
                    <Button
                      variant="secondary"
                      disabled={busy}
                      onClick={() =>
                        withRefresh(
                          () => setExecActive(row.id, true),
                          `Restored access for ${row.email}.`,
                        )
                      }
                    >
                      Restore access
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-caption text-muted mt-6">
          Access is revoked by deactivating, not deleting, so the record of who
          served each year survives.
        </p>
      </Card>
    </div>
  );
}
