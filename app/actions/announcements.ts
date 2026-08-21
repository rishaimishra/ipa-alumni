"use server";

import { revalidatePath } from "next/cache";
import { requireUser, requireRole } from "@/lib/dal";
import { AnnouncementSchema } from "@/lib/schemas/announcements";
import {
  createAnnouncement,
  dismissAnnouncement as dismissAnnouncementService,
  setAnnouncementActive,
  deleteAnnouncement as deleteAnnouncementService,
} from "@/lib/services/announcement-service";
import type { SimpleState } from "@/app/actions/auth";

export async function dismissAnnouncement(announcementId: string) {
  const user = await requireUser();
  await dismissAnnouncementService(user.id, announcementId);
  revalidatePath("/dashboard");
}

export async function createAnnouncementAction(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  await requireRole(["ADMIN", "MODERATOR"]);

  const parsed = AnnouncementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await createAnnouncement(parsed.data);
  revalidatePath("/admin/announcements");
  return { message: "Announcement published." };
}

export async function toggleAnnouncementActive(id: string, isActive: boolean) {
  await requireRole(["ADMIN", "MODERATOR"]);
  await setAnnouncementActive(id, isActive);
  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncementAction(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);
  await deleteAnnouncementService(id);
  revalidatePath("/admin/announcements");
}
