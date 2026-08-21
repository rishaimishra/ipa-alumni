import { NextResponse } from "next/server";
import { getCardForVerification } from "@/lib/services/id-card-service";
import { NotFoundError } from "@/lib/errors";
import { errorResponse } from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cardNumber: string }> }
) {
  try {
    const { cardNumber } = await params;
    const card = await getCardForVerification(cardNumber);
    if (!card) throw new NotFoundError("No IPAM alumni ID card matches this code.");

    return NextResponse.json({
      cardNumber: card.cardNumber,
      valid: card.user.status === "ACTIVE",
      fullName: card.user.alumniProfile?.fullName ?? null,
      role: card.user.role,
      programOfStudy: card.user.alumniProfile?.programOfStudy ?? null,
      yearFrom: card.user.alumniProfile?.yearFrom ?? null,
      yearTo: card.user.alumniProfile?.yearTo ?? null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
