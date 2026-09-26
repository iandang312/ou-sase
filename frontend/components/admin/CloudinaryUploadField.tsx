"use client";

/**
 * Upload field for a Cloudinary `public_id`.
 *
 * Uploads are SIGNED: the browser asks /api/cloudinary/sign for a signature,
 * sending the current user's Firebase ID token, and that route refuses unless
 * the token belongs to an active exec. The Cloudinary API secret stays on the
 * server the whole time.
 *
 * This deliberately does NOT use an unsigned upload preset. An unsigned preset
 * plus the cloud name is all anyone needs to upload into the account, and both
 * of those values are visible in the browser bundle — which makes an unsigned
 * preset a public write endpoint for the chapter's media library.
 *
 * If Cloudinary or the server verifier isn't configured, this degrades to a
 * plain text field so an admin can paste a public_id by hand and the form
 * still works.
 */
import { useState } from "react";
import { auth } from "@/lib/firebase";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function CloudinaryUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  folder,
}: {
  label: string;
  value?: string;
  onChange: (publicId: string | undefined) => void;
  accept?: string;
  /** Cloudinary folder, e.g. "members" or "events". Keeps the library tidy. */
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const user = auth?.currentUser;
      if (!user) throw new Error("You are signed out — sign in again to upload.");

      // Fresh token: an hour-old one may have expired mid-session.
      const idToken = await user.getIdToken();

      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          paramsToSign: folder ? { folder } : {},
        }),
      });

      if (!signRes.ok) {
        const payload = (await signRes.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          payload?.error ?? `Could not authorize the upload (${signRes.status}).`,
        );
      }

      const { signature, timestamp, apiKey, cloudName, signedParams } =
        (await signRes.json()) as {
          signature: string;
          timestamp: number;
          apiKey: string;
          cloudName: string;
          signedParams?: Record<string, string>;
        };

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", apiKey);
      body.append("timestamp", String(timestamp));
      body.append("signature", signature);
      // Every signed param must be sent back verbatim or Cloudinary rejects
      // the signature as a mismatch.
      for (const [key, val] of Object.entries(signedParams ?? {})) {
        body.append(key, String(val));
      }

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body },
      );
      if (!res.ok) {
        const detail = (await res.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(
          detail?.error?.message ?? `Cloudinary rejected the upload (${res.status}).`,
        );
      }

      const data = (await res.json()) as { public_id?: string };
      if (!data.public_id) throw new Error("Upload response missing public_id.");
      onChange(data.public_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const canUpload = Boolean(CLOUD_NAME) && !manual;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption-strong text-ink">{label}</span>

      {canUpload ? (
        <>
          <input
            type="file"
            accept={accept}
            disabled={uploading}
            aria-label={`Upload ${label}`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="text-body-sm"
          />
          {value ? (
            <p className="text-caption text-muted">
              Current: {value}{" "}
              <button
                type="button"
                className="text-negative underline"
                onClick={() => onChange(undefined)}
              >
                clear
              </button>
            </p>
          ) : null}
          {uploading ? (
            <p className="text-caption text-muted">Uploading…</p>
          ) : null}
          {error ? <p className="text-negative text-caption">{error}</p> : null}
          <button
            type="button"
            className="text-caption text-muted self-start underline"
            onClick={() => setManual(true)}
          >
            Enter a public_id manually instead
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Cloudinary public_id"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || undefined)}
            aria-label={`${label} Cloudinary public_id`}
            className="border-hairline text-body-md rounded-md border px-3 py-2"
          />
          <p className="text-caption text-muted">
            {CLOUD_NAME
              ? "Paste a Cloudinary public_id."
              : "Cloudinary is not configured — paste a public_id directly."}
          </p>
        </>
      )}
    </div>
  );
}
