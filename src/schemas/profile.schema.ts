import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Please enter a valid phone number",
    }),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  address: z.string().trim().optional(),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormOutput = z.output<typeof profileSchema>;
