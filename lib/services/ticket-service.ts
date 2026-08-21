import "server-only";
import { prisma } from "@/lib/prisma";
import type { CreateTicketInput } from "@/lib/schemas/tickets";

export async function listMyTickets(userId: string) {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTicket(userId: string, input: CreateTicketInput) {
  return prisma.supportTicket.create({
    data: {
      userId,
      subject: input.subject,
      message: input.message,
    },
  });
}
