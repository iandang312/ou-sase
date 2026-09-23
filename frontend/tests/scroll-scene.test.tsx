import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SceneStep, ScrollScene } from "@/components/ui/ScrollScene";

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: reduce && query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

function renderScene() {
  render(
    <ScrollScene length={3} aria-label="scene">
      <SceneStep from={0} to={0.5} first>
        <p>First beat</p>
      </SceneStep>
      <SceneStep from={0.5} to={1} last>
        <p>Second beat</p>
      </SceneStep>
    </ScrollScene>,
  );
  return screen.getByRole("region", { name: "scene" });
}

describe("ScrollScene", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is tall with a sticky stage when motion is allowed", () => {
    mockReducedMotion(false);
    const scene = renderScene();
    expect(scene.style.height).toBe("300svh");
    expect(scene.firstElementChild?.className).toContain("sticky");
  });

  it("renders every step visible and in normal flow under reduced motion", () => {
    mockReducedMotion(true);
    const scene = renderScene();
    expect(scene.style.height).toBe("");
    expect(scene.firstElementChild?.className).not.toContain("sticky");
    for (const text of ["First beat", "Second beat"]) {
      const step = screen.getByText(text).closest("[data-scene-step]") as HTMLElement;
      expect(step.className).not.toContain("absolute");
      expect(step.style.opacity).toBe("");
    }
  });
});
