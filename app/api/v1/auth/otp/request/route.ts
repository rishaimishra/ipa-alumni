import { NextResponse } from "next/server";
import { OtpRequestSchema } from "@/lib/schemas/auth";
import { sendLoginOtp } from "@/lib/services/auth-service";
import { ValidationError } from "@/lib/errors";
import { errorResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = OtpRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid phone number.",
        parsed.error.flatten().fieldErrors
      );
    }

    await sendLoginOtp(parsed.data.phone);
    return NextResponse.json({ message: "OTP sent." });
  } catch (error) {
    return errorResponse(error);
  }
}
