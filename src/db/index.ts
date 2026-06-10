import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { passwordResetTokens } from "./schema/passwordResetToken.js";
import { users } from "./schema/user.js";

const schema = {
  passwordResetTokens,
  users,
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { logger: true, schema });

export type DB = typeof db;
