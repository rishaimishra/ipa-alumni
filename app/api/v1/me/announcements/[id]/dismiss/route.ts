import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { dismissAnnouncement } from "@/lib/services/announcement-service";
import { errorResponse } from "@/lib/api-response";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser(req);
    const { id } = await params;
    await dismissAnnouncement(user.id, id);
    return NextResponse.json({ message: "Dismissed." });
  } catch (error) {
    return errorResponse(error);
  }
}
