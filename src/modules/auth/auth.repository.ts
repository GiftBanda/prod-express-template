import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

import { db } from "#db/index.js";
import { passwordResetTokens } from "#db/schema/passwordResetToken.js";
import { User, users } from "#db/schema/user.js";

export const findUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUserPassword = async (userId: string, hashedPassword: string) => {
  return db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId)).returning();
};

export const insertResetToken = async (userId: string, token: string) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  return db.insert(passwordResetTokens).values({ expiresAt, id: createId(), token, userId }).returning();
};

export const markTokenUsed = async (token: string) => {
  return db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.token, token));
};

export const findUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : null;
};

export const addUser = async (newUser: User) => {
  return await db.insert(users).values(newUser).returning();
};
