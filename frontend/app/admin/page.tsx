import Link from "next/link";
import { Card } from "@/components/ui/Card";

const SECTIONS = [
  {
    href: "/admin/members",
    title: "Members",
    body: "Manage the member profile cards recruiters see, and who is visible.",
    note: "Controls who appears on the public recruitment page.",
  },
  {
    href: "/admin/sponsors",
    title: "Sponsors",
    body: "Manage sponsor logos, tiers, and active status.",
    note: "Shown on the public sponsors page.",
  },
  {
    href: "/admin/photos",
    title: "Event photos",
    body: "Manage the tabletop hero photos on the home page.",
    note: "Shown on the public home page.",
  },
  {
    href: "/admin/execs",
    title: "Officers",
    body: "Invite next year's exec board and revoke access when officers graduate.",
    note: "Access control — changes take effect immediately.",
  },
] as const;

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-title-lg text-ink">Overview</h1>
        <p className="text-body-sm text-body mt-1 max-w-[62ch]">
          Pick a section below. Each one manages content officers hand off year to year — take a
          look at Members first if you&apos;re new, since it controls what recruiters see.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card interactive className="flex h-full flex-col gap-2">
              <h2 className="font-display text-title-sm text-ink">{section.title}</h2>
              <p className="text-body-sm text-body flex-1">{section.body}</p>
              <p className="text-caption text-muted">{section.note}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
