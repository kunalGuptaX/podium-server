import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from "../services/password";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import getAccessToken from "../helpers/getAccessToken";
import getRefreshToken from "../helpers/getRefreshToken";
import { refreshTokenAvailable } from "../middlewares/refresh-token-available";
import config from "../config";

const router = express.Router();

router.post(
  "/api/users/refresh",
  refreshTokenAvailable,
  async (req: Request, res: Response) => {
    const user = req.currentUser!;

    // Store it on session object
    const response = {
      access_token: getAccessToken(user),
      accessTokenExpires: new Date(
        Date.now() + config.accessTokenExpires * 1000
      ).getTime(),
    };

    console.log(response);

    req.session = {
      jwt: getRefreshToken(user),
    };

    res.status(200).send(response);
  }
);

export { router as refreshTokenRouter };
