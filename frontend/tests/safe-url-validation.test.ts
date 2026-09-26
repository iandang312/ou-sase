import { describe, expect, it } from "vitest";

import { safeHttpUrl } from "@/lib/safeUrl";
import { validateMemberDraft, validateSponsorDraft } from "@/lib/validation";
import type { Member, Sponsor } from "@/lib/types";

describe("safeHttpUrl", () => {
  it("keeps absolute http(s) URLs", () => {
    expect(safeHttpUrl("https://linkedin.com/in/jane")).toBe("https://linkedin.com/in/jane");
    expect(safeHttpUrl("http://example.com")).toBe("http://example.com/");
  });

  it("prepends https:// to a bare host copied from the address bar", () => {
    expect(safeHttpUrl("linkedin.com/in/jane")).toBe("https://linkedin.com/in/jane");
    expect(safeHttpUrl("  www.github.com/jane  ")).toBe("https://www.github.com/jane");
  });

  it("rejects non-http schemes", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeHttpUrl("JavaScript:alert(1)")).toBeUndefined();
    expect(safeHttpUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(safeHttpUrl("mailto:jane@ou.edu")).toBeUndefined();
    expect(safeHttpUrl("ftp://example.com")).toBeUndefined();
  });

  it("returns undefined for empty or unparseable input", () => {
    expect(safeHttpUrl(undefined)).toBeUndefined();
    expect(safeHttpUrl(null)).toBeUndefined();
    expect(safeHttpUrl("   ")).toBeUndefined();
    expect(safeHttpUrl("not a url")).toBeUndefined();
    expect(safeHttpUrl("jane")).toBeUndefined();
  });
});

type MemberDraft = Omit<Member, "id" | "createdAt" | "updatedAt">;
type SponsorDraft = Omit<Sponsor, "id">;

function member(overrides: Partial<MemberDraft> = {}): MemberDraft {
  return {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@ou.edu",
    major: "Computer Science",
    gradYear: new Date().getFullYear() + 1,
    classification: "Junior",
    skills: [],
    visibleToRecruiters: false,
    seeking: [],
    ...overrides,
  };
}

function sponsor(overrides: Partial<SponsorDraft> = {}): SponsorDraft {
  return { name: "Acme", tier: "Gold", active: true, order: 0, ...overrides };
}

describe("validateMemberDraft", () => {
  it("accepts a complete draft", () => {
    expect(validateMemberDraft(member())).toBeNull();
  });

  it("rejects a blank draft and names what is missing", () => {
    const msg = validateMemberDraft(
      member({ firstName: "", lastName: " ", email: "", major: "" }),
    );
    expect(msg).toMatch(/first name, last name, email, major/);
  });

  it("rejects a cleared grad year (Number('') === 0) and non-integers", () => {
    expect(validateMemberDraft(member({ gradYear: 0 }))).toMatch(/Grad year/);
    expect(validateMemberDraft(member({ gradYear: Number.NaN }))).toMatch(/Grad year/);
    expect(validateMemberDraft(member({ gradYear: 2026.5 }))).toMatch(/Grad year/);
    expect(validateMemberDraft(member({ gradYear: 9999 }))).toMatch(/Grad year/);
  });

  it("allows empty links but rejects non-http ones", () => {
    expect(validateMemberDraft(member({ linkedinUrl: "" }))).toBeNull();
    expect(validateMemberDraft(member({ githubUrl: "github.com/jane" }))).toBeNull();
    expect(validateMemberDraft(member({ portfolioUrl: "javascript:alert(1)" }))).toMatch(
      /Portfolio URL/,
    );
  });
});

describe("validateSponsorDraft", () => {
  it("accepts a minimal sponsor", () => {
    expect(validateSponsorDraft(sponsor())).toBeNull();
  });

  it("requires a name", () => {
    expect(validateSponsorDraft(sponsor({ name: "  " }))).toMatch(/name is required/);
  });

  it("allows a blank 'since' but rejects an impossible year", () => {
    expect(validateSponsorDraft(sponsor({ since: undefined }))).toBeNull();
    expect(validateSponsorDraft(sponsor({ since: 0 }))).toMatch(/Partner since/);
    expect(validateSponsorDraft(sponsor({ since: new Date().getFullYear() + 1 }))).toMatch(
      /Partner since/,
    );
  });

  it("rejects a non-http website", () => {
    expect(validateSponsorDraft(sponsor({ websiteUrl: "data:text/html,x" }))).toMatch(/Website/);
  });
});
