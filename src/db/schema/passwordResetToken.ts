// src/db/schema/passwordResetToken.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const passwordResetTokens = pgTable("password_reset_tokens", {
  expiresAt: timestamp("expires_at").notNull(),
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  usedAt: timestamp("used_at"),
  userId: text("user_id").notNull(),
});
