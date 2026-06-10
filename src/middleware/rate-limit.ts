// import { NextFunction, Request, Response } from "express";

// const requests: Record<string, number[]> = {};

// export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
//   const ip = req.ip ?? "unknown";
//   const now = Date.now();

//   requests[ip] ??= [];

//   requests[ip] = requests[ip].filter((timestamp) => now - timestamp < 60000);

//   requests[ip].push(now);

//   if (requests[ip].length > 10) {
//     return res.status(429).send("Too many requests");
//   }

//   next();
// };

import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

const redisUrl =
  process.env.REDIS_URL ??
  (process.env.REDIS_HOST
    ? `redis://${process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : ""}${process.env.REDIS_HOST}:${String(process.env.REDIS_PORT ?? 6379)}`
    : undefined);

let store;
let loggedRedisError = false;

if (redisUrl) {
  const client = createClient({
    socket: {
      reconnectStrategy: false,
    },
    url: redisUrl,
  });

  client.on("error", (error) => {
    if (!loggedRedisError) {
      loggedRedisError = true;
      console.warn("Redis rate limiter error:", error instanceof Error ? error.message : error);
    }
  });

  try {
    await client.connect();
    store = new RedisStore({ sendCommand: (...args) => client.sendCommand(args) });
    console.log("Redis rate limiter connected");
  } catch (error) {
    console.warn("Redis unavailable, using in-memory rate limiter:", error instanceof Error ? error.message : error);
    await client.quit().catch(() => undefined);
  }
}

export const rateLimiter = rateLimit({
  legacyHeaders: false,
  limit: 10,
  standardHeaders: "draft-8", // sends RateLimit headers
  store,
  windowMs: 60_000,
});
