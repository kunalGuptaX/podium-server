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

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")?.[1];
  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    throw new NotAuthorizedError();
  }

  next();
};
