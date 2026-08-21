import { NextResponse } from "next/server";
import { OtpVerifySchema } from "@/lib/schemas/auth";
import { verifyOtpForUser } from "@/lib/services/auth-service";
import { signApiToken } from "@/lib/api-auth";
import { ValidationError } from "@/lib/errors";
import { errorResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = OtpVerifySchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid phone number or code.",
        parsed.error.flatten().fieldErrors
      );
    }

    const user = await verifyOtpForUser(parsed.data.phone, parsed.data.code);
    const token = await signApiToken(user);

    return NextResponse.json({
      token,
      user: { id: user.id, phone: user.phone, role: user.role, status: user.status },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
