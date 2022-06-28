import express, { Request, Response } from "express";
import { currentUser } from "../middlewares/current-user";
import { User } from "../models/user";

const router = express.Router();

router.get("/api/users/get/:id", async (req: Request, res: Response) => {
  const postId = req.params.id;
  const user = await User.findById(req.params.id);

  res.status(201).send(user);
});
export { router as userByIdRouter };
