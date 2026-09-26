"use client";

/**
 * Small, calm feedback strip for save/delete outcomes across admin managers.
 * Nothing in these managers should succeed or fail silently, so every
 * mutating action renders one of these instead of just clearing state.
 */
export function SaveStatus({
  state,
  savedLabel = "Saved.",
  errorText,
}: {
  state: "idle" | "saving" | "saved" | "error";
  savedLabel?: string;
  errorText?: string | null;
}) {
  if (state === "idle") return null;

  if (state === "saving") {
    return (
      <p className="text-body-sm text-muted flex items-center gap-2" role="status">
        <span
          aria-hidden
          className="border-hairline h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-brand-ink"
        />
        Saving…
      </p>
    );
  }

  if (state === "saved") {
    return (
      <p
        className="bg-positive-soft text-positive text-body-sm rounded-md px-3 py-2 font-medium"
        role="status"
      >
        {savedLabel}
      </p>
    );
  }

  return (
    <p
      className="bg-negative-soft text-negative text-body-sm rounded-md px-3 py-2 font-medium"
      role="alert"
    >
      {errorText ?? "Something went wrong. Please try again."}
    </p>
  );
}
