import { z } from "zod";

// Shared Patterns
const mobileRegex = /^[0-9]{10}$/;
const rollNumberRegex = /^[0-9A-Za-z]{10}$/;

export const RegistrationSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email("Invalid email address").trim(),
    roll_number: z
        .string()
        .trim()
        .transform((val) => val.toUpperCase())
        .refine((val) => rollNumberRegex.test(val), {
            message: "Invalid Roll Number format (10 characters expected)",
        }),
    club: z.string().min(1, "Please select a club"),
    mobile: z.string().regex(mobileRegex, "Invalid Mobile Number (10 digits expected)"),
    year: z.string().min(1, "Please select a year"),
    status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
});

export const UpdateSchema = z.object({
    message: z.string().min(5).max(500).trim(),
});

export const EventSchema = z.object({
    title: z.string().min(5).max(200).trim(),
    club: z.string().min(1),
    date: z.string().min(1),
    description: z.string().min(10).max(2000).trim(),
    tags: z.array(z.string()).min(1),
});

export const GallerySchema = z.object({
    title: z.string().min(2).max(100).trim(),
    club: z.string().min(1),
});

export const ClubSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().min(10).max(1000).trim(),
    faculty: z.string().min(2).max(100).trim(),
    student: z.string().min(2).max(200).trim(),
    icon: z.string().min(1).max(10),
});

export const CoordinatorSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    type: z.enum(["faculty", "student"]),
    roll_number: z
        .string()
        .trim()
        .transform((val) => val.toUpperCase())
        .refine((val) => val === "" || rollNumberRegex.test(val), {
            message: "Invalid Roll Number format",
        })
        .optional(),
    mobile: z.string().regex(mobileRegex),
    club: z.string().min(1),
});
