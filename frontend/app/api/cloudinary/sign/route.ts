import { v2 as cloudinary } from "cloudinary";
import { isAdminConfigured, verifyActiveExec } from "@/lib/firebaseAdmin";

/**
 * POST /api/cloudinary/sign
 *
 * Returns a signed Cloudinary upload signature so execs can upload member
 * photos and resumes without the Cloudinary API secret ever reaching the
 * browser. The client sends the params it intends to upload with, we sign
 * exactly those params server-side, and return the signature plus the
 * (non-secret) api_key and timestamp needed to complete the upload.
 *
 * AUTHORIZATION: the caller must send `Authorization: Bearer <firebase id
 * token>` and that token must belong to an ACTIVE exec. This is checked
 * server-side with the Admin SDK against the same `execs/{uid}.active`
 * condition that firestore.rules enforces — see lib/firebaseAdmin.ts.
 *
 * Without this check, the endpoint is an open upload gateway: anyone who
 * can reach the URL could obtain a valid signature and write to the
 * chapter's Cloudinary account.
 */

// Server-only env vars. Never prefix these with NEXT_PUBLIC_ — that prefix
// inlines a value into the browser bundle, which would defeat this route.
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** Params we are willing to sign. Anything else is dropped. */
const ALLOWED_PARAMS = new Set(["folder", "tags", "context"]);

/** The folders CloudinaryUploadField callers upload into. */
const ALLOWED_FOLDERS = new Set(["members", "resumes", "events", "sponsors"]);

export async function POST(request: Request) {
  // Fail closed if we cannot verify callers at all. Signing without being
  // able to check identity is exactly the hole this route exists to close,
  // so an unconfigured admin SDK must refuse rather than sign freely.
  if (!isAdminConfigured) {
    return Response.json(
      {
        error:
          "Server cannot verify who is uploading (Firebase Admin is not configured). " +
          "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY — see HANDOFF.md.",
      },
      { status: 503 },
    );
  }

  const exec = await verifyActiveExec(request.headers.get("authorization"));
  if (!exec) {
    // Deliberately vague: do not tell an anonymous caller whether the token
    // was malformed, expired, or simply belongs to a non-exec.
    return Response.json(
      { error: "Not authorized to upload." },
      { status: 401 },
    );
  }

  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
    return Response.json(
      {
        error:
          "Cloudinary is not configured on the server. Set CLOUDINARY_API_KEY, " +
          "CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME — see HANDOFF.md.",
      },
      { status: 503 },
    );
  }

  let requested: Record<string, unknown> = {};
  try {
    const body = await request.json();
    if (body && typeof body === "object" && typeof body.paramsToSign === "object" && body.paramsToSign) {
      requested = body.paramsToSign as Record<string, unknown>;
    }
  } catch {
    requested = {};
  }

  // A signed public_id lets the caller overwrite any existing asset, such as
  // another member's resume. Cloudinary assigns a random one when we omit it.
  if ("public_id" in requested) {
    return Response.json(
      { error: "public_id is chosen by Cloudinary, not the client." },
      { status: 400 },
    );
  }
  if ("folder" in requested && !ALLOWED_FOLDERS.has(requested.folder as string)) {
    return Response.json({ error: "Upload folder is not allowed." }, { status: 400 });
  }

  // Only sign a known set of params. A client that could get arbitrary params
  // signed could, for example, set an `invalidate` or overwrite behaviour we
  // did not intend.
  const paramsToSign: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(requested)) {
    if (ALLOWED_PARAMS.has(key) && value !== undefined && value !== null) {
      paramsToSign[key] = value;
    }
  }

  const timestamp = Math.round(Date.now() / 1000);

  try {
    const signature = cloudinary.utils.api_sign_request(
      { ...paramsToSign, timestamp },
      CLOUDINARY_API_SECRET,
    );

    return Response.json({
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      signedParams: paramsToSign,
    });
  } catch (err) {
    // The SDK's message can carry server config details; keep it in the logs.
    console.error("Cloudinary signing failed:", err);
    return Response.json(
      { error: "Failed to sign the Cloudinary upload request." },
      { status: 500 },
    );
  }
}
