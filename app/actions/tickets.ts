"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, requireRole } from "@/lib/dal";
import { CreateTicketSchema } from "@/lib/schemas/tickets";
import { createTicket as createTicketService } from "@/lib/services/ticket-service";
import type { SimpleState } from "@/app/actions/auth";

export async function createTicket(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const user = await requireUser();
  const parsed = CreateTicketSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await createTicketService(user.id, parsed.data);

  revalidatePath("/support");
  return { message: "Ticket submitted." };
}

const StatusSchema = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);

export async function updateTicketStatus(ticketId: string, status: string) {
  await requireRole(["ADMIN", "MODERATOR"]);
  const parsedStatus = StatusSchema.safeParse(status);
  if (!parsedStatus.success) return;

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: parsedStatus.data },
  });

  revalidatePath("/admin/tickets");
}
