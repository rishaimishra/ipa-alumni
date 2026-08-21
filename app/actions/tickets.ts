"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, requireRole } from "@/lib/dal";
import type { SimpleState } from "@/app/actions/auth";

const CreateTicketSchema = z.object({
  subject: z.string().trim().min(3, "Subject must be at least 3 characters."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

export async function createTicket(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const user = await requireUser();
  const parsed = CreateTicketSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.supportTicket.create({
    data: {
      userId: user.id,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

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
