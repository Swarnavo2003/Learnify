import { z } from "zod";

export const userRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .nonoptional(" Full name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonoptional("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long")
    .nonoptional("Password is required"),
});

export const userLoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonoptional("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long")
    .nonoptional("Password is required"),
});

export const courseCreationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
});

export const moduleCreationSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  title: z.string().min(1, "Title is required"),
});

export const moduleUpdationSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const commendCreationSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});
