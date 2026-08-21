import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { TicketStatusSelect } from "./ticket-row";

export default async function AdminTicketsPage() {
  await requireRole(["ADMIN", "MODERATOR"]);
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { include: { alumniProfile: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Support Tickets</h1>

      <div className="mt-6 flex flex-col gap-3">
        {tickets.length === 0 && (
          <p className="text-sm text-muted-foreground">No tickets yet.</p>
        )}
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{ticket.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {ticket.user.alumniProfile?.fullName ?? ticket.user.phone} &middot;{" "}
                  {ticket.user.phone}
                </p>
              </div>
              <TicketStatusSelect ticketId={ticket.id} status={ticket.status} />
            </div>
            <p className="mt-2 text-sm">{ticket.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
