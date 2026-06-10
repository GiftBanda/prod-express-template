import { z } from "zod";

import { validate } from "#middleware/validator.js";

export const registerSchema = z.object({
  email: z.email({ error: "Email is required" }).toLowerCase().trim(),

  name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters").max(64, "Name must be at most 64 characters").trim(),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const resetPasswordSchema = z
  .object({
    confirmPassword: z.string({ error: "Please confirm your password" }),

    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    token: z.string({ error: "Token is required" }).min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({ error: "Email is required" }).toLowerCase().trim(),

  password: z.string({ error: "Password is required" }).min(1, "Password is required"), // no rules — let the service decide
});

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Email is required" }).toLowerCase().trim(),
});

export const refreshTokenSchema = z.object({
  token: z.string({ error: "Refresh token is required" }).min(1, "Refresh token cannot be empty"),
});

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateRefreshToken = validate(refreshTokenSchema);
export const validateResetPassword = validate(resetPasswordSchema);
