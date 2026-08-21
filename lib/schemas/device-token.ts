import { z } from "zod";

export const RegisterDeviceTokenSchema = z.object({
  token: z.string().trim().min(10, "Invalid device token."),
  platform: z.enum(["ANDROID", "IOS", "WEB"]),
});
export type RegisterDeviceTokenInput = z.infer<typeof RegisterDeviceTokenSchema>;
