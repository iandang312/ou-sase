#!/usr/bin/env node
/**
 * Create the FIRST exec (admin) account for the OU SASE site.
 *
 * WHY THIS EXISTS
 * firestore.rules says only an existing active exec may create an exec
 * document — that is deliberate, because otherwise anyone who signed in with
 * any Google account could grant themselves admin over the whole site. But it
 * means the very first exec cannot be made through the website. This script
 * is the way in: it uses the Firebase Admin SDK, which runs with server
 * credentials and legitimately bypasses security rules.
 *
 * You should need this ONCE, ever. After the first exec exists, every other
 * officer gets added through the admin UI at /admin.
 *
 * USAGE
 *   node scripts/bootstrap-exec.mjs --key <path-to-service-account.json> \
 *        --email you@ou.edu [--password "temp-password"] \
 *        [--name "Your Name"] [--role president]
 *
 * If the Firebase Auth user already exists (because you signed in at /login
 * once), omit --password and it will just be promoted. If it does not exist
 * yet, pass --password and the account is created for you.
 *
 * The script is idempotent: running it again on the same email re-activates
 * that exec rather than erroring.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";
import { execFileSync } from "node:child_process";

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/* -------------------------------------------------------------------------- */
/* args                                                                        */
/* -------------------------------------------------------------------------- */

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    // Collect every token up to the next --flag, not just one. npm strips the
    // quotes from `--name "Huy Nguyen"`, so a single-token read would silently
    // store "Huy" and drop the surname.
    const words = [];
    while (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
      words.push(argv[i + 1]);
      i += 1;
    }
    out[key] = words.length === 0 ? true : words.join(" ");
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

function die(message, hint) {
  console.error(`\n  ERROR: ${message}`);
  if (hint) console.error(`  ${hint}`);
  console.error("");
  process.exit(1);
}

const keyPath = args.key ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
const email = args.email;
const password = typeof args.password === "string" ? args.password : null;
const displayName = typeof args.name === "string" ? args.name : undefined;
const role = typeof args.role === "string" ? args.role : "president";

if (!keyPath || typeof keyPath !== "string") {
  die(
    "Missing --key <path-to-service-account.json>.",
    "Firebase console -> gear icon -> Project settings -> Service accounts -> Generate new private key.",
  );
}
if (!email || typeof email !== "string") {
  die("Missing --email <your email>.");
}
if (!["president", "officer", "admin"].includes(role)) {
  die(`--role must be one of: president, officer, admin (got "${role}").`);
}

const absKey = resolve(process.cwd(), keyPath);
if (!existsSync(absKey)) {
  die(`No service account key at ${absKey}`);
}

/* -------------------------------------------------------------------------- */
/* safety: a service account key is a master credential — never commit it      */
/* -------------------------------------------------------------------------- */

const repoRoot = resolve(process.cwd(), "..");
const rel = relative(repoRoot, absKey);
const insideRepo = !rel.startsWith("..") && !isAbsolute(rel);

if (insideRepo) {
  let ignored = false;
  try {
    execFileSync("git", ["check-ignore", "-q", absKey], { cwd: repoRoot });
    ignored = true;
  } catch {
    ignored = false;
  }
  if (!ignored) {
    die(
      `That service account key is inside the repo and is NOT gitignored:\n    ${absKey}`,
      "A leaked key gives full admin access to your Firebase project.\n" +
        "  Move it outside the repo (e.g. C:\\Users\\Huy\\sase-service-account.json) and re-run.",
    );
  }
}

/* -------------------------------------------------------------------------- */
/* run                                                                         */
/* -------------------------------------------------------------------------- */

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(absKey, "utf8"));
} catch (err) {
  die(`Could not read that key as JSON: ${err.message}`);
}

if (!serviceAccount.project_id) {
  die("That JSON does not look like a Firebase service account key (no project_id).");
}

console.log(`\n  Project : ${serviceAccount.project_id}`);
console.log(`  Email   : ${email}`);
console.log(`  Role    : ${role}\n`);

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();
const db = getFirestore();

let user;
try {
  user = await auth.getUserByEmail(email);
  console.log(`  Found existing Firebase Auth user: ${user.uid}`);
} catch (err) {
  if (err.code !== "auth/user-not-found") {
    die(`Firebase Auth lookup failed: ${err.message}`);
  }
  if (!password) {
    // No account yet and no password given. Rather than failing, leave an
    // invite: an exec document is keyed by uid, which does not exist until
    // the first sign-in, but an invite is keyed by email and is claimed
    // automatically the moment they sign in. Same end state, one less step,
    // and it avoids creating a password account that would then collide with
    // Google sign-in on the same address.
    const key = email.trim().toLowerCase();
    await db
      .collection("execInvites")
      .doc(key)
      .set({
        email: key,
        role,
        invitedBy: "bootstrap-script",
        invitedAt: new Date().toISOString(),
      });
    console.log(`  No Firebase Auth user exists for ${email} yet.`);
    console.log(`  Created an invite instead: execInvites/${key} (role: ${role}).`);
    console.log(
      `\n  Next: sign in at /login as ${email} (Google sign-in works).\n` +
        "  The invite is claimed automatically on that first sign-in and you\n" +
        "  will land in /admin as an officer. Nothing else to run.\n",
    );
    process.exit(0);
  }
  user = await auth.createUser({ email, password, displayName });
  console.log(`  Created Firebase Auth user: ${user.uid}`);
}

const ref = db.collection("execs").doc(user.uid);
const existing = await ref.get();

const now = new Date().toISOString();
const payload = {
  email,
  role,
  active: true,
  ...(displayName ?? user.displayName
    ? { displayName: displayName ?? user.displayName }
    : {}),
  ...(existing.exists ? {} : { addedAt: now, addedBy: "bootstrap-script" }),
};

await ref.set(payload, { merge: true });

console.log(
  existing.exists
    ? `  Updated execs/${user.uid} (re-activated).`
    : `  Created execs/${user.uid}.`,
);
console.log(`\n  Done. Sign in at /login as ${email} and you will have /admin access.\n`);

process.exit(0);
