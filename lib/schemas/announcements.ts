import { z } from "zod";

export const AnnouncementSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  body: z.string().trim().min(5, "Message must be at least 5 characters."),
  type: z.enum(["ANNOUNCEMENT", "EVENT", "DEADLINE", "NEWS"]),
  endsAt: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.coerce.date().optional()
  ),
});
export type AnnouncementInput = z.infer<typeof AnnouncementSchema>;
