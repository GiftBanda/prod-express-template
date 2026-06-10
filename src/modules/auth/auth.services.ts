// auth.service.ts — zero Express imports
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { sendPasswordResetEmail } from "#lib/mailer.js";
import redis from "#lib/redis.js";
import { addUser, findUserByEmail, findUserById, insertResetToken, markTokenUsed, updateUserPassword } from "#modules/auth/auth.repository.js";
import { AppError } from "#shared/errors/AppError.js";
import { RegisterInput } from "#shared/types/auth.types.js";
import { LoginData, Refresh } from "#shared/types/user.types.js";

const secretKey = process.env.JWT_SECRET_KEY!; // validated at startup
const RESET_TOKEN_TTL = 60 * 15; // 15 minutes in seconds
const REDIS_PREFIX = "pwd_reset:";

const signTokens = (userId: string, email: string) => ({
  accessToken: jwt.sign({ email, sub: userId }, secretKey, { expiresIn: "1h" }),
  refreshToken: jwt.sign({ email, sub: userId }, secretKey, { expiresIn: "1d" }),
});

class AuthService {
  async forgotPassword(email: string) {
    const user = await findUserByEmail(email);

    // Always return success — never reveal whether the email exists
    if (!user) return;

    // Invalidate any existing token for this user
    const existingToken = await redis.get(`${REDIS_PREFIX}user:${user.id}`);
    if (existingToken) {
      await redis.del(`${REDIS_PREFIX}${existingToken}`);
      await redis.del(`${REDIS_PREFIX}user:${user.id}`);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // Store token → userId in Redis with TTL
    await redis.setEx(`${REDIS_PREFIX}${token}`, RESET_TOKEN_TTL, user.id);
    // Store userId → token (so we can invalidate old tokens above)
    await redis.setEx(`${REDIS_PREFIX}user:${user.id}`, RESET_TOKEN_TTL, token);

    // Persist for audit trail
    await insertResetToken(user.id, token);

    await sendPasswordResetEmail(email, resetUrl);
  }

  async login({ email, password }: LoginData) {
    const user = await findUserByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError("Invalid credentials", 401);

    return { ...signTokens(user.id, user.email), user: { email: user.email, id: user.id } };
  }

  refreshToken(token: Refresh) {
    const decoded = jwt.verify(token.token, secretKey) as { email: string; sub: string };
    return signTokens(decoded.sub, decoded.email);
  }

  async register({ email, name, password }: RegisterInput) {
    const existing = await findUserByEmail(email);
    if (existing) throw new AppError(`Email already in use`, 409);

    const hashed = await bcrypt.hash(password, 10);
    const newUser = { email, fullName: name, id: createId(), password: hashed };
    const [created] = await addUser(newUser);

    return { ...signTokens(created.id, created.email), user: { email: created.email, id: created.id } };
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = (await redis.get(`${REDIS_PREFIX}${token}`)) as string;

    if (!userId) {
      throw new AppError("Reset token is invalid or has expired", 400);
    }

    const user = await findUserById(userId);
    if (!user) throw new AppError("User not found", 404);

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new AppError("New password must be different from the current password", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, hashed);

    // Invalidate the token immediately after use
    await redis.del(`${REDIS_PREFIX}${token}`);
    await redis.del(`${REDIS_PREFIX}user:${userId}`);
    await markTokenUsed(token);
  }
}

export default new AuthService();
