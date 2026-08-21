import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function AdminHomePage() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const [userCount, ticketCount, openTicketCount] = await Promise.all([
    prisma.user.count(),
    prisma.supportTicket.count(),
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin-login" });
          }}
        >
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-semibold">{userCount}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-muted-foreground">Total Tickets</p>
          <p className="text-2xl font-semibold">{ticketCount}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-muted-foreground">Open Tickets</p>
          <p className="text-2xl font-semibold">{openTicketCount}</p>
        </div>
      </div>

      <p className="mt-6">
        <a href="/admin/tickets" className="underline">
          Manage Support Tickets
        </a>
      </p>
    </div>
  );
}
