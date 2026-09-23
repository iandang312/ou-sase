"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Two-step delete: first click arms it, second click (within the same
 * render) actually fires `onConfirm`. Clicking elsewhere doesn't reset it
 * automatically, but the button visibly changes to "Confirm delete?" so a
 * misclick is never silent.
 */
export function ConfirmButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "Confirm delete?",
  className,
}: {
  onConfirm: () => void | Promise<void>;
  label?: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!armed) {
    return (
      <Button
        variant="text"
        className={`text-negative ${className ?? ""}`}
        onClick={() => setArmed(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        variant="text"
        className="text-negative"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setArmed(false);
          }
        }}
      >
        {busy ? "Deleting…" : confirmLabel}
      </Button>
      <Button variant="text" onClick={() => setArmed(false)} disabled={busy}>
        Cancel
      </Button>
    </span>
  );
}
