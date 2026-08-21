"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, requireRole } from "@/lib/dal";
import type { SimpleState } from "@/app/actions/auth";

const RequestSchema = z.object({
  deliveryAddress: z
    .string()
    .trim()
    .min(10, "Please provide a complete delivery address."),
});

export async function requestPhysicalCard(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const user = await requireUser();
  const parsed = RequestSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const pending = await prisma.physicalCardRequest.findFirst({
    where: {
      userId: user.id,
      status: { in: ["REQUESTED", "PRINTING", "SHIPPED"] },
    },
  });
  if (pending) {
    return { message: "You already have a physical card request in progress." };
  }

  await prisma.physicalCardRequest.create({
    data: { userId: user.id, deliveryAddress: parsed.data.deliveryAddress },
  });

  revalidatePath("/id-card");
  return { message: "Physical card request submitted." };
}

const StatusSchema = z.enum([
  "REQUESTED",
  "PRINTING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export async function updatePhysicalCardStatus(requestId: string, status: string) {
  await requireRole(["ADMIN", "MODERATOR"]);
  const parsed = StatusSchema.safeParse(status);
  if (!parsed.success) return;

  await prisma.physicalCardRequest.update({
    where: { id: requestId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/id-cards");
}

export async function togglePaymentVerified(requestId: string, verified: boolean) {
  await requireRole(["ADMIN", "MODERATOR"]);

  await prisma.physicalCardRequest.update({
    where: { id: requestId },
    data: { paymentVerified: verified },
  });

  revalidatePath("/admin/id-cards");
}
