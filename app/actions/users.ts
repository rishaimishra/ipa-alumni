"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/dal";

const RoleSchema = z.enum([
  "ALUMNI",
  "STUDENT",
  "EMPLOYER",
  "PUBLIC_VISITOR",
  "ADMIN",
  "MODERATOR",
]);
const StatusSchema = z.enum(["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"]);

export async function updateUserRole(userId: string, role: string) {
  await requireRole(["ADMIN"]);
  const parsed = RoleSchema.safeParse(role);
  if (!parsed.success) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data },
  });

  revalidatePath("/admin/users");
}

export async function updateUserStatus(userId: string, status: string) {
  await requireRole(["ADMIN", "MODERATOR"]);
  const parsed = StatusSchema.safeParse(status);
  if (!parsed.success) return;

  await prisma.user.update({
    where: { id: userId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/users");
}
