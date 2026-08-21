import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { RegisterDeviceTokenSchema } from "@/lib/schemas/device-token";
import { registerDeviceToken } from "@/lib/services/device-token-service";
import { ValidationError } from "@/lib/errors";
import { errorResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const user = await requireApiUser(req);
    const body = await req.json();
    const parsed = RegisterDeviceTokenSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid device token.",
        parsed.error.flatten().fieldErrors
      );
    }

    await registerDeviceToken(user.id, parsed.data);
    return NextResponse.json({ message: "Device registered." }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
