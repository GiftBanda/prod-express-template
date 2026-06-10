import { config as loadEnv } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import { db } from "./index.js";

dotenvExpand.expand(loadEnv());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("Migration done!");
}

main()
  .catch((e: unknown) => {
    console.error(e);
  })
  .finally(async () => {
    await pool.end();
  });
