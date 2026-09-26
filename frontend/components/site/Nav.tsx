"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Container } from "@/components/ui/Layout";
import { NavAuthSlot } from "./NavAuthSlot";
import { NAV_LINKS } from "./nav-links";

/** Animated hamburger <-> close glyph. Pure CSS transform, no icon deps. */
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-4 w-5 flex-col justify-between"
    >
      <span
        className={`bg-ink block h-[2px] w-full origin-center rounded-full transition-transform duration-200 ease-out ${
          open ? "translate-y-[7px] rotate-45" : ""
        }`}
      />
      <span
        className={`bg-ink block h-[2px] w-full rounded-full transition-opacity duration-150 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`bg-ink block h-[2px] w-full origin-center rounded-full transition-transform duration-200 ease-out ${
          open ? "-translate-y-[7px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on route change. Derived-state pattern (render-phase update via
  // useState, not a ref) so there's no cascading setState-in-effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  // Close on Escape, return focus to the toggle.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Close on outside click/tap.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        drawerRef.current?.contains(target) ||
        toggleRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Lock body scroll and trap focus inside the drawer while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = drawerRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusable?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="border-hairline bg-canvas/90 sticky top-0 z-50 border-b backdrop-blur-sm">
      <Container>
        <nav
          aria-label="Primary"
          className="flex h-16 items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="text-title-md text-ink group flex items-center gap-2 font-semibold"
          >
            <span
              aria-hidden="true"
              className="bg-brand ring-brand-ink/20 h-6 w-6 rounded-md ring-1 ring-inset transition-transform duration-200 group-hover:rotate-[8deg]"
            />
            <span>
              OU <span className="text-brand-ink">SASE</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-nav-link relative py-1 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-ink after:transition-transform after:duration-200 hover:text-ink hover:after:scale-x-100 ${
                      active ? "text-ink after:scale-x-100" : "text-body"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <NavAuthSlot />
            </div>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={drawerId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="border-hairline hover:bg-surface-soft flex h-11 w-11 items-center justify-center rounded-md border md:hidden"
            >
              <MenuGlyph open={open} />
            </button>
          </div>
        </nav>
      </Container>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] transition-opacity duration-200 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        id={drawerId}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`border-hairline bg-canvas fixed inset-x-0 top-16 z-40 origin-top border-b shadow-lg transition-[transform,opacity] duration-200 ease-out md:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <Container>
          <ul className="flex flex-col py-4">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-nav-link flex min-h-11 items-center rounded-md px-2 text-lg ${
                      active ? "text-ink bg-pastel-blue-soft" : "text-body"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-hairline-soft flex items-center border-t py-4">
            <NavAuthSlot />
          </div>
        </Container>
      </div>
    </header>
  );
}
