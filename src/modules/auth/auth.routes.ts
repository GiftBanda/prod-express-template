import express from "express";

import authController from "./auth.controller.js";
import { validateForgotPassword, validateLogin, validateRefreshToken, validateRegister } from "./auth.validator.js";

const router = express.Router();

router.post("/auth/register", validateRegister, authController.register);
router.post("/auth/login", validateLogin, authController.login);
router.post("/auth/refresh-token", validateRefreshToken, authController.refreshToken);
router.post("/auth/forgot-password", validateForgotPassword, authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);

export default router;
