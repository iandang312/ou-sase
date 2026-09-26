import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * claimExecInvite: when the invite is already gone (claimed a moment ago by
 * another tab or a concurrent sign-in) it must re-read execs/{uid} instead of
 * reporting "not invited".
 */
const h = vi.hoisted(() => ({ docs: new Map<string, Record<string, unknown>>() }));

vi.mock("@/lib/firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
  doc: (_db: unknown, col: string, id: string) => ({ path: `${col}/${id}` }),
  getDoc: async (ref: { path: string }) => {
    const data = h.docs.get(ref.path);
    return { id: ref.path.split("/")[1], exists: () => Boolean(data), data: () => data };
  },
  setDoc: async (ref: { path: string }, data: Record<string, unknown>) => {
    h.docs.set(ref.path, data);
  },
  deleteDoc: async (ref: { path: string }) => {
    h.docs.delete(ref.path);
  },
  addDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn(),
}));

import { claimExecInvite } from "@/lib/firestore";

beforeEach(() => h.docs.clear());

describe("claimExecInvite", () => {
  it("exchanges an invite for an exec doc and consumes the invite", async () => {
    h.docs.set("execInvites/jane@ou.edu", { role: "admin", invitedBy: "p" });
    const exec = await claimExecInvite("u1", "Jane@OU.edu");
    expect(exec).toMatchObject({ id: "u1", role: "admin", active: true });
    expect(h.docs.has("execInvites/jane@ou.edu")).toBe(false);
  });

  it("falls back to the existing exec doc when the invite was just claimed", async () => {
    h.docs.set("execs/u1", { email: "jane@ou.edu", role: "officer", active: true });
    const exec = await claimExecInvite("u1", "jane@ou.edu");
    expect(exec).toMatchObject({ id: "u1", role: "officer" });
  });

  it("returns null for someone who was never invited", async () => {
    expect(await claimExecInvite("u9", "nobody@ou.edu")).toBeNull();
  });
});
