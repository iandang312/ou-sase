"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CloudinaryUploadField } from "@/components/admin/CloudinaryUploadField";
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

export function MembersManager() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<MemberDraft>(emptyDraft());
  const [skillsText, setSkillsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  function startNew() {
    setDraft(emptyDraft());
    setSkillsText("");
    setSaveError(null);
    setEditingId("new");
  }

  function startEdit(member: Member) {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = member;
    setDraft(rest);
    setSkillsText(member.skills.join(", "));
    setSaveError(null);
    setEditingId(member.id);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleSave() {
    setSaving(true);
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
      setEditingId(null);
      await refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save member.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteMember(id);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-title-md text-ink">Members</h2>
        {editingId === null ? <Button onClick={startNew}>Add member</Button> : null}
      </div>

      {loadError ? <p className="text-negative text-body-sm">{loadError}</p> : null}

      {editingId !== null ? (
        <Card>
          <h3 className="text-title-sm text-ink mb-4 font-semibold">
            {editingId === "new" ? "New member" : "Edit member"}
          </h3>
          {saveError ? <p className="text-negative text-body-sm mb-3">{saveError}</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">First name</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.firstName}
                onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Last name</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.lastName}
                onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Email</span>
              <input
                type="email"
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Major</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.major}
                onChange={(e) => setDraft({ ...draft, major: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Grad year</span>
              <input
                type="number"
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.gradYear}
                onChange={(e) => setDraft({ ...draft, gradYear: Number(e.target.value) })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Classification</span>
              <select
                className="border-hairline rounded-md border px-3 py-2"
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
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">LinkedIn URL</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.linkedinUrl ?? ""}
                onChange={(e) => setDraft({ ...draft, linkedinUrl: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">GitHub URL</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.githubUrl ?? ""}
                onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-strong text-ink">Portfolio URL</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={draft.portfolioUrl ?? ""}
                onChange={(e) => setDraft({ ...draft, portfolioUrl: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-strong text-ink">Skills (comma-separated)</span>
              <input
                className="border-hairline rounded-md border px-3 py-2"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-strong text-ink">Bio</span>
              <textarea
                className="border-hairline rounded-md border px-3 py-2"
                rows={3}
                maxLength={240}
                value={draft.bio ?? ""}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              />
            </label>

            <fieldset className="md:col-span-2">
              <legend className="text-caption-strong text-ink mb-1">Seeking</legend>
              <div className="flex flex-wrap gap-4">
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

            <div className="border-hairline bg-surface-strong rounded-lg border p-4 md:col-span-2">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={draft.visibleToRecruiters}
                  onChange={(e) =>
                    setDraft({ ...draft, visibleToRecruiters: e.target.checked })
                  }
                />
                <span>
                  <span className="text-body-md text-ink block font-semibold">
                    Visible to recruiters on the public page
                  </span>
                  <span className="text-body-sm text-body">
                    When checked, this real student&apos;s name, photo, and links appear on the
                    public /recruitment page. Leave unchecked until they&apos;ve consented.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="secondary" onClick={cancelEdit} disabled={saving}>
              Cancel
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3">
        {members === null ? (
          <p className="text-body-sm text-body">Loading members…</p>
        ) : members.length === 0 ? (
          <p className="text-body-sm text-body">No members yet.</p>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-body-md text-ink font-semibold">
                  {member.firstName} {member.lastName}{" "}
                  {member.visibleToRecruiters ? (
                    <Badge tone="positive">Visible</Badge>
                  ) : (
                    <Badge tone="neutral">Hidden</Badge>
                  )}
                </p>
                <p className="text-body-sm text-body">
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
    </div>
  );
}
