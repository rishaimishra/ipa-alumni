import "server-only";
import { prisma } from "@/lib/prisma";
import { ConflictError } from "@/lib/errors";
import type { PhysicalCardRequestInput } from "@/lib/schemas/id-card";

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

export async function getCardForVerification(cardNumber: string) {
  return prisma.virtualIdCard.findUnique({
    where: { cardNumber },
    include: { user: { include: { alumniProfile: true } } },
  });
}

export async function getMyPhysicalCardRequest(userId: string) {
  return prisma.physicalCardRequest.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPhysicalCardRequest(
  userId: string,
  input: PhysicalCardRequestInput
) {
  const pending = await prisma.physicalCardRequest.findFirst({
    where: {
      userId,
      status: { in: ["REQUESTED", "PRINTING", "SHIPPED"] },
    },
  });
  if (pending) {
    throw new ConflictError("You already have a physical card request in progress.");
  }

  return prisma.physicalCardRequest.create({
    data: { userId, deliveryAddress: input.deliveryAddress },
  });
}
