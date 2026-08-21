import "server-only";
import { prisma } from "@/lib/prisma";

function randomSegment(length: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function getOrCreateVirtualCard(userId: string) {
  const existing = await prisma.virtualIdCard.findUnique({ where: { userId } });
  if (existing) return existing;

  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 5; attempt++) {
    const cardNumber = `IPAM-${year}-${randomSegment(6)}`;
    try {
      return await prisma.virtualIdCard.create({
        data: { userId, cardNumber },
      });
    } catch {
      // Unique constraint collision on cardNumber — retry with a new one.
    }
  }

  throw new Error("Failed to generate a unique ID card number.");
}
