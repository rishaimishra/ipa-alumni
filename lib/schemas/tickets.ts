import { z } from "zod";

export const CreateTicketSchema = z.object({
  subject: z.string().trim().min(3, "Subject must be at least 3 characters."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
