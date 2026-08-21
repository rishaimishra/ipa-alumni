"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { AdBannerSchema } from "@/lib/schemas/ads";
import { saveUploadedFile } from "@/lib/storage";
import {
  createBanner,
  setBannerActive,
  deleteBanner as deleteBannerService,
} from "@/lib/services/ad-service";
import type { SimpleState } from "@/app/actions/auth";

export async function createBannerAction(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  await requireRole(["ADMIN", "MODERATOR"]);

  const parsed = AdBannerSchema.safeParse({
    title: formData.get("title"),
    linkUrl: formData.get("linkUrl"),
  });
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { message: "A banner image is required." };
  }
  if (!image.type.startsWith("image/")) {
    return { message: "The uploaded file must be an image." };
  }

  const imageUrl = await saveUploadedFile(image, "ads");
  await createBanner({ ...parsed.data, imageUrl });

  revalidatePath("/admin/ads");
  return { message: "Banner created." };
}

export async function toggleBannerActive(id: string, isActive: boolean) {
  await requireRole(["ADMIN", "MODERATOR"]);
  await setBannerActive(id, isActive);
  revalidatePath("/admin/ads");
}

export async function deleteBannerAction(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);
  await deleteBannerService(id);
  revalidatePath("/admin/ads");
}
