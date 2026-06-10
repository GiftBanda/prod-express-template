// @/lib/env
//disable eslint for this file since it's only used for loading environment variables and validating them, and it doesn't contain any complex logic that would require linting
 

import { config } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { z, ZodError } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  AUTH_TRUST_HOST: z.string().min(1),
  DATABASE_URL: z.string().min(1),
});

dotenvExpand.expand(config());

try {
  envSchema.parse(process.env);
} catch (e) {
  if (e instanceof ZodError) {
    console.error("Environment validation error:", e.issues);
  }
}

const env = envSchema.parse(process.env);

export default env;
