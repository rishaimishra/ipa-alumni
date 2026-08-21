import { NextResponse } from "next/server";
import { getActiveBanners } from "@/lib/services/ad-service";
import { getAppOrigin } from "@/lib/url";
import { errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const [banners, origin] = await Promise.all([getActiveBanners(), getAppOrigin()]);
    return NextResponse.json({
      banners: banners.map((b) => ({
        id: b.id,
        title: b.title,
        imageUrl: b.imageUrl.startsWith("http") ? b.imageUrl : `${origin}${b.imageUrl}`,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
