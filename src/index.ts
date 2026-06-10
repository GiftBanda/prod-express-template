import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import helmet from "helmet";

import authRoutes from "#modules/auth/auth.routes.js";
import { AppError } from "#shared/errors/AppError.js";

import { rateLimiter } from "./middleware/rate-limit.js";

const app = express();
const PORT = process.env.PORT!;

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000"];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: origin "${origin}" is not allowed`));
      }
    },
  }),
);

app.use(helmet());
app.use(rateLimiter);
app.use(express.json());

app.use("/api/v1", authRoutes);

// Error handling middleware (must be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
