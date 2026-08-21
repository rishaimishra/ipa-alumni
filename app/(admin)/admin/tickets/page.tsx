import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/admin/badge";
import { TicketStatusSelect } from "./ticket-row";

const STATUS_COLOR: Record<string, "warning" | "primary" | "success" | "light"> = {
  OPEN: "warning",
  IN_PROGRESS: "primary",
  RESOLVED: "success",
  CLOSED: "light",
};

export default async function AdminTicketsPage() {
  await requireRole(["ADMIN", "MODERATOR"]);
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { include: { alumniProfile: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
        Support Tickets
      </h1>

      <div className="flex flex-col gap-4">
        {tickets.length === 0 && (
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            No tickets yet.
          </p>
        )}
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {ticket.subject}
                  </p>
                  <Badge color={STATUS_COLOR[ticket.status] ?? "light"}>
                    {ticket.status}
                  </Badge>
                </div>
                <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                  {ticket.user.alumniProfile?.fullName ?? ticket.user.phone} &middot;{" "}
                  {ticket.user.phone}
                </p>
              </div>
              <TicketStatusSelect ticketId={ticket.id} status={ticket.status} />
            </div>
            <p className="mt-3 text-theme-sm text-gray-600 dark:text-gray-300">
              {ticket.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
