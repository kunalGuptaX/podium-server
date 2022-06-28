import express, { Request, Response } from "express";
import { body } from "express-validator";
import config from "../config";
import { BadRequestError } from "../errors/bad-request-error";
import getAccessToken from "../helpers/getAccessToken";
import getRefreshToken from "../helpers/getRefreshToken";
import { validateRequest } from "../middlewares/validate-request";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("firstName").isString().trim().withMessage("Invalid first name"),
    body("lastName").isString().trim().withMessage("Invalid last name"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      firstName,
      lastName,
      displayPicture = "",
      about = "",
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({
      email,
      password,
      firstName,
      lastName,
      displayPicture,
      about,
    });
    await user.save();

    const response = {
      access_token: getAccessToken(user),
      accessTokenExpires: new Date(
        Date.now() + config.accessTokenExpires * 1000
      ).getTime(),
    };

    // Store it on session object
    req.session = {
      jwt: getRefreshToken(user),
    };

    res.status(201).send(response);
  }
);

export { router as signupRouter };
