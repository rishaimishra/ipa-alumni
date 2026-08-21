import "server-only";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { AdBannerInput } from "@/lib/schemas/ads";

export async function getActiveBanners() {
  const now = new Date();
  const banners = await prisma.adBanner.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      OR: [{ endsAt: null }, { endsAt: { gte: now } }],
    },
    orderBy: { createdAt: "desc" },
  });

  if (banners.length > 0) {
    await prisma.adBanner.updateMany({
      where: { id: { in: banners.map((b) => b.id) } },
      data: { impressionCount: { increment: 1 } },
    });
  }

  return banners;
}

export async function recordAdClick(id: string) {
  const banner = await prisma.adBanner.findUnique({ where: { id } });
  if (!banner) throw new NotFoundError("Ad banner not found.");

  await prisma.adBanner.update({
    where: { id },
    data: { clickCount: { increment: 1 } },
  });

  return banner;
}

export async function listAllBanners() {
  return prisma.adBanner.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createBanner(input: AdBannerInput & { imageUrl: string }) {
  return prisma.adBanner.create({
    data: {
      title: input.title,
      imageUrl: input.imageUrl,
      linkUrl: input.linkUrl,
    },
  });
}

export async function setBannerActive(id: string, isActive: boolean) {
  return prisma.adBanner.update({ where: { id }, data: { isActive } });
}

export async function deleteBanner(id: string) {
  await prisma.adBanner.delete({ where: { id } });
}
