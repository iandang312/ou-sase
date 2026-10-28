// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";

import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

/*
 * Headings get Archivo's wide cut only through the `font-display` utility, and
 * keep their line breaks while it loads only because the measured wide
 * fallbacks sit right behind it in --font-display. Neither shows up as a type
 * error or a failed render, so build the real globals.css and check both.
 */
describe("display font in globals.css", () => {
  it("sets the wide cut and the measured fallback stack", async () => {
    const root = path.resolve(__dirname, "..");
    const css = readFileSync(path.join(root, "app/globals.css"), "utf8");
    const compiler = await compile(css, { base: root, onDependency: () => {} });
    const out = compiler.build(["font-display"]);

    expect(out).toMatch(/\.font-display\s*\{[^}]*font-stretch:\s*125%/);
    expect(out).toMatch(/\.font-display\s*\{[^}]*font-family:\s*var\(--font-display\)/);
    expect(out).toMatch(
      /--font-display:\s*var\(--font-sase-display\),\s*"Archivo Wide Fallback",\s*"Archivo Wide Fallback Bold",/,
    );
    expect(out).toMatch(/@font-face\s*\{[^}]*font-family:\s*"Archivo Wide Fallback";[^}]*size-adjust/);
    expect(out).toMatch(
      /@font-face\s*\{[^}]*font-family:\s*"Archivo Wide Fallback Bold";[^}]*size-adjust/,
    );
  });
});
