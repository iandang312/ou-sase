"use client";

import { useId, useMemo, useState } from "react";
import { MemberCard } from "@/components/recruitment/MemberCard";
import {
  SEEKING_FILL_CLASS,
  SEEKING_OPTIONS,
  SEEKING_SOFT_CLASS,
  type Seeking,
} from "@/components/recruitment/seekingStyles";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import type { Member } from "@/lib/types";

const ALL = "all";

function FilterCrossIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" strokeLinecap="round" />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="text-muted-soft mx-auto h-10 w-10"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <circle cx="17" cy="17" r="10" />
      <path d="M24.5 24.5 32 32" strokeLinecap="round" />
    </svg>
  );
}

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersPanelId = useId();

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

  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (search.trim()) {
    activeFilters.push({ key: "search", label: `"${search.trim()}"`, clear: () => setSearch("") });
  }
  if (gradYear !== ALL) {
    activeFilters.push({ key: "gradYear", label: `Class of ${gradYear}`, clear: () => setGradYear(ALL) });
  }
  if (major !== ALL) {
    activeFilters.push({ key: "major", label: major, clear: () => setMajor(ALL) });
  }
  if (seeking !== ALL) {
    activeFilters.push({ key: "seeking", label: seeking, clear: () => setSeeking(ALL) });
  }

  function clearAll() {
    setSearch("");
    setGradYear(ALL);
    setMajor(ALL);
    setSeeking(ALL);
  }

  return (
    <div>
      <Reveal as="div" className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-body-md text-ink">
          <span className="text-title-md font-semibold">{filtered.length}</span>{" "}
          <span className="text-body">
            of {members.length} member{members.length === 1 ? "" : "s"} shown
          </span>
        </p>
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls={filtersPanelId}
          className="border-hairline text-ink inline-flex h-10 items-center gap-2 rounded-pill border px-4 text-body-sm font-semibold sm:hidden"
        >
          Filters
          {activeFilters.length > 0 ? (
            <span className="bg-brand text-on-brand inline-flex h-5 min-w-5 items-center justify-center rounded-pill px-1 text-caption-strong">
              {activeFilters.length}
            </span>
          ) : null}
        </button>
      </Reveal>

      <div id={filtersPanelId} className={`${filtersOpen ? "" : "hidden"} mt-4 sm:mt-4 sm:block`}>
        <form
          role="search"
          aria-label="Filter members"
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-caption-strong text-ink">Seeking</legend>
            <div className="flex flex-wrap gap-2">
              {SEEKING_OPTIONS.map((opt) => {
                const isActive = seeking === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSeeking(isActive ? ALL : opt)}
                    className={`rounded-pill border px-3 py-1.5 text-caption-strong font-semibold transition-[color,background-color,border-color,transform] duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                      isActive
                        ? `${SEEKING_FILL_CLASS[opt]} border-transparent`
                        : `${SEEKING_SOFT_CLASS[opt]} border-transparent hover:border-brand-ink/40`
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </form>
      </div>

      {activeFilters.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={f.clear}
              className="bg-surface-strong text-ink inline-flex items-center gap-1.5 rounded-pill py-1 pl-3 pr-2 text-caption-strong transition-colors duration-150 hover:bg-pastel-blue-soft hover:text-brand-ink"
            >
              {f.label}
              <FilterCrossIcon />
              <span className="sr-only">Remove filter {f.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-brand-ink text-caption-strong font-semibold hover:underline underline-offset-4"
          >
            Clear all
          </button>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="border-hairline bg-surface-soft mt-6 rounded-lg border p-10 text-center">
          <EmptyStateIcon />
          <p className="text-body-md text-body mt-4">
            {members.length === 0
              ? "No members have published a recruiter profile yet. Check back soon."
              : "No members match these filters."}
          </p>
          {members.length > 0 && activeFilters.length > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-brand-ink text-body-sm mt-3 font-semibold hover:underline underline-offset-4"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* RevealGroup keys each <li> by its POSITION in `filtered`, not by
              member id. That's deliberate: when a filter changes the set or
              order, an already-shown slot keeps its `shown` state (its
              content just swaps), so the grid does not replay its entrance
              animation on every filter click — only a slot that is newly
              rendered (the list grew) reveals itself. See DESIGN.md "Scroll
              animation" rule 1 (reveal once) and the brief's explicit
              warning against re-animating a filterable grid. */}
          <RevealGroup as="li" className="min-w-0">
            {filtered.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </RevealGroup>
        </ul>
      )}
    </div>
  );
}
