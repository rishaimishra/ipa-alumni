import "server-only";
import { prisma } from "@/lib/prisma";
import type { RegisterDeviceTokenInput } from "@/lib/schemas/device-token";

export async function registerDeviceToken(userId: string, input: RegisterDeviceTokenInput) {
  return prisma.deviceToken.upsert({
    where: { token: input.token },
    update: { userId, platform: input.platform },
    create: { userId, token: input.token, platform: input.platform },
  });
}
