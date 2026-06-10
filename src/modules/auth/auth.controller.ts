import { NextFunction, Request, Response } from "express";

import { LoginInput, RefreshTokenInput, RegisterInput } from "#shared/types/auth.types.js";

import AuthService from "./auth.services.js";

// auth.controller.ts — owns all HTTP concerns
class AuthController {
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as { email: string };
      await AuthService.forgotPassword(email);
      res.status(200).json({ message: "If that email is registered, a reset link has been sent" });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as LoginInput;
      const result = await AuthService.login(body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  refreshToken = (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RefreshTokenInput;
      const result = AuthService.refreshToken(body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RegisterInput; // safe — already validated
      const result = await AuthService.register(body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body as { token: string; newPassword: string };
      await AuthService.resetPassword(token, newPassword);
      res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
