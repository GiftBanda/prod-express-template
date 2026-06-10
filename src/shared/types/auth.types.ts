import { NextFunction, Response } from "express";
import { z } from "zod";

import { forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resetPasswordSchema } from "#modules/auth/auth.validator.js";

export interface AuthServiceInterface {
  forgotPassword(email: string, res: Response, next: NextFunction): Promise<Response | undefined>;
  login(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
  refreshToken(token: string): Promise<Response | undefined>;
  register(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
}

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export interface User {
  email: string;
  fullName: string;
  id: string;
  password: string;
}
