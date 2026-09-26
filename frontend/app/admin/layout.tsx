import { AdminGate } from "@/components/admin/AdminGate";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminGate>{children}</AdminGate>;
}
