import "server-only";
import { prisma } from "@/lib/prisma";
import { sendOtp, verifyOtp } from "@/lib/otp";
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/errors";
import type { RegisterInput } from "@/lib/schemas/auth";
import type { Prisma, User } from "@/app/generated/prisma/client";

export async function registerUser(data: RegisterInput): Promise<User> {
  const orConditions: Prisma.UserWhereInput[] = [
    { phone: data.phone },
    { studentId: data.studentId },
  ];
  if (data.email) orConditions.push({ email: data.email });

  const existing = await prisma.user.findFirst({ where: { OR: orConditions } });
  if (existing) {
    throw new ConflictError(
      "An account with this phone number, student ID, or email already exists."
    );
  }

  const user = await prisma.user.create({
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
  return user;
}

export async function sendLoginOtp(phone: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw new NotFoundError("No account found with this phone number.");
  if (user.status === "SUSPENDED") {
    throw new ForbiddenError("This account has been suspended.");
  }

  await sendOtp(phone);
}

export async function verifyOtpForUser(phone: string, code: string): Promise<User> {
  const ok = await verifyOtp(phone, code);
  if (!ok) throw new UnauthorizedError("Invalid or expired code.");

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user || user.status === "SUSPENDED") {
    throw new UnauthorizedError("Invalid or expired code.");
  }

  if (user.status === "PENDING_VERIFICATION") {
    return prisma.user.update({
      where: { id: user.id },
      data: { status: "ACTIVE", phoneVerifiedAt: new Date() },
    });
  }

  return user;
}
