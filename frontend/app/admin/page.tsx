import Link from "next/link";
import { Card } from "@/components/ui/Card";

const SECTIONS = [
  {
    href: "/admin/members",
    title: "Members",
    body: "Manage the member profile cards recruiters see, and who is visible.",
  },
  {
    href: "/admin/sponsors",
    title: "Sponsors",
    body: "Manage sponsor logos, tiers, and active status.",
  },
  {
    href: "/admin/photos",
    title: "Event photos",
    body: "Manage the tabletop hero photos on the home page.",
  },
  {
    href: "/admin/execs",
    title: "Officers",
    body: "Invite next year's exec board and revoke access when officers graduate.",
  },
] as const;

export default function AdminHomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {SECTIONS.map((section) => (
        <Link key={section.href} href={section.href}>
          <Card interactive className="h-full">
            <h2 className="font-display text-title-sm text-ink mb-2">{section.title}</h2>
            <p className="text-body-sm text-body">{section.body}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
