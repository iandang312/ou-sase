import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * useAuth runs the Firebase listener, exec lookup and invite claim ONCE in
 * <AuthProvider>; every consumer reads that shared state. Firebase and the
 * Firestore helpers are mocked so the flow can be driven by hand.
 */

type Listener = (user: unknown) => void | Promise<void>;
const h = vi.hoisted(() => ({
  listener: null as Listener | null,
  getExec: vi.fn(),
  claimExecInvite: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({ auth: {}, isFirebaseConfigured: true }));
vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: class {},
  onAuthStateChanged: (_auth: unknown, cb: Listener) => {
    h.listener = cb;
    return () => {};
  },
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/lib/firestore", () => ({
  getExec: h.getExec,
  claimExecInvite: h.claimExecInvite,
}));

import { AuthProvider, UNVERIFIED_EMAIL_NOTICE, useAuth } from "@/lib/useAuth";

function Probe({ id }: { id: string }) {
  const { loading, isAuthorized, notice } = useAuth();
  return (
    <p data-testid={id}>
      {loading ? "loading" : isAuthorized ? "authorized" : `denied:${notice ?? ""}`}
    </p>
  );
}

function renderApp() {
  // Four consumers, like two NavAuthSlots + /login + AdminGate.
  return render(
    <AuthProvider>
      <Probe id="a" />
      <Probe id="b" />
      <Probe id="c" />
      <Probe id="d" />
    </AuthProvider>,
  );
}

const exec = { id: "u1", email: "jane@ou.edu", role: "officer", active: true };

beforeEach(() => {
  h.listener = null;
  h.getExec.mockReset();
  h.claimExecInvite.mockReset();
});
afterEach(cleanup);

describe("AuthProvider / useAuth", () => {
  it("runs the invite claim once for many consumers", async () => {
    h.getExec.mockResolvedValue(null);
    h.claimExecInvite.mockResolvedValue(exec);
    renderApp();
    await act(async () => {
      await h.listener!({ uid: "u1", email: "jane@ou.edu", emailVerified: true });
    });
    expect(h.getExec).toHaveBeenCalledTimes(1);
    expect(h.claimExecInvite).toHaveBeenCalledTimes(1);
    for (const id of ["a", "b", "c", "d"]) {
      expect(screen.getByTestId(id).textContent).toBe("authorized");
    }
  });

  it("skips the claim for an unverified email and explains why", async () => {
    h.getExec.mockResolvedValue(null);
    renderApp();
    await act(async () => {
      await h.listener!({ uid: "u2", email: "jane@ou.edu", emailVerified: false });
    });
    expect(h.claimExecInvite).not.toHaveBeenCalled();
    expect(screen.getByTestId("a").textContent).toBe(`denied:${UNVERIFIED_EMAIL_NOTICE}`);
  });

  it("does not need a verified email when the exec doc already exists", async () => {
    h.getExec.mockResolvedValue(exec);
    renderApp();
    await act(async () => {
      await h.listener!({ uid: "u1", email: "jane@ou.edu", emailVerified: false });
    });
    expect(h.claimExecInvite).not.toHaveBeenCalled();
    expect(screen.getByTestId("a").textContent).toBe("authorized");
  });

  it("throws a clear error outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe id="x" />)).toThrow(/AuthProvider/);
    spy.mockRestore();
  });
});
