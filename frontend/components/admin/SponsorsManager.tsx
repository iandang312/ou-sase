"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";
import { deleteSponsor, listSponsors, upsertSponsor } from "@/lib/firestore";
import { SPONSOR_TIERS, type Sponsor, type SponsorTier } from "@/lib/types";

const TIERS = Object.keys(SPONSOR_TIERS) as SponsorTier[];

type SponsorDraft = Omit<Sponsor, "id">;

function emptyDraft(): SponsorDraft {
  return {
    name: "",
    tier: "Partner",
    logoPublicId: undefined,
    websiteUrl: "",
    blurb: "",
    since: undefined,
    active: true,
    order: 0,
  };
}

export function SponsorsManager() {
  const [sponsors, setSponsors] = useState<Sponsor[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<SponsorDraft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function refresh() {
    try {
      setSponsors(await listSponsors(false));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load sponsors.");
    }
  }

  // Awaited inside the effect and guarded by `cancelled` — no synchronous
  // state write on mount, and no late response landing after unmount.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await listSponsors(false);
        if (!cancelled) setSponsors(rows);
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load sponsors.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function startNew() {
    setDraft(emptyDraft());
    setSaveError(null);
    setEditingId("new");
  }

  function startEdit(sponsor: Sponsor) {
    const { id: _id, ...rest } = sponsor;
    setDraft(rest);
    setSaveError(null);
    setEditingId(sponsor.id);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await upsertSponsor({ ...draft, id: editingId === "new" ? undefined : editingId! });
      setEditingId(null);
      await refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save sponsor.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteSponsor(id);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-title-md text-ink">Sponsors</h2>
        {editingId === null ? <Button onClick={startNew}>Add sponsor</Button> : null}
      </div>

      {loadError ? <p className="text-negative text-body-sm">{loadError}</p> : null}

      {editingId !== null ? (
        <Card>
          <h3 className="text-title-sm text-ink mb-4 font-semibold">
            {editingId === "new" ? "New sponsor" : "Edit sponsor"}
          </h3>
          {saveError ? <p className="text-negative text-body-sm mb-3">{saveError}</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Name</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Tier</span>
              <select
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.tier}
                onChange={(e) => setDraft({ ...draft, tier: e.target.value as SponsorTier })}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Website URL</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.websiteUrl ?? ""}
                onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Partner since (year)</span>
              <input
                type="number"
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.since ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    since: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Order (lower sorts first)</span>
              <input
                type="number"
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              <span className="text-body-sm text-ink">Active (shown on public sponsors page)</span>
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-strong text-ink">Blurb</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.blurb ?? ""}
                onChange={(e) => setDraft({ ...draft, blurb: e.target.value })}
              />
            </label>
            <div className="md:col-span-2">
              <CloudinaryUploadField
                label="Logo"
                value={draft.logoPublicId}
                onChange={(id) => setDraft({ ...draft, logoPublicId: id })}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="secondary" onClick={() => setEditingId(null)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3">
        {sponsors === null ? (
          <p className="text-body-sm text-body">Loading sponsors…</p>
        ) : sponsors.length === 0 ? (
          <p className="text-body-sm text-body">No sponsors yet.</p>
        ) : (
          sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-body-md text-ink font-semibold">
                  {sponsor.name} <Badge tone="brand">{sponsor.tier}</Badge>{" "}
                  {!sponsor.active ? <Badge tone="neutral">Inactive</Badge> : null}
                </p>
                <p className="text-body-sm text-body">order {sponsor.order}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="text" onClick={() => startEdit(sponsor)}>
                  Edit
                </Button>
                <ConfirmButton onConfirm={() => handleDelete(sponsor.id)} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
