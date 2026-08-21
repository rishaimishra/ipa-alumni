import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { PhysicalCardRequestSchema } from "@/lib/schemas/id-card";
import {
  createPhysicalCardRequest,
  getMyPhysicalCardRequest,
} from "@/lib/services/id-card-service";
import { ValidationError } from "@/lib/errors";
import { errorResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const user = await requireApiUser(req);
    const request = await getMyPhysicalCardRequest(user.id);
    return NextResponse.json({ request });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireApiUser(req);
    const body = await req.json();
    const parsed = PhysicalCardRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid delivery address.",
        parsed.error.flatten().fieldErrors
      );
    }

    const request = await createPhysicalCardRequest(user.id, parsed.data);
    return NextResponse.json({ request }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
