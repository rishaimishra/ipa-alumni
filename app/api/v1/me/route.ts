import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/api-auth";
import { errorResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const authUser = await requireApiUser(req);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: authUser.id },
      include: { alumniProfile: true },
    });

    return NextResponse.json({
      id: user.id,
      phone: user.phone,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      status: user.status,
      profile: user.alumniProfile,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
