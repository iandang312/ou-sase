"use client";

import { ButtonLink, Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/useAuth";

/**
 * Auth-aware corner of the nav. Single pill footprint in every state so the
 * nav never shifts: "Exec login" when signed out, "Admin" + "Sign out" when
 * signed in as an authorized exec, or nothing extra while loading / when
 * signed in but not authorized (that case is handled on /login itself).
 */
export function NavAuthSlot() {
  const { loading, isAuthorized, signOut } = useAuth();

  if (loading) {
    return <div className="h-11 w-[104px]" aria-hidden="true" />;
  }

  if (!isAuthorized) {
    return (
      <ButtonLink href="/login" variant="secondary" size="md">
        Exec login
      </ButtonLink>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <ButtonLink href="/admin" variant="secondary" size="md">
        Admin
      </ButtonLink>
      <Button variant="text" size="md" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
