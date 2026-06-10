import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(422).json({ errors, message: "Validation failed" });
  }

  req.body = result.data;
  next();
};
