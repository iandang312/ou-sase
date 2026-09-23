"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { deleteEventPhoto, listEventPhotos, upsertEventPhoto } from "@/lib/firestore";
import type { EventPhoto } from "@/lib/types";

const inputClass = "border-hairline rounded-md border px-3 py-2 text-body-md bg-canvas";

type PhotoDraft = Omit<EventPhoto, "id">;

function emptyDraft(): PhotoDraft {
  return {
    photoPublicId: "",
    alt: "",
    caption: "",
    eventName: "",
    date: "",
    rotation: 0,
    scale: 1,
    featured: false,
    order: 0,
  };
}

export function EventPhotosManager() {
  const [photos, setPhotos] = useState<EventPhoto[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<PhotoDraft>(emptyDraft());
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  async function refresh() {
    try {
      setPhotos(await listEventPhotos());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load event photos.");
    }
  }

  // Awaited inside the effect and guarded by `cancelled` — no synchronous
  // state write on mount, and no late response landing after unmount.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await listEventPhotos();
        if (!cancelled) setPhotos(rows);
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error
              ? err.message
              : "Failed to load event photos.",
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
    setSaveState("idle");
    setSaveError(null);
    setEditingId("new");
  }

  function startEdit(photo: EventPhoto) {
    const { id: _id, ...rest } = photo;
    setDraft(rest);
    setSaveState("idle");
    setSaveError(null);
    setEditingId(photo.id);
  }

  async function handleSave() {
    if (!draft.photoPublicId) {
      setSaveState("error");
      setSaveError("A photo is required.");
      return;
    }
    if (!draft.alt.trim()) {
      setSaveState("error");
      setSaveError("Alt text is required.");
      return;
    }
    setSaveState("saving");
    setSaveError(null);
    try {
      await upsertEventPhoto({ ...draft, id: editingId === "new" ? undefined : editingId! });
      setSaveState("saved");
      await refresh();
      setTimeout(() => {
        setEditingId(null);
        setSaveState("idle");
      }, 700);
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Failed to save photo.");
    }
  }

  async function handleDelete(id: string) {
    await deleteEventPhoto(id);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-title-md text-ink">Event photos</h2>
        {editingId === null ? <Button onClick={startNew}>Add photo</Button> : null}
      </div>

      {loadError ? <p className="text-negative text-body-sm">{loadError}</p> : null}

      {editingId !== null ? (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-title-sm text-ink font-semibold">
              {editingId === "new" ? "New event photo" : "Edit event photo"}
            </h3>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-body-sm text-brand-ink hover:underline"
            >
              ← Back to list
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <CloudinaryUploadField
                label="Photo (required)"
                value={draft.photoPublicId}
                onChange={(id) => setDraft({ ...draft, photoPublicId: id ?? "" })}
              />
            </div>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-strong text-ink">Alt text (required)</span>
              <input
                className={inputClass}
                value={draft.alt}
                onChange={(e) => setDraft({ ...draft, alt: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Event name</span>
              <input
                className={inputClass}
                value={draft.eventName ?? ""}
                onChange={(e) => setDraft({ ...draft, eventName: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Date</span>
              <input
                type="date"
                className={inputClass}
                value={draft.date ?? ""}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-strong text-ink">Caption</span>
              <input
                className={inputClass}
                value={draft.caption ?? ""}
                onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Rotation (deg, -8..8)</span>
              <input
                type="number"
                min={-8}
                max={8}
                className={inputClass}
                value={draft.rotation}
                onChange={(e) => setDraft({ ...draft, rotation: Number(e.target.value) })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Scale</span>
              <input
                type="number"
                step={0.1}
                className={inputClass}
                value={draft.scale}
                onChange={(e) => setDraft({ ...draft, scale: Number(e.target.value) })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Order</span>
              <input
                type="number"
                className={inputClass}
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              />
              <span className="text-body-sm text-ink">Featured</span>
            </label>
          </div>
          <div className="border-hairline-soft mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saveState === "saving"}>
                {saveState === "saving" ? "Saving…" : "Save"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditingId(null)}
                disabled={saveState === "saving"}
              >
                Cancel
              </Button>
            </div>
            <SaveStatus state={saveState} savedLabel="Photo saved." errorText={saveError} />
          </div>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3">
        {photos === null ? (
          <p className="text-body-sm text-body">Loading photos…</p>
        ) : photos.length === 0 ? (
          <p className="text-body-sm text-body">No event photos yet.</p>
        ) : (
          photos.map((photo) => (
            <Card key={photo.id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-body-md text-ink font-semibold">
                  {photo.eventName || photo.alt} {photo.featured ? <Badge tone="brand">Featured</Badge> : null}
                </p>
                <p className="text-body-sm text-body">
                  order {photo.order} · rotation {photo.rotation}° · scale {photo.scale}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="text" onClick={() => startEdit(photo)}>
                  Edit
                </Button>
                <ConfirmButton onConfirm={() => handleDelete(photo.id)} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
