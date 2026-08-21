"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { RegisterSchema } from "@/lib/schemas/auth";
import { registerUser, sendLoginOtp } from "@/lib/services/auth-service";
import { ConflictError, ForbiddenError, NotFoundError } from "@/lib/errors";

export type RegisterState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

export async function registerAlumni(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await registerUser(parsed.data);
    redirect(`/verify?phone=${encodeURIComponent(user.phone)}`);
  } catch (error) {
    if (error instanceof ConflictError) {
      return { message: error.message };
    }
    throw error;
  }
}

export type SimpleState = { message?: string } | undefined;

export async function requestLoginOtp(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const phone = (formData.get("phone") as string | null)?.trim();
  if (!phone) return { message: "Phone number is required." };

  try {
    await sendLoginOtp(phone);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { message: error.message };
    }
    throw error;
  }

  redirect(`/verify?phone=${encodeURIComponent(phone)}`);
}

export async function verifyOtpAndSignIn(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const phone = formData.get("phone") as string;
  const code = formData.get("code") as string;

  try {
    await signIn("otp", { phone, code, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid or expired code. Please try again." };
    }
    throw error;
  }
}

export async function adminLogin(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("admin-credentials", { email, password, redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid email or password." };
    }
    throw error;
  }
}
