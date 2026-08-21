import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { listActiveAnnouncementsForUser } from "@/lib/services/announcement-service";
import { errorResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const user = await requireApiUser(req);
    const announcements = await listActiveAnnouncementsForUser(user.id);
    return NextResponse.json({ announcements });
  } catch (error) {
    return errorResponse(error);
  }
}
