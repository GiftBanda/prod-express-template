import { config as loadEnv } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// @/db/migrate.ts
import config from "../../drizzle.config.js";
import { db } from "./index.js";

dotenvExpand.expand(loadEnv());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

// const db = drizzle(pool);

async function main() {
  if (config.out) {
    await migrate(db, { migrationsFolder: config.out });
    console.log("Migration done!");
  }
}

main()
  .catch((e: unknown) => {
    console.error(e);
  })
  .finally(async () => {
    await pool.end();
  });
