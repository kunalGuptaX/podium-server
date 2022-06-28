import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { UserDoc } from "../models/user";

interface UserPayload extends UserDoc {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const refreshTokenAvailable = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.REFRESH_TOKEN!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
