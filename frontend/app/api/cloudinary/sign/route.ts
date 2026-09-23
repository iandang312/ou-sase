import { v2 as cloudinary } from "cloudinary";

/**
 * POST /api/cloudinary/sign
 *
 * Returns a signed Cloudinary upload signature so execs can upload member
 * photos and resumes without the Cloudinary API secret ever reaching the
 * browser. The browser sends Cloudinary the params it plans to upload with
 * (e.g. { folder, public_id, timestamp }), we sign exactly those params on
 * the server with CLOUDINARY_API_SECRET, and hand back the signature plus
 * the (non-secret) api_key/timestamp the client needs to complete the
 * upload directly to Cloudinary.
 *
 * SECURITY GAP — please read before relying on this in production:
 * This route does NOT currently verify that the caller is a signed-in
 * exec. Anyone who can reach this URL can get a valid signature and upload
 * to this Cloudinary account. Tonight that's an accepted tradeoff to ship
 * something working; before handing this off, it should verify the caller
 * by checking a Firebase ID token sent from the client (e.g. an
 * `Authorization: Bearer <idToken>` header), verifying it server-side with
 * the Firebase Admin SDK (`getAuth().verifyIdToken(token)`), and then
 * confirming that uid has an active exec doc in Firestore (mirroring
 * isActiveExec() in firestore.rules) before signing anything. That needs a
 * Firebase Admin service account key, which is a separate secret from the
 * ones used here.
 */

// CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are server-only env vars.
// They must never be prefixed with NEXT_PUBLIC_ — that prefix ships a
// variable's value into the browser bundle. Keeping the secret out of the
// browser is the entire point of this route.
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export async function POST(request: Request) {
  // Degrade gracefully instead of throwing a 500 if Cloudinary isn't
  // configured yet (e.g. someone's running the app locally without a
  // filled-in .env.local). The upload UI can show this message instead of
  // a crash.
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

  let paramsToSign: Record<string, unknown>;
  try {
    const body = await request.json();
    paramsToSign =
      body && typeof body === "object" && body.paramsToSign
        ? body.paramsToSign
        : {};
  } catch {
    paramsToSign = {};
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
    });
  } catch (err) {
    return Response.json(
      {
        error:
          "Failed to sign the Cloudinary upload request. " +
          (err instanceof Error ? err.message : "Unknown error."),
      },
      { status: 400 },
    );
  }
}
