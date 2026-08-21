import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/schemas/auth";
import { registerUser } from "@/lib/services/auth-service";
import { ValidationError } from "@/lib/errors";
import { errorResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid registration details.",
        parsed.error.flatten().fieldErrors
      );
    }

    const user = await registerUser(parsed.data);
    return NextResponse.json(
      { phone: user.phone, message: "Registered. An OTP has been sent." },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
