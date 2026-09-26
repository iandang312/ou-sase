# HANDOFF — OU SASE Chapter Website

This document is written for a future SASE officer taking over this site who
did not build it and may not be a professional developer. Read it top to
bottom before you touch anything. Nothing here assumes prior experience with
Next.js, Firebase, or Cloudinary.

## 1. What this is, in five lines

- **Frontend**: a Next.js website (in the `frontend/` folder) — the public
  pages (home, recruitment, sponsors) and the exec admin pages.
- **Login & permissions**: Firebase Authentication (who can sign in) plus a
  Firestore database collection called `execs` (who, once signed in, is
  actually allowed to manage the site).
- **Data**: Firestore (a Google cloud database) stores members, sponsors,
  event photos, and the exec permission list.
- **Media**: Cloudinary stores and serves member photos and resumes (PDFs) —
  Firestore only stores a short reference ("public_id") to each file, not
  the file itself.
- **Design system**: `DESIGN.md` at the repo root documents the visual
  language (colors, type, spacing) used across the site.

## 2. Running it locally

1. Install [Node.js](https://nodejs.org/) (LTS version) if you don't have it.
2. Clone the repo and open a terminal in it.
3. `cd frontend`
4. `npm ci` (installs exact dependency versions from `package-lock.json`).
5. Copy the example environment file: `cp .env.example .env.local`
   (on Windows PowerShell: `Copy-Item .env.example .env.local`).
6. Fill in `.env.local` with real values — see section 3 below for where to
   get each one.
7. `npm run dev`
8. Open the URL it prints — usually `http://localhost:3000`, but if port
   3000 is already in use on your machine (e.g. another project is
   running), Next.js will automatically use `http://localhost:3001` instead
   and print that URL. This is normal, not a bug.

`.env.local` is listed in `.gitignore` — it will never be committed. That's
intentional: it holds real secrets.

## 3. Every environment variable

All of these live in `frontend/.env.local` (copied from `frontend/.env.example`).

| Variable | What it is | Where to find it | Secret? |
|---|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key | Firebase console → Project settings (gear icon) → General → "Your apps" → the web app → SDK setup and configuration | Public by design |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | Same screen as above | Public by design |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Same screen as above | Public by design |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket name | Same screen as above | Public by design |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID | Same screen as above | Public by design |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app ID | Same screen as above | Public by design |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary account's "cloud name" | Cloudinary console → Dashboard (top of page, "Cloud name") | Public by design |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Cloudinary console → Dashboard ("API Key") | **SECRET** |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Cloudinary console → Dashboard ("API Secret" — click "reveal") | **SECRET** |

**Why the `NEXT_PUBLIC_*` values being public is fine:** anything prefixed
`NEXT_PUBLIC_` gets bundled into the JavaScript that ships to every visitor's
browser — there is no way to keep it secret, and Firebase/Cloudinary are
designed around that. Firebase's real security boundary is `firestore.rules`
(see section 8), not hiding the API key. `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` (no `NEXT_PUBLIC_` prefix) are different: they are
only ever read on the server (in `frontend/app/api/cloudinary/sign/route.ts`)
and must never appear in a `NEXT_PUBLIC_` variable or in any file that gets
committed to git.

### Server-only Firebase Admin credentials

Three more variables let the server check that whoever is uploading a photo
or resume is genuinely a current officer:

| Variable | Where it comes from |
|---|---|
| `FIREBASE_PROJECT_ID` | the service account JSON |
| `FIREBASE_CLIENT_EMAIL` | the service account JSON |
| `FIREBASE_PRIVATE_KEY` | the service account JSON |

Firebase console -> gear -> **Project settings -> Service accounts ->
Generate new private key**. All three are SECRET and must never carry a
`NEXT_PUBLIC_` prefix, which would publish them to every visitor's browser.

`FIREBASE_PRIVATE_KEY` must be **one line, wrapped in double quotes, with
every newline written as the two characters backslash-n (`\n`)**. A real
line break there breaks parsing and uploads stop working with a confusing error.

### Do not use an unsigned Cloudinary upload preset

Uploads go through `/api/cloudinary/sign`, which refuses anyone who is not
an active exec. If a previous maintainer created an *unsigned* upload
preset, delete it in the Cloudinary console. An unsigned preset plus the
cloud name is enough for anyone to upload into your account, and both of
those values are readable in the browser bundle.

## 4. Bootstrapping the first exec (READ THIS — without it, nobody can log in)

Signing in with Firebase Auth only proves who someone is. It does **not**
make them an exec. Being an exec means having a document in the `execs`
Firestore collection with `active: true`. There is no exec yet on a brand
new project, and by design (see `firestore.rules`) only an existing exec can
create another exec's document through the website — so the very first one
has to be created outside the site.

### The easy way: the bootstrap script

From `frontend/`, with a service account key downloaded from the Firebase
console (**gear icon → Project settings → Service accounts → Generate new
private key**):

```
npm run bootstrap:exec -- --key C:\Users\you\sase-service-account.json --email you@ou.edu --name "Your Name"
```

If that email has never signed in before, add `--password "a-temp-password"`
and the account is created too. The script is safe to run twice — a second
run just re-activates that exec.

**Keep the service account key outside this repo.** It grants full admin
access to the Firebase project, and anyone who gets a copy owns your data.
The script refuses to run if the key sits inside the repo without being
gitignored, but do not rely on that — store it somewhere else entirely, and
never paste it into a chat or a commit.

### The manual way: the Firebase console

If you would rather not run a script, create the document by hand:

1. Have that person sign in through the site once (or via Firebase Auth) so
   a user account exists for them in Firebase.
2. In the Firebase console, go to **Build → Authentication → Users**. Find
   their row and copy the value in the **User UID** column.
3. Go to **Build → Firestore Database → Data**.
4. If there's no `execs` collection yet, create one (click "Start
   collection", name it exactly `execs`).
5. Add a new document. For the **Document ID**, paste in the UID you copied
   — do NOT let Firestore auto-generate an ID; the document ID must be the
   user's UID exactly.
6. Add these fields to the document (match `frontend/lib/types.ts`):
   - `email` (string) — their email
   - `displayName` (string, optional) — their name
   - `role` (string) — `"president"`, `"officer"`, or `"admin"`
   - `active` (boolean) — `true`
   - `addedAt` (string) — today's date, ISO format, e.g. `2026-09-23T00:00:00Z`
7. Save. That person can now sign in and use the admin pages, including
   adding future execs through the normal UI.

## 5. Adding and removing officers each year

- **Adding**: go to **/admin → Officers**, enter the email address the new
  officer will sign in with, pick a role, and send the invite. They do not
  need a Firebase account yet.

  How it works, so nothing here is mysterious: an `execs` document is keyed
  by Firebase user id, which does not exist until that person's first
  sign-in — so their record cannot be created in advance. The invite is
  keyed by *email* instead, and the first time they sign in with that exact
  address, the site swaps the invite for a real officer record automatically.

  The address must be **verified**: signing in with Google always is. A
  password account whose email has not been verified cannot claim an
  invite (the rules refuse it, and the login page says so) — otherwise
  anyone could register a password account for an officer's address before
  they do and take the invite. If the chapter never uses password sign-in,
  you can also turn off self sign-up in Firebase console → Authentication →
  Settings → User actions.

  **Only current officers can create invites.** That is the security
  property that makes this safe: if someone could write their own invite,
  they could make themselves an admin. The invitee also gets exactly the
  role they were invited with — they cannot upgrade themselves. Both of
  those are enforced in `firestore.rules`, not just in the UI.

  Invites that have not been claimed yet are listed on the same screen and
  can be cancelled.
- **Removing / graduating officers**: do **not** delete their `execs`
  document. Instead set `active` to `false` on it. This immediately revokes
  their admin access (the security rules check `active == true`), while
  keeping a historical record of who has held access and when. Deleting the
  document loses that history for no benefit.

## 6. THE ACCOUNT TRANSFER SECTION — moving to SASE's official accounts

Huy built this on his **personal** Firebase and Cloudinary accounts to get
it live quickly. At some point, ownership should move to accounts that
belong to the chapter, not to one person, so the site survives that person
graduating. **Strong recommendation: create one shared SASE chapter Google
account (e.g. a Google Group or a dedicated `sase.ou.officers@...`-style
login) and a matching shared Cloudinary account, rather than any individual
officer's personal login.** That way this transfer never has to happen
again — access moves by sharing chapter credentials/adding officers as
project members, not by migrating data every time a president changes.

Because every credential this app uses is an environment variable (see
section 3) and nothing is hardcoded in the source code, **this transfer
requires zero code changes.** It is entirely: create new accounts, copy
data over, update the env vars, redeploy.

Steps:

1. **Create the new Firebase project** under the chapter's Google account
   (console.firebase.google.com → Add project). Enable Authentication (the
   same sign-in method(s) currently used — e.g. Google/email) and enable
   Firestore in the same mode (Native mode).
2. **Export the data from the old Firestore project** and import it into
   the new one. The simplest path is the Firebase CLI:
   - `firebase login` (log in as whoever currently has access to the old
     project)
   - `firebase firestore:export gs://<a-storage-bucket-you-control>` — this
     needs a Cloud Storage bucket to export into. See Firebase's
     "Export and import data" docs under Firestore if this is unfamiliar;
     alternatively, for a small dataset like this one, it may be faster to
     just recreate the handful of `members`/`sponsors`/`eventPhotos`/`execs`
     documents by hand in the new project's console.
   - Import that export into the new project with
     `firebase firestore:import gs://<same-bucket>` after switching the CLI
     to the new project (`firebase use <new-project-id>`).
3. **Re-run the bootstrap step (section 4) on the new Firebase project** to
   create the first exec document — a fresh project has no execs yet.
4. **Deploy the security rules and indexes to the new project** (see
   section 8) — a new Firebase project starts with no custom rules and will
   deny everything until you do this.
5. **Create the new Cloudinary account** under the chapter's login
   (cloudinary.com). Do **not** create an unsigned upload preset — uploads
   are signed server-side by `/api/cloudinary/sign` (see section 3).
6. **Move the media**: download all images/PDFs from the old Cloudinary
   account (Cloudinary's Media Library lets you select-all and download, or
   use the Cloudinary CLI/API for bulk export) and re-upload them to the new
   account, ideally keeping the same folder structure (`members/`,
   `resumes/`, `sponsors/`, `events/` — the admin forms upload into those)
   and `public_id`s so
   the `photoPublicId`/`resumePublicId`/`logoPublicId` values already stored
   in Firestore keep working without editing every document. If the
   `public_id`s change, you'll need to update those fields in Firestore to
   match.
7. **Update environment variables** everywhere the app is deployed (see
   section 7 — typically your Vercel project settings) with the new
   project's values: all six `NEXT_PUBLIC_FIREBASE_*` values, the new
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`, and the three server-only `FIREBASE_PROJECT_ID`,
   `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` from the new project's
   service account (section 3). Also update your local
   `.env.local` if you develop locally.
8. **Redeploy** the site so it picks up the new env vars.
9. **Test end to end**: sign in as the bootstrapped exec, confirm the member
   list loads, confirm an image/resume renders, confirm the recruiter page
   only shows opted-in members.

**What breaks if you skip a step:**
- Skip the Firestore data export/import → the new site has no members,
  sponsors, or photos; it looks empty.
- Skip re-bootstrapping an exec on the new project → nobody can log in as
  admin on the new project, even if the old project's exec docs still work
  (they don't — new project, empty `execs` collection).
- Skip deploying `firestore.rules`/`firestore.indexes.json` to the new
  project → by default a new Firestore database denies all reads/writes,
  so the site will look completely broken (or, if you deploy in "test mode"
  instead, it will be wide open to the public — don't do that).
- Skip moving Cloudinary media (or change `public_id`s without updating
  Firestore) → photos and resumes will show broken images/links even though
  the rest of the site works.
- Forget to update even one env var in the deployment host → you'll get a
  confusing mix of old-project auth working with new-project data missing,
  or similar half-migrated symptoms. Update all of them together.

## 7. Deploying (Vercel)

Vercel is the natural host for a Next.js app like this one.

1. Go to vercel.com, sign in, and "Add New Project" → import this GitHub
   repository.
2. Set the **Root Directory** to `frontend` (the Next.js app lives there,
   not at the repo root).
3. In the project's **Settings → Environment Variables**, add every
   variable listed in section 3 with real values. Do this for each
   environment you use (Production, and Preview if you want previews to
   work too).
4. Deploy. Vercel will build and give you a live URL.
5. **Environment variables must be set in Vercel's project settings, never
   committed to the repo.** `.env.local` is gitignored specifically so this
   mistake doesn't happen — don't work around that by hardcoding values in
   source files.

## 8. Deploying the security rules and indexes

`firestore.rules` and `firestore.indexes.json` (at the repo root) are not
automatically applied — they only take effect once you deploy them with the
Firebase CLI:

1. Install the CLI if you don't have it: `npm install -g firebase-tools`
   (this is a one-time global install on your machine, unrelated to the
   project's own `npm ci`).
2. `firebase login`
3. From the **repo root** (not `frontend/`), run `firebase use --add` once
   to link this folder to your Firebase project, if it isn't linked yet.
4. Deploy the rules: `firebase deploy --only firestore:rules`
5. Deploy the indexes: `firebase deploy --only firestore:indexes`
   (or do both in one command: `firebase deploy --only firestore`)

Composite indexes can take a few minutes to build after deploying — the
Firebase console's Firestore → Indexes tab shows build progress. Until an
index finishes building, the query it supports will fail with an error
that includes a direct link to create it, which is a handy fallback if you
ever add a new filtered+sorted query that isn't in `firestore.indexes.json`
yet.

Only two composite indexes are needed right now, because most of the app's
queries either filter with no sort, or sort with no filter (Firestore
builds those automatically) — composite indexes are only required when a
query combines a `where` on one field with an `orderBy` on a *different*
field:
- `members`: `visibleToRecruiters == true` + order by `gradYear` (used by
  the public recruiter page).
- `sponsors`: `active == true` + order by `order` (used by the public
  sponsors page).

## 9. Where things live

- `frontend/app/` — the Next.js pages and routes:
  - `page.tsx` — the homepage
  - `sponsors/` — the public sponsors page
  - `recruitment/` — the public recruiter-facing member directory
  - `admin/` — exec-only management pages
  - `login/` — sign-in page
  - `api/cloudinary/sign/route.ts` — server endpoint that signs Cloudinary
    uploads (see the comment in that file about its current limitations)
- `frontend/components/` — shared UI building blocks used across pages.
- `frontend/lib/` — the app's core logic: `firebase.ts` (Firebase setup),
  `firestore.ts` (every database read/write goes through here — the source
  of truth for what queries exist), `types.ts` (the data model / schema —
  if a field isn't here, it doesn't exist as far as the app is concerned).
- `DESIGN.md` (repo root) — the design system: colors, typography, spacing,
  and visual conventions. Check this before making UI changes so new work
  matches the existing look.
- `firestore.rules` / `firestore.indexes.json` (repo root) — the security
  rules and database indexes covered in sections 4 and 8.
