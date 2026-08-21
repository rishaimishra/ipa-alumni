import { z } from "zod";

export const AdBannerSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  linkUrl: z.url("Enter a valid URL."),
});
export type AdBannerInput = z.infer<typeof AdBannerSchema>;
