/**
 * Firebase client initialisation.
 *
 * ACCOUNT PORTABILITY: every value here comes from an env var. Nothing about
 * Huy's personal Google account is hardcoded. To hand the site to SASE's
 * official account later, you create a new Firebase project, paste its config
 * into the deployment's env vars, and redeploy. No code change. See HANDOFF.md.
 */
import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * True when the env vars are actually filled in. The site must RENDER without
 * Firebase configured — a missing key should degrade the admin surface, not
 * white-screen the public marketing pages.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

// Next's dev server re-executes modules on hot reload; initializeApp twice throws.
const app = getApps().length ? getApp() : isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const firebaseApp = app;
export const auth: Auth | null = app ? getAuth(app) : null;
/**
 * `ignoreUndefinedProperties`: the admin drafts carry optional fields as
 * `undefined` (no photo yet, no "since" year, a cleared upload). With the
 * default settings the Web SDK REJECTS any write containing `undefined`
 * ("Unsupported field value: undefined"), so saving a member without a photo
 * would fail. With this on, undefined keys are simply left out of the write.
 * Clearing a field on an existing doc is handled in lib/firestore.ts.
 */
function createDb(firebase: NonNullable<typeof app>): Firestore {
  try {
    // Returns the existing instance when called again with identical
    // settings, so Next's hot reload is fine.
    return initializeFirestore(firebase, { ignoreUndefinedProperties: true });
  } catch {
    // Already initialised by an earlier module instance (HMR edge case).
    return getFirestore(firebase);
  }
}

export const db: Firestore | null = app ? createDb(app) : null;

/** Throwing accessor for code paths that genuinely cannot proceed without it. */
export function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      "Firestore is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local — see HANDOFF.md.",
    );
  }
  return db;
}

export function requireAuth(): Auth {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local — see HANDOFF.md.",
    );
  }
  return auth;
}
