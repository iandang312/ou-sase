"use client";

/**
 * Upload field for a Cloudinary `public_id`.
 *
 * When NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * are set, this uploads directly to Cloudinary's unsigned-upload endpoint from
 * the browser (no signed route needed — that's a separate workstream building
 * app/api/cloudinary/sign, which this does NOT use). When either env var is
 * missing, it degrades to a plain text field so admins can paste a public_id
 * by hand and the form still works tonight.
 */
import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_ENABLED = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export function CloudinaryUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
}: {
  label: string;
  value?: string;
  onChange: (publicId: string | undefined) => void;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET as string);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: "POST", body },
      );
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = (await res.json()) as { public_id?: string };
      if (!data.public_id) throw new Error("Upload response missing public_id");
      onChange(data.public_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption-strong text-ink">{label}</span>
      {UPLOAD_ENABLED ? (
        <>
          <input
            type="file"
            accept={accept}
            disabled={uploading}
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
          {uploading ? <p className="text-caption text-muted">Uploading…</p> : null}
          {error ? <p className="text-negative text-caption">{error}</p> : null}
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Cloudinary public_id (upload not configured)"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || undefined)}
            className="border-hairline rounded-md border px-3 py-2 text-body-md"
          />
          <p className="text-caption text-muted">
            Upload preset not configured — paste a Cloudinary public_id directly.
          </p>
        </>
      )}
    </div>
  );
}
