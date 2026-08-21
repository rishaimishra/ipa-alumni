import { NextResponse } from "next/server";
import { recordAdClick } from "@/lib/services/ad-service";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await recordAdClick(id);
    return NextResponse.redirect(banner.linkUrl);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    throw error;
  }
}
