/**
 * Typed Firestore access. Every read/write goes through here.
 *
 * Why a module instead of calling Firestore inline in components:
 * - one place to keep collection names and shapes honest against lib/types.ts
 * - one place where "Firebase isn't configured yet" degrades to empty data
 *   instead of throwing, so the public pages still render tonight
 */
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  COLLECTIONS,
  type EventPhoto,
  type Exec,
  type ExecInvite,
  type ExecRole,
  type Member,
  type Sponsor,
} from "./types";

function rowsOf<T>(snap: { docs: QueryDocumentSnapshot[] }): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

/**
 * Wraps a public read so that a Firestore failure degrades to "no data"
 * instead of taking the page down.
 *
 * The public pages (home, sponsors, recruitment) are marketing surfaces and
 * must render even when Firestore is unreachable, the security rules have not
 * been deployed yet, or the database is empty. Without this, a
 * `permission-denied` turns the whole site into a 500 — which is exactly what
 * happened the first time real Firebase credentials were added before the
 * rules were published.
 *
 * Admin WRITES deliberately do NOT use this: there, a silent failure would
 * let an exec think they saved something they did not.
 */
async function safeRead<T>(label: string, run: () => Promise<T[]>): Promise<T[]> {
  try {
    return await run();
  } catch (err) {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code: unknown }).code)
        : "unknown";
    console.warn(
      `[firestore] ${label} failed (${code}) — rendering without this data. ` +
        `If this is "permission-denied", deploy firestore.rules; see HANDOFF.md section 8.`,
    );
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Reads (public pages)                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Members who have consented to appear on the recruiter-facing page.
 * The `visibleToRecruiters` filter is duplicated in firestore.rules — this
 * one is for correctness, that one is for security. Keep both.
 */
export async function listVisibleMembers(): Promise<Member[]> {
  if (!db) return [];
  const database = db;
  return safeRead("listVisibleMembers", async () => {
    const snap = await getDocs(
      query(
        collection(database, COLLECTIONS.members),
        where("visibleToRecruiters", "==", true),
        orderBy("gradYear", "asc"),
      ),
    );
    return rowsOf<Member>(snap);
  });
}

/** All members, including hidden ones. Admin surfaces only. */
export async function listAllMembers(): Promise<Member[]> {
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.members), orderBy("lastName", "asc")),
  );
  return rowsOf<Member>(snap);
}

export async function listSponsors(activeOnly = true): Promise<Sponsor[]> {
  if (!db) return [];
  const database = db;
  return safeRead("listSponsors", async () => {
    const base = collection(database, COLLECTIONS.sponsors);
    const snap = await getDocs(
      activeOnly
        ? query(base, where("active", "==", true), orderBy("order", "asc"))
        : query(base, orderBy("order", "asc")),
    );
    return rowsOf<Sponsor>(snap);
  });
}

export async function listEventPhotos(): Promise<EventPhoto[]> {
  if (!db) return [];
  const database = db;
  return safeRead("listEventPhotos", async () => {
    const snap = await getDocs(
      query(collection(database, COLLECTIONS.eventPhotos), orderBy("order", "asc")),
    );
    return rowsOf<EventPhoto>(snap);
  });
}

/* -------------------------------------------------------------------------- */
/* Authorization                                                               */
/* -------------------------------------------------------------------------- */

/**
 * An exec doc existing AND being active is what grants admin rights.
 * Mirrors firestore.rules — never grant access from a client-side value alone.
 */
export async function getExec(uid: string): Promise<Exec | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, COLLECTIONS.execs, uid));
  if (!snap.exists()) return null;
  const exec = { id: snap.id, ...snap.data() } as Exec;
  return exec.active ? exec : null;
}

/** Every exec, active or revoked. Admin surface only. */
export async function listExecs(): Promise<Exec[]> {
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.execs), orderBy("email", "asc")),
  );
  return rowsOf<Exec>(snap);
}

export async function listExecInvites(): Promise<ExecInvite[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, COLLECTIONS.execInvites));
  return rowsOf<ExecInvite>(snap);
}

/** Invites are keyed by lowercased email so lookups are case-insensitive. */
export function inviteKey(email: string): string {
  return email.trim().toLowerCase();
}

export async function inviteExec(
  email: string,
  role: ExecRole,
  invitedBy: string,
): Promise<void> {
  const key = inviteKey(email);
  await setDoc(doc(requireDbOrThrow(), COLLECTIONS.execInvites, key), {
    email: key,
    role,
    invitedBy,
    invitedAt: new Date().toISOString(),
  });
}

export async function revokeInvite(email: string): Promise<void> {
  await deleteDoc(
    doc(requireDbOrThrow(), COLLECTIONS.execInvites, inviteKey(email)),
  );
}

/**
 * Turn an outstanding invite into a real exec record for the signed-in user.
 *
 * Called right after sign-in when the user has no exec document yet. Returns
 * the new Exec, or null when there is no invite for them (the normal case for
 * a random visitor — which must stay a quiet "not authorized", not an error).
 *
 * The role comes from the INVITE, never from the caller, so an invitee cannot
 * hand themselves a higher role than they were offered. firestore.rules
 * enforces the same thing server-side; this is just the client half.
 */
export async function claimExecInvite(
  uid: string,
  email: string | null,
  displayName?: string | null,
): Promise<Exec | null> {
  if (!db || !email) return null;
  const key = inviteKey(email);
  const inviteRef = doc(db, COLLECTIONS.execInvites, key);

  let invite: ExecInvite;
  try {
    const snap = await getDoc(inviteRef);
    if (!snap.exists()) {
      // The invite may be gone because it was JUST claimed — by this user in
      // another tab, or by a concurrent sign-in. Re-read our own exec doc
      // before concluding "not invited", so that race never shows up as
      // "not authorized".
      return await getExec(uid);
    }
    invite = { id: snap.id, ...snap.data() } as ExecInvite;
  } catch {
    // No invite readable for this account — not an error, just not invited.
    return null;
  }

  const record = {
    email: key,
    role: invite.role,
    active: true,
    addedAt: new Date().toISOString(),
    addedBy: invite.invitedBy,
    ...(displayName ? { displayName } : {}),
  };

  await setDoc(doc(db, COLLECTIONS.execs, uid), record);
  // Best effort: the invite has been used. Failing to clean it up must not
  // block the officer from getting in.
  try {
    await deleteDoc(inviteRef);
  } catch {
    /* ignore */
  }
  return { id: uid, ...record } as Exec;
}

/** Revoke by deactivating, not deleting — keeps the history of who served. */
export async function setExecActive(uid: string, active: boolean): Promise<void> {
  await updateDoc(doc(requireDbOrThrow(), COLLECTIONS.execs, uid), { active });
}

export async function setExecRole(uid: string, role: ExecRole): Promise<void> {
  await updateDoc(doc(requireDbOrThrow(), COLLECTIONS.execs, uid), { role });
}

/* -------------------------------------------------------------------------- */
/* Writes (admin only — enforced by firestore.rules, not by this file)         */
/* -------------------------------------------------------------------------- */

type NewMember = Omit<Member, "id" | "createdAt" | "updatedAt">;

export async function createMember(data: NewMember): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(requireDbOrThrow(), COLLECTIONS.members), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

/**
 * Turn `undefined` values into `deleteField()` for an `updateDoc` patch.
 *
 * `ignoreUndefinedProperties` (lib/firebase.ts) makes undefined keys vanish
 * from a write, which for an UPDATE means "leave the old value" — so clearing
 * a photo or résumé in the admin form would silently keep it. An explicit
 * delete makes "clear" actually clear.
 */
export function undefinedToDeleteField<T extends object>(patch: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(patch).map(([k, v]) => [k, v === undefined ? deleteField() : v]),
  );
}

export async function updateMember(
  id: string,
  patch: Partial<NewMember>,
): Promise<void> {
  await updateDoc(doc(requireDbOrThrow(), COLLECTIONS.members, id), {
    ...undefinedToDeleteField(patch),
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(requireDbOrThrow(), COLLECTIONS.members, id));
}

/*
 * upsertSponsor / upsertEventPhoto REPLACE the whole document (no
 * `merge: true`). The admin draft is always the complete document, and a full
 * replace is what lets "clear" (an undefined key, dropped by
 * ignoreUndefinedProperties) actually remove the old value.
 */
export async function upsertSponsor(
  sponsor: Omit<Sponsor, "id"> & { id?: string },
): Promise<string> {
  const database = requireDbOrThrow();
  const { id, ...data } = sponsor;
  if (id) {
    await setDoc(doc(database, COLLECTIONS.sponsors, id), data);
    return id;
  }
  const ref = await addDoc(collection(database, COLLECTIONS.sponsors), data);
  return ref.id;
}

export async function deleteSponsor(id: string): Promise<void> {
  await deleteDoc(doc(requireDbOrThrow(), COLLECTIONS.sponsors, id));
}

export async function upsertEventPhoto(
  photo: Omit<EventPhoto, "id"> & { id?: string },
): Promise<string> {
  const database = requireDbOrThrow();
  const { id, ...data } = photo;
  if (id) {
    await setDoc(doc(database, COLLECTIONS.eventPhotos, id), data);
    return id;
  }
  const ref = await addDoc(collection(database, COLLECTIONS.eventPhotos), data);
  return ref.id;
}

export async function deleteEventPhoto(id: string): Promise<void> {
  await deleteDoc(doc(requireDbOrThrow(), COLLECTIONS.eventPhotos, id));
}

function requireDbOrThrow() {
  if (!db) {
    throw new Error(
      "Firestore is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local — see HANDOFF.md.",
    );
  }
  return db;
}
