import "server-only";
import { prisma } from "@/lib/prisma";
import { sendPushToTokens } from "@/lib/push";
import type { AnnouncementInput } from "@/lib/schemas/announcements";

export async function listActiveAnnouncementsForUser(userId: string) {
  const now = new Date();
  return prisma.announcement.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      OR: [{ endsAt: null }, { endsAt: { gte: now } }],
      dismissals: { none: { userId } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function dismissAnnouncement(userId: string, announcementId: string) {
  await prisma.announcementDismissal.upsert({
    where: { userId_announcementId: { userId, announcementId } },
    update: {},
    create: { userId, announcementId },
  });
}

export async function listAllAnnouncements() {
  return prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createAnnouncement(input: AnnouncementInput) {
  const announcement = await prisma.announcement.create({
    data: {
      title: input.title,
      body: input.body,
      type: input.type,
      endsAt: input.endsAt,
    },
  });

  const devices = await prisma.deviceToken.findMany({ select: { token: true } });
  await sendPushToTokens(
    devices.map((d) => d.token),
    { title: announcement.title, body: announcement.body }
  );

  return announcement;
}

export async function setAnnouncementActive(id: string, isActive: boolean) {
  return prisma.announcement.update({ where: { id }, data: { isActive } });
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } });
}
