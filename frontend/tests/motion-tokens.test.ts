// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";

import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

/*
 * FeatureCards, StatRow and the sponsors page use `duration-base`,
 * `duration-slow` and `ease-standard`. Tailwind v4 silently generates nothing
 * for a class it does not know, so build the real globals.css and check that
 * these resolve to the design tokens.
 */
describe("motion utilities in globals.css", () => {
  it("generates the named duration and easing utilities", async () => {
    const root = path.resolve(__dirname, "..");
    const css = readFileSync(path.join(root, "app/globals.css"), "utf8");
    const compiler = await compile(css, { base: root, onDependency: () => {} });
    const out = compiler.build(["duration-base", "duration-slow", "ease-standard", "ease-entrance"]);

    expect(out).toMatch(/\.duration-base\s*\{[^}]*transition-duration:\s*var\(--duration-base\)/);
    expect(out).toMatch(/\.duration-slow\s*\{[^}]*transition-duration:\s*var\(--duration-slow\)/);
    expect(out).toMatch(
      /\.ease-standard\s*\{[^}]*transition-timing-function:\s*var\(--ease-standard\)/,
    );
    expect(out).toMatch(/--ease-entrance:\s*cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(out).toMatch(/--duration-base:\s*240ms/);
  });
});
