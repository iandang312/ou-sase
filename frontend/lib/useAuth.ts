"use client";

/**
 * Client auth hook: wraps Firebase `onAuthStateChanged` with the
 * authorization check that actually matters for this app.
 *
 * IMPORTANT: signing in with Firebase Auth only proves "this is a real
 * Google/email account". It does NOT prove the person is an authorized
 * exec. Authorization is a Firestore document: `execs/{uid}` must exist
 * AND have `active === true` (see lib/firestore.ts `getExec`). This hook
 * surfaces both `user` (Firebase Auth identity) and `exec` (authorization
 * record, or null) so callers can tell "signed in" apart from "authorized".
 *
 * SECURITY NOTE: `isAuthorized` here is for UI gating only (show/hide the
 * admin nav, redirect away from /admin). It is NOT the security boundary —
 * a user could tamper with client state and this hook would not stop a
 * malicious Firestore write. The real enforcement is firestore.rules,
 * which checks the same `execs/{uid}.active` condition server-side. See
 * components/admin/AdminGate.tsx for where this is used to gate routes.
 *
 * SHARED STATE: the auth listener, the exec lookup and the invite claim run
 * ONCE, inside <AuthProvider> (mounted in app/layout.tsx). Every `useAuth()`
 * call reads that one context. Before this, each caller (two NavAuthSlots,
 * /login, AdminGate) ran its own lookup, and on an invitee's first sign-in
 * they raced to claim the same invite — the loser saw "not authorized".
 */
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { claimExecInvite, getExec } from "./firestore";
import type { Exec } from "./types";

export interface UseAuthResult {
  /** Firebase Auth identity, or null when signed out. */
  user: User | null;
  /** Authorization record from `execs/{uid}`, or null when not authorized. */
  exec: Exec | null;
  /** True while the initial auth state (and, if signed in, the exec lookup) is resolving. */
  loading: boolean;
  /** True iff `user` is signed in AND `exec` is a non-null, active exec doc. */
  isAuthorized: boolean;
  /** Message from the most recent failed sign-in attempt, if any. */
  error: string | null;
  /**
   * Why a signed-in user was not authorized, when there is something they can
   * do about it (e.g. verify their email before an invite can be claimed).
   */
  notice: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const UNVERIFIED_EMAIL_NOTICE =
  "Your email address isn't verified, so an officer invite can't be claimed with this " +
  "account. Sign in with Google, or verify your email address and sign in again.";

const AuthContext = createContext<UseAuthResult | null>(null);

function useAuthState(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [exec, setExec] = useState<Exec | null>(null);
  // Start in "loading" ONLY when there is a session to wait for. When Firebase
  // isn't configured (see lib/firebase.ts isFirebaseConfigured) there is
  // nothing to observe, so the initial value is already final — deriving it
  // here avoids correcting state from inside an effect, which cascades renders.
  const [loading, setLoading] = useState(() => Boolean(auth));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setNotice(null);
      if (!firebaseUser) {
        setExec(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let execDoc = await getExec(firebaseUser.uid);
        if (!execDoc) {
          if (!firebaseUser.emailVerified) {
            // firestore.rules only honours VERIFIED emails for invite claims,
            // so trying would just be a silent permission-denied. Say why.
            setNotice(UNVERIFIED_EMAIL_NOTICE);
          } else {
            // No exec record yet. If a current officer has invited this
            // email, exchange that invite for a real exec document now.
            // Returns null for anyone who simply wasn't invited, which stays
            // a quiet "not authorized" rather than an error.
            execDoc = await claimExecInvite(
              firebaseUser.uid,
              firebaseUser.email,
              firebaseUser.displayName,
            );
          }
        }
        setExec(execDoc);
      } catch {
        // Firestore lookup failing (rules, offline, etc.) must not be
        // mistaken for authorization — fail closed.
        setExec(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      setError("Firebase is not configured — see HANDOFF.md.");
      return;
    }
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      throw err;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) {
      setError("Firebase is not configured — see HANDOFF.md.");
      return;
    }
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  return useMemo(
    () => ({
      user,
      exec,
      loading,
      isAuthorized: Boolean(user) && Boolean(exec),
      error,
      notice,
      signInWithGoogle,
      signInWithEmail,
      signOut,
    }),
    [user, exec, loading, error, notice, signInWithGoogle, signInWithEmail, signOut],
  );
}

/**
 * Owns the single auth listener for the whole app. Mounted once in
 * app/layout.tsx around everything that might call `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthState();
  return createElement(AuthContext.Provider, { value }, children);
}

/** Read the shared auth state. Must be rendered inside <AuthProvider>. */
export function useAuth(): UseAuthResult {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside <AuthProvider> (see app/layout.tsx).");
  }
  return ctx;
}

export { isFirebaseConfigured };
