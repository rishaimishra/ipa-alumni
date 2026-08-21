"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { sendOtp } from "@/lib/otp";
import { signIn } from "@/lib/auth";
import type { Prisma } from "@/app/generated/prisma/client";

const RegisterSchema = z.object({
  role: z.enum(["ALUMNI", "STUDENT"]),
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  sex: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Sex is required.",
  }),
  gender: z.string().trim().optional(),
  religion: z.string().trim().optional(),
  age: z.coerce.number().int().positive().optional(),
  email: z
    .union([z.email("Enter a valid email."), z.literal("")])
    .optional(),
  phone: z.string().trim().min(8, "Enter a valid phone number."),
  studentId: z.string().trim().min(1, "Student Admission Number is required."),
  residentialAddress: z.string().trim().optional(),
  workAddress: z.string().trim().optional(),
  programOfStudy: z.string().trim().optional(),
  degreeType: z.string().trim().optional(),
  yearFrom: z.coerce.number().int().optional(),
  yearTo: z.coerce.number().int().optional(),
});

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
  const data = parsed.data;

  const orConditions: Prisma.UserWhereInput[] = [
    { phone: data.phone },
    { studentId: data.studentId },
  ];
  if (data.email) orConditions.push({ email: data.email });

  const existing = await prisma.user.findFirst({ where: { OR: orConditions } });
  if (existing) {
    return {
      message:
        "An account with this phone number, student ID, or email already exists.",
    };
  }

  await prisma.user.create({
    data: {
      phone: data.phone,
      email: data.email || undefined,
      studentId: data.studentId,
      role: data.role,
      status: "PENDING_VERIFICATION",
      alumniProfile: {
        create: {
          fullName: data.fullName,
          sex: data.sex,
          gender: data.gender || undefined,
          religion: data.religion || undefined,
          age: data.age,
          residentialAddress: data.residentialAddress || undefined,
          workAddress: data.workAddress || undefined,
          programOfStudy: data.programOfStudy || undefined,
          degreeType: data.degreeType || undefined,
          yearFrom: data.yearFrom,
          yearTo: data.yearTo,
        },
      },
    },
  });

  await sendOtp(data.phone);
  redirect(`/verify?phone=${encodeURIComponent(data.phone)}`);
}

export type SimpleState = { message?: string } | undefined;

export async function requestLoginOtp(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const phone = (formData.get("phone") as string | null)?.trim();
  if (!phone) return { message: "Phone number is required." };

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return { message: "No account found with this phone number." };
  if (user.status === "SUSPENDED") {
    return { message: "This account has been suspended." };
  }

  await sendOtp(phone);
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
