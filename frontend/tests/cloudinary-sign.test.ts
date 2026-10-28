import { createHash } from "node:crypto";

import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebaseAdmin", () => ({
  isAdminConfigured: true,
  verifyActiveExec: async (header: string | null) =>
    header === "Bearer exec-token" ? { uid: "exec-1", email: null, role: "officer" } : null,
}));

const SECRET = "test-secret";
let POST: (request: Request) => Promise<Response>;

beforeAll(async () => {
  // The route reads its env at import time.
  vi.stubEnv("CLOUDINARY_API_KEY", "test-key");
  vi.stubEnv("CLOUDINARY_API_SECRET", SECRET);
  vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "test-cloud");
  ({ POST } = await import("@/app/api/cloudinary/sign/route"));
});

function sign(paramsToSign: Record<string, unknown>, token = "exec-token") {
  return POST(
    new Request("http://localhost/api/cloudinary/sign", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paramsToSign }),
    }),
  );
}

describe("POST /api/cloudinary/sign", () => {
  it("signs an upload into an allowed folder", async () => {
    const res = await sign({ folder: "resumes" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.signedParams).toEqual({ folder: "resumes" });
    // Cloudinary's scheme: sha1 of the sorted "k=v" pairs joined by "&", then the secret.
    const expected = createHash("sha1")
      .update(`folder=resumes&timestamp=${body.timestamp}${SECRET}`)
      .digest("hex");
    expect(body.signature).toBe(expected);
  });

  it("rejects a client-chosen public_id so existing assets cannot be overwritten", async () => {
    const res = await sign({ folder: "resumes", public_id: "resumes/someone-else" });
    expect(res.status).toBe(400);
    expect(await res.json()).not.toHaveProperty("signature");
  });

  it("rejects folders outside the allowed set", async () => {
    for (const folder of ["other", "resumes/../x", "", 42]) {
      expect((await sign({ folder })).status).toBe(400);
    }
  });

  it("treats a non-object paramsToSign as empty instead of crashing", async () => {
    const res = await sign("public_id" as unknown as Record<string, unknown>);
    expect(res.status).toBe(200);
    expect((await res.json()).signedParams).toEqual({});
  });

  it("still refuses callers who are not active execs", async () => {
    expect((await sign({ folder: "resumes" }, "nobody")).status).toBe(401);
  });
});
