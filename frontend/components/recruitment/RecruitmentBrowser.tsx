"use client";

import { useMemo, useState } from "react";
import { MemberCard } from "@/components/recruitment/MemberCard";
import type { Member } from "@/lib/types";

type Seeking = Member["seeking"][number];

const SEEKING_OPTIONS: Seeking[] = ["Internship", "Co-op", "Full-time", "Research"];
const ALL = "all";

/**
 * Client-side filter + grid over an already-privacy-filtered member list.
 * `members` must already be the `visibleToRecruiters === true` set — this
 * component only narrows further, it never widens what it was given.
 */
export function RecruitmentBrowser({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");
  const [gradYear, setGradYear] = useState<string>(ALL);
  const [major, setMajor] = useState<string>(ALL);
  const [seeking, setSeeking] = useState<string>(ALL);

  const gradYears = useMemo(
    () => Array.from(new Set(members.map((m) => m.gradYear))).sort((a, b) => a - b),
    [members],
  );
  const majors = useMemo(
    () => Array.from(new Set(members.map((m) => m.major))).sort((a, b) => a.localeCompare(b)),
    [members],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (gradYear !== ALL && String(m.gradYear) !== gradYear) return false;
      if (major !== ALL && m.major !== major) return false;
      if (seeking !== ALL && !m.seeking.includes(seeking as Seeking)) return false;
      if (q) {
        const haystack = `${m.firstName} ${m.lastName} ${m.skills.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [members, search, gradYear, major, seeking]);

  return (
    <div>
      <form
        role="search"
        aria-label="Filter members"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="member-search" className="text-caption-strong text-ink">
            Search
          </label>
          <input
            id="member-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or skill"
            className="border-hairline bg-canvas text-ink h-11 rounded-md border px-3 text-body-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="filter-gradyear" className="text-caption-strong text-ink">
            Graduation year
          </label>
          <select
            id="filter-gradyear"
            value={gradYear}
            onChange={(e) => setGradYear(e.target.value)}
            className="border-hairline bg-canvas text-ink h-11 rounded-md border px-3 text-body-sm"
          >
            <option value={ALL}>All years</option>
            {gradYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="filter-major" className="text-caption-strong text-ink">
            Major
          </label>
          <select
            id="filter-major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="border-hairline bg-canvas text-ink h-11 rounded-md border px-3 text-body-sm"
          >
            <option value={ALL}>All majors</option>
            {majors.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="filter-seeking" className="text-caption-strong text-ink">
            Seeking
          </label>
          <select
            id="filter-seeking"
            value={seeking}
            onChange={(e) => setSeeking(e.target.value)}
            className="border-hairline bg-canvas text-ink h-11 rounded-md border px-3 text-body-sm"
          >
            <option value={ALL}>All types</option>
            {SEEKING_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p className="text-caption text-muted mt-4" aria-live="polite">
        {filtered.length} of {members.length} member{members.length === 1 ? "" : "s"} shown
      </p>

      {filtered.length === 0 ? (
        <div className="border-hairline bg-surface-soft mt-6 rounded-lg border p-8 text-center">
          <p className="text-body-md text-body">
            {members.length === 0
              ? "No members have published a recruiter profile yet. Check back soon."
              : "No members match these filters. Try clearing one and searching again."}
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <li key={member.id}>
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
