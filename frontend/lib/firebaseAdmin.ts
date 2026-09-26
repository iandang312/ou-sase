import "server-only";

/**
 * Firebase Admin SDK — SERVER ONLY.
 *
 * The `server-only` import above is deliberate: if any client component ever
 * imports this file, the build fails loudly instead of quietly shipping a
 * service-account private key into the browser bundle.
 *
 * Credentials come from three env vars rather than a JSON file path, because
 * a hosted deployment (Vercel) has env vars but no file to point at:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY     <- the whole PEM, newlines escaped as \n
 * All three are SECRET. None may be prefixed NEXT_PUBLIC_.
 */
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Env vars cannot hold real newlines, so the key is stored with literal "\n"
// sequences and unescaped here. Without this the PEM fails to parse.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isAdminConfigured = Boolean(projectId && clientEmail && privateKey);

let app: App | null = null;

function adminApp(): App {
  if (!isAdminConfigured) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY — see HANDOFF.md.",
    );
  }
  if (app) return app;
  app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: projectId!,
          clientEmail: clientEmail!,
          privateKey: privateKey!,
        }),
      });
  return app;
}

export interface VerifiedExec {
  uid: string;
  email: string | null;
  role: string;
}

/**
 * Verify a Firebase ID token and confirm the caller is an ACTIVE exec.
 *
 * This is the server-side mirror of `isActiveExec()` in firestore.rules.
 * Returns null for anything that fails — an invalid/expired token, a valid
 * token belonging to someone with no exec record, or a revoked exec. Callers
 * must treat null as "deny", never as "probably fine".
 */
export async function verifyActiveExec(
  authorizationHeader: string | null,
): Promise<VerifiedExec | null> {
  if (!authorizationHeader?.startsWith("Bearer ")) return null;
  const idToken = authorizationHeader.slice("Bearer ".length).trim();
  if (!idToken) return null;

  try {
    const auth = getAuth(adminApp());
    // checkRevoked: a signed-out or disabled account must stop working
    // immediately, not when the token would naturally expire an hour later.
    const decoded = await auth.verifyIdToken(idToken, true);

    const snap = await getFirestore(adminApp())
      .collection("execs")
      .doc(decoded.uid)
      .get();

    if (!snap.exists) {
      console.warn(`[verifyActiveExec] denied: no execs/${decoded.uid} document.`);
      return null;
    }
    const data = snap.data();
    if (!data || data.active !== true) {
      console.warn(`[verifyActiveExec] denied: execs/${decoded.uid} is not active.`);
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      role: typeof data.role === "string" ? data.role : "officer",
    };
  } catch (err) {
    // Bad signature, expired, revoked, wrong project, Firestore unreachable,
    // a mangled FIREBASE_PRIVATE_KEY — all of it fails closed. Log the reason
    // (never the token) so a misconfigured Admin SDK is distinguishable from
    // a genuine non-exec in the server logs.
    console.warn("[verifyActiveExec] denied:", describeError(err, idToken));
    return null;
  }
}

/** Error code + message for logs, with the token redacted if it was echoed. */
function describeError(err: unknown, secret?: string): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? `${String((err as { code: unknown }).code)}: `
      : "";
  const message = err instanceof Error ? err.message : String(err);
  const text = `${code}${message}`;
  return secret ? text.split(secret).join("[redacted token]") : text;
}
