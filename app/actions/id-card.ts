"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, requireRole } from "@/lib/dal";
import { PhysicalCardRequestSchema } from "@/lib/schemas/id-card";
import { createPhysicalCardRequest } from "@/lib/services/id-card-service";
import { ConflictError } from "@/lib/errors";
import type { SimpleState } from "@/app/actions/auth";

export async function requestPhysicalCard(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const user = await requireUser();
  const parsed = PhysicalCardRequestSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await createPhysicalCardRequest(user.id, parsed.data);
  } catch (error) {
    if (error instanceof ConflictError) {
      return { message: error.message };
    }
    throw error;
  }

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
