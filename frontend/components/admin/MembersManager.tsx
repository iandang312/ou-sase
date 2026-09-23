"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";
import { SaveStatus } from "@/components/admin/SaveStatus";
import {
  createMember,
  deleteMember,
  listAllMembers,
  updateMember,
} from "@/lib/firestore";
import type { Classification, Member } from "@/lib/types";

const CLASSIFICATIONS: Classification[] = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
  "Alumni",
];

const SEEKING_OPTIONS = ["Internship", "Co-op", "Full-time", "Research"] as const;

type MemberDraft = Omit<Member, "id" | "createdAt" | "updatedAt">;

const inputClass =
  "border-hairline rounded-md border px-3 py-2 text-body-md bg-canvas focus:outline-2 focus:outline-brand-ink";
const labelClass = "text-caption-strong text-ink flex items-center gap-1";

function Required() {
  return (
    <span className="text-negative" aria-hidden>
      *
    </span>
  );
}

function emptyDraft(): MemberDraft {
  return {
    firstName: "",
    lastName: "",
    email: "",
    major: "",
    gradYear: new Date().getFullYear() + 1,
    classification: "Freshman",
    photoPublicId: undefined,
    resumePublicId: undefined,
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    skills: [],
    bio: "",
    visibleToRecruiters: false,
    seeking: [],
  };
}

/** A form section: a heading plus a description, so a long form reads as a
 * handful of short ones instead of one endless column. */
function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-hairline-soft border-t pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3">
        <h4 className="text-body-md text-ink font-semibold">{title}</h4>
        {hint ? <p className="text-caption text-muted">{hint}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

export function MembersManager() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<MemberDraft>(emptyDraft());
  const [skillsText, setSkillsText] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const formTopRef = useRef<HTMLDivElement | null>(null);

  async function refresh() {
    try {
      setMembers(await listAllMembers());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load members.");
    }
  }

  // The initial load is awaited inside the effect and guarded by `cancelled`,
  // so nothing writes state synchronously on mount and a slow Firestore
  // response can't land after the component unmounts.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await listAllMembers();
        if (!cancelled) setMembers(rows);
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load members.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function scrollToForm() {
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function startNew() {
    setDraft(emptyDraft());
    setSkillsText("");
    setSaveState("idle");
    setSaveError(null);
    setEditingId("new");
    scrollToForm();
  }

  function startEdit(member: Member) {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = member;
    setDraft(rest);
    setSkillsText(member.skills.join(", "));
    setSaveState("idle");
    setSaveError(null);
    setEditingId(member.id);
    scrollToForm();
  }

  function cancelEdit() {
    setEditingId(null);
    setSaveState("idle");
  }

  async function handleSave() {
    setSaveState("saving");
    setSaveError(null);
    try {
      const payload: MemberDraft = {
        ...draft,
        skills: skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editingId === "new") {
        await createMember(payload);
      } else if (editingId) {
        await updateMember(editingId, payload);
      }
      setSaveState("saved");
      await refresh();
      // Give the officer a moment to see the "Saved" confirmation before the
      // form closes, so nothing feels like it silently succeeded.
      setTimeout(() => {
        setEditingId(null);
        setSaveState("idle");
      }, 700);
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Failed to save member.");
    }
  }

  async function handleDelete(id: string) {
    await deleteMember(id);
    await refresh();
  }

  const filteredMembers = useMemo(() => {
    if (!members) return members;
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      `${m.firstName} ${m.lastName} ${m.email} ${m.major}`.toLowerCase().includes(q),
    );
  }, [members, search]);

  return (
    <div className="flex flex-col gap-6">
      <div ref={formTopRef} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-title-md text-ink">Members</h2>
          <p className="text-body-sm text-body">
            {members ? `${members.length} member${members.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        {editingId === null ? <Button onClick={startNew}>Add member</Button> : null}
      </div>

      {loadError ? <p className="text-negative text-body-sm">{loadError}</p> : null}

      {editingId !== null ? (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-title-sm text-ink font-semibold">
              {editingId === "new" ? "New member" : `Edit ${draft.firstName || "member"}`}
            </h3>
            <button
              type="button"
              onClick={cancelEdit}
              className="text-body-sm text-brand-ink hover:underline"
            >
              ← Back to list
            </button>
          </div>

          <p className="text-caption text-muted mb-5">
            Fields marked <Required /> are required.
          </p>

          <div className="flex flex-col gap-5">
            <FormSection title="Basic info">
              <label className="flex flex-col gap-1">
                <span className={labelClass}>
                  First name <Required />
                </span>
                <input
                  className={inputClass}
                  value={draft.firstName}
                  onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelClass}>
                  Last name <Required />
                </span>
                <input
                  className={inputClass}
                  value={draft.lastName}
                  onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelClass}>
                  Email <Required />
                </span>
                <input
                  type="email"
                  className={inputClass}
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </label>
            </FormSection>

            <FormSection title="Academics">
              <label className="flex flex-col gap-1">
                <span className={labelClass}>
                  Major <Required />
                </span>
                <input
                  className={inputClass}
                  value={draft.major}
                  onChange={(e) => setDraft({ ...draft, major: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelClass}>
                  Grad year <Required />
                </span>
                <input
                  type="number"
                  className={inputClass}
                  value={draft.gradYear}
                  onChange={(e) => setDraft({ ...draft, gradYear: Number(e.target.value) })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelClass}>
                  Classification <Required />
                </span>
                <select
                  className={inputClass}
                  value={draft.classification}
                  onChange={(e) =>
                    setDraft({ ...draft, classification: e.target.value as Classification })
                  }
                >
                  {CLASSIFICATIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset>
                <legend className="text-caption-strong text-ink mb-1">Seeking (optional)</legend>
                <div className="flex flex-wrap gap-4 pt-1">
                  {SEEKING_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-body-sm">
                      <input
                        type="checkbox"
                        checked={draft.seeking.includes(opt)}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            seeking: e.target.checked
                              ? [...draft.seeking, opt]
                              : draft.seeking.filter((s) => s !== opt),
                          })
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </FormSection>

            <FormSection title="Profile (optional)" hint="Shown on the public card when visible.">
              <label className="flex flex-col gap-1">
                <span className="text-caption-strong text-ink">LinkedIn URL</span>
                <input
                  className={inputClass}
                  value={draft.linkedinUrl ?? ""}
                  onChange={(e) => setDraft({ ...draft, linkedinUrl: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-caption-strong text-ink">GitHub URL</span>
                <input
                  className={inputClass}
                  value={draft.githubUrl ?? ""}
                  onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-caption-strong text-ink">Portfolio URL</span>
                <input
                  className={inputClass}
                  value={draft.portfolioUrl ?? ""}
                  onChange={(e) => setDraft({ ...draft, portfolioUrl: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-caption-strong text-ink">Skills (comma-separated)</span>
                <input
                  className={inputClass}
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-caption-strong text-ink">
                  Bio ({(draft.bio ?? "").length}/240)
                </span>
                <textarea
                  className={inputClass}
                  rows={3}
                  maxLength={240}
                  value={draft.bio ?? ""}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                />
              </label>
              <div className="md:col-span-2">
                <CloudinaryUploadField
                  label="Profile photo"
                  value={draft.photoPublicId}
                  onChange={(id) => setDraft({ ...draft, photoPublicId: id })}
                />
              </div>
              <div className="md:col-span-2">
                <CloudinaryUploadField
                  label="Resume (PDF)"
                  accept="application/pdf"
                  value={draft.resumePublicId}
                  onChange={(id) => setDraft({ ...draft, resumePublicId: id })}
                />
              </div>
            </FormSection>

            <div className="border-hairline-soft border-t pt-5">
              <h4 className="text-body-md text-ink mb-3 font-semibold">Visibility</h4>
              <div
                className={`rounded-lg border p-4 transition-colors ${
                  draft.visibleToRecruiters
                    ? "bg-positive-soft border-positive/30"
                    : "bg-surface-strong border-hairline"
                }`}
              >
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={draft.visibleToRecruiters}
                    onChange={(e) =>
                      setDraft({ ...draft, visibleToRecruiters: e.target.checked })
                    }
                  />
                  <span className="flex-1">
                    <span className="text-body-md text-ink flex flex-wrap items-center gap-2 font-semibold">
                      Visible to recruiters
                      {draft.visibleToRecruiters ? (
                        <Badge tone="positive">Live on /recruitment</Badge>
                      ) : (
                        <Badge tone="neutral">Not shown publicly</Badge>
                      )}
                    </span>
                    <span className="text-body-sm text-body mt-1 block">
                      {draft.visibleToRecruiters ? (
                        <>
                          Anyone visiting the public recruitment page can currently see{" "}
                          <strong className="text-ink">
                            {draft.firstName || "this student"}&apos;s
                          </strong>{" "}
                          name, photo, major, and links. Uncheck this the moment they ask to be
                          removed.
                        </>
                      ) : (
                        <>
                          This real student is hidden from the public page. Only check this after
                          they&apos;ve consented to appear on /recruitment.
                        </>
                      )}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-hairline-soft mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saveState === "saving"}>
                {saveState === "saving" ? "Saving…" : "Save"}
              </Button>
              <Button variant="secondary" onClick={cancelEdit} disabled={saveState === "saving"}>
                Cancel
              </Button>
            </div>
            <SaveStatus state={saveState} savedLabel="Member saved." errorText={saveError} />
          </div>
        </Card>
      ) : null}

      {editingId === null ? (
        <label className="flex flex-col gap-1 sm:max-w-xs">
          <span className="sr-only">Search members</span>
          <input
            type="search"
            placeholder="Search by name, email, or major…"
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      ) : null}

      {editingId === null ? (
        <div className="flex flex-col gap-3">
          {members === null ? (
            <p className="text-body-sm text-body">Loading members…</p>
          ) : filteredMembers && filteredMembers.length === 0 ? (
            <p className="text-body-sm text-body">
              {search ? "No members match that search." : "No members yet."}
            </p>
          ) : (
            filteredMembers?.map((member) => (
              <Card key={member.id} className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-body-md text-ink flex flex-wrap items-center gap-2 font-semibold">
                    {member.firstName} {member.lastName}
                    {member.visibleToRecruiters ? (
                      <Badge tone="positive">Visible</Badge>
                    ) : (
                      <Badge tone="neutral">Hidden</Badge>
                    )}
                  </p>
                  <p className="text-body-sm text-body truncate">
                    {member.major} · {member.classification} · class of {member.gradYear}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="text" onClick={() => startEdit(member)}>
                    Edit
                  </Button>
                  <ConfirmButton onConfirm={() => handleDelete(member.id)} />
                </div>
              </Card>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
