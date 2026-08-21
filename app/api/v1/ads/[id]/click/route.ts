import { NextResponse } from "next/server";
import { recordAdClick } from "@/lib/services/ad-service";
import { errorResponse } from "@/lib/api-response";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await recordAdClick(id);
    return NextResponse.json({ linkUrl: banner.linkUrl });
  } catch (error) {
    return errorResponse(error);
  }
}
