import { cleanup, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MemberCard } from "@/components/recruitment/MemberCard";
import { SquiggleRails } from "@/components/site/SquiggleRails";
import {
  TabletopGallery,
  PLACEHOLDER_PHOTOS,
} from "@/components/site/TabletopGallery";
import type { Member } from "@/lib/types";

/**
 * These cover the pieces with real logic in them. The page components under
 * app/ are async server components and cannot be rendered by Testing Library,
 * so they are exercised by hitting the running dev server instead.
 */

function makeMember(overrides: Partial<Member> = {}): Member {
  return {
    id: "m1",
    firstName: "Test",
    lastName: "Member",
    email: "test@example.com",
    major: "Computer Science",
    gradYear: 2027,
    classification: "Junior",
    skills: ["Python", "React"],
    visibleToRecruiters: true,
    seeking: ["Internship"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("MemberCard", () => {
  it("shows the member's name, major and graduation year", () => {
    render(<MemberCard member={makeMember()} />);
    expect(screen.getByText("Test Member")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Class of 2027")).toBeInTheDocument();
  });

  it("omits optional links that the member has not provided", () => {
    render(<MemberCard member={makeMember()} />);
    expect(screen.queryByRole("link", { name: /linkedin/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /github/i })).toBeNull();
  });

  it("renders provided links as safe external links", () => {
    render(
      <MemberCard
        member={makeMember({ linkedinUrl: "https://linkedin.com/in/test" })}
      />,
    );
    const link = screen.getByRole("link", { name: /linkedin/i });
    expect(link).toHaveAttribute("target", "_blank");
    // Without noreferrer the destination can reach back via window.opener.
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders a photo placeholder with a descriptive label when there is no photo", () => {
    render(<MemberCard member={makeMember()} />);
    expect(
      screen.getByRole("img", { name: "Photo of Test Member" }),
    ).toBeInTheDocument();
  });
});

describe("TabletopGallery", () => {
  it("renders every photo in both the mobile strip and the desktop scatter", () => {
    const photos = PLACEHOLDER_PHOTOS.slice(0, 3);
    render(<TabletopGallery photos={photos} />);
    for (const photo of photos) {
      // One in the filmstrip, one in the scatter — both layouts are in the DOM
      // and swapped by CSS, so each alt text appears exactly twice.
      expect(screen.getAllByRole("img", { name: photo.alt })).toHaveLength(2);
    }
  });

  it("renders nothing when there are no photos", () => {
    const { container } = render(<TabletopGallery photos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("orders photos by their stored order, not array position", () => {
    const photos = [
      { ...PLACEHOLDER_PHOTOS[0], id: "b", alt: "Second", order: 2 },
      { ...PLACEHOLDER_PHOTOS[1], id: "a", alt: "First", order: 1 },
    ];
    render(<TabletopGallery photos={photos} />);
    const strip = screen.getAllByRole("list")[0];
    const alts = within(strip)
      .getAllByRole("img")
      .map((el) => el.getAttribute("aria-label") ?? el.getAttribute("alt"));
    expect(alts).toEqual(["First", "Second"]);
  });

  it("uses the rotation stored on the photo rather than a random value", () => {
    // Randomised rotation would differ between server and client render and
    // cause hydration mismatches, so this must come from the data.
    //
    // The scatter applies rotation via the --rot custom property rather than a
    // literal inline `transform`, so that the hover "pick up" rule can override
    // it — an inline transform would beat the hover rule on specificity. The
    // value must still trace back to the photo record.
    const photo = { ...PLACEHOLDER_PHOTOS[0], rotation: -5, scale: 1 };
    const { container } = render(<TabletopGallery photos={[photo]} />);
    const rotated = container.querySelector('[style*="-5deg"]');
    expect(rotated).not.toBeNull();
    expect(rotated?.getAttribute("style")).toContain("--rot");
  });

  it("does not randomise rotation between renders", () => {
    const photo = { ...PLACEHOLDER_PHOTOS[0], rotation: 4, scale: 1 };
    const first = render(<TabletopGallery photos={[photo]} />);
    const a = first.container
      .querySelector("[style*='--rot']")
      ?.getAttribute("style");
    cleanup();
    const second = render(<TabletopGallery photos={[photo]} />);
    const b = second.container
      .querySelector("[style*='--rot']")
      ?.getAttribute("style");
    expect(a).toBe(b);
  });
});

describe("SquiggleRails", () => {
  it("is decorative: hidden from assistive tech and not clickable", () => {
    const { container } = render(<SquiggleRails />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(2); // one rail per side
    for (const svg of svgs) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      // Without this the rails would swallow taps near the screen edges.
      expect(svg.getAttribute("class")).toContain("pointer-events-none");
    }
  });
});
