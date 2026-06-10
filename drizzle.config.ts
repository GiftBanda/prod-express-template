import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  dialect: "postgresql",
  out: "./drizzle/migrations",
  schema: "./src/db/schema/index.ts",
  strict: true,
  verbose: true,
});
