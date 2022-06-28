import express, { Request, Response } from "express";
import { body } from "express-validator";
import multer from "multer";
import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { currentUser } from "../middlewares/current-user";
import { validateRequest } from "../middlewares/validate-request";
import { ImageModel } from "../models/image";

import { User } from "../models/user";

const router = express.Router();
const storage = multer.memoryStorage();

router.post("/api/users/update/profile", currentUser, async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new NotAuthorizedError();
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  user.save();

  res.status(200).send(user);
});

router.post(
  "/api/users/update/displayPicture",
  currentUser,
  multer({ storage: storage }).single("image"),
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, about = "" } = req.body;
    const existingUser = await User.findById(req.currentUser!.id);

    if (!existingUser) {
      throw new BadRequestError("User not found");
    }

    if (req.file?.buffer) {
      if (!req.file?.buffer) {
        throw new BadRequestError("Invalid file");
      }
      var fullUrl = req.protocol + "://" + req.get("host") + req.baseUrl;

      const image = {
        // @ts-ignore /
        data: Buffer.from(req.file.buffer, "base64"),
        contentType: req.file.mimetype,
        name: req.file.originalname,
      };

      const savedImage = await ImageModel.create(image);
      const foundImage = await ImageModel.findById(savedImage?._id)
        .lean()
        .exec();
      const url = `${fullUrl}/api/get/image/${foundImage?._id}`;

      existingUser.displayPicture = url;
      await existingUser.save();

      res.status(200).send(existingUser);
    } else {
      res.status(400).send(false);
    }
  }
);

export { router as updateUserRouter };
