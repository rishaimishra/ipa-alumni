import { z } from "zod";

export const RegisterSchema = z.object({
  role: z.enum(["ALUMNI", "STUDENT"]),
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  sex: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Sex is required.",
  }),
  gender: z.string().trim().optional(),
  religion: z.string().trim().optional(),
  age: z.coerce.number().int().positive().optional(),
  email: z.union([z.email("Enter a valid email."), z.literal("")]).optional(),
  phone: z.string().trim().min(8, "Enter a valid phone number."),
  studentId: z.string().trim().min(1, "Student Admission Number is required."),
  residentialAddress: z.string().trim().optional(),
  workAddress: z.string().trim().optional(),
  programOfStudy: z.string().trim().optional(),
  degreeType: z.string().trim().optional(),
  yearFrom: z.coerce.number().int().optional(),
  yearTo: z.coerce.number().int().optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const OtpRequestSchema = z.object({
  phone: z.string().trim().min(8, "Enter a valid phone number."),
});
export type OtpRequestInput = z.infer<typeof OtpRequestSchema>;

export const OtpVerifySchema = z.object({
  phone: z.string().trim().min(8, "Enter a valid phone number."),
  code: z.string().trim().min(4, "Enter the code you received."),
});
export type OtpVerifyInput = z.infer<typeof OtpVerifySchema>;
