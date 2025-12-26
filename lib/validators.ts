import * as z from "zod"
import { Role } from "@/lib/enums"

export const UserValidation = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(16, { message: "Password must be at most 16 characters." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one symbol." }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits.",
    }),
  role: z.nativeEnum(Role),
})

export const DoctorValidation = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine((val) => /^\d{10}$/.test(val), {
    message: "Phone number must be exactly 10 digits.",
  }),
  specialization: z.array(z.string()).min(1, "Please select at least one specialization"),
  qualification: z.string().min(2, "Qualification is required"),
  licenseNumber: z.string().min(5, "License number is required"),
  experience: z.string().min(1, "Please enter years of experience"),
  clinicName: z.string().optional(),
  hospitalName: z.string().optional(),
  
  // Address
  street: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(6, "Zip code must be 6 digits"),
  country: z.string().default("India"),
  
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
})
