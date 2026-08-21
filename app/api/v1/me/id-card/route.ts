import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/api-auth";
import { getOrCreateVirtualCard } from "@/lib/services/id-card-service";
import { getAppOrigin } from "@/lib/url";
import { errorResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const authUser = await requireApiUser(req);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: authUser.id },
      include: { alumniProfile: true },
    });
    const card = await getOrCreateVirtualCard(user.id);
    const origin = await getAppOrigin();

    return NextResponse.json({
      cardNumber: card.cardNumber,
      issuedAt: card.issuedAt,
      status: user.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
      verifyUrl: `${origin}/verify-card/${card.cardNumber}`,
      profile: {
        fullName: user.alumniProfile?.fullName ?? null,
        programOfStudy: user.alumniProfile?.programOfStudy ?? null,
        degreeType: user.alumniProfile?.degreeType ?? null,
        yearFrom: user.alumniProfile?.yearFrom ?? null,
        yearTo: user.alumniProfile?.yearTo ?? null,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
