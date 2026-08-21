import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { AdminContentShell } from "@/components/admin/content-shell";
import { SidebarProvider } from "@/components/admin/sidebar-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <AdminContentShell>
          <AdminHeader
            userEmail={session?.user?.email}
            userRole={session?.user?.role ?? ""}
          />
          <main className="p-4 lg:p-6">{children}</main>
        </AdminContentShell>
      </div>
    </SidebarProvider>
  );
}
