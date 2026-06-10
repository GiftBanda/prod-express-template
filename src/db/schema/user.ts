// @/db/schema/user.ts
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  id: varchar("id", { length: 255 }).primaryKey(),
  password: varchar("password", { length: 255 }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export type User = typeof users.$inferSelect;
