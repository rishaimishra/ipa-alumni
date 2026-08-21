import { z } from "zod";

export const PhysicalCardRequestSchema = z.object({
  deliveryAddress: z
    .string()
    .trim()
    .min(10, "Please provide a complete delivery address."),
});
export type PhysicalCardRequestInput = z.infer<typeof PhysicalCardRequestSchema>;
