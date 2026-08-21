import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { TicketForm } from "./ticket-form";

export default async function SupportPage() {
  const user = await requireUser();
  const tickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Feedback &amp; Inquiry</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Submit a question or feedback to the administration.
      </p>

      <TicketForm />

      <div className="mt-10">
        <h2 className="text-lg font-medium">Your Tickets</h2>
        {tickets.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            No tickets submitted yet.
          </p>
        )}
        <ul className="mt-3 flex flex-col gap-3">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="rounded border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{ticket.subject}</span>
                <span className="text-xs uppercase text-muted-foreground">
                  {ticket.status}
                </span>
              </div>
              <p className="mt-1 text-muted-foreground">{ticket.message}</p>
              {ticket.adminNote && (
                <p className="mt-2 rounded bg-muted px-2 py-1 text-xs">
                  Admin: {ticket.adminNote}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
