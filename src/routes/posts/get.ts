import express, { Request, Response } from "express";
import { body } from "express-validator";
import { currentUser } from "../../middlewares/current-user";
import { validateRequest } from "../../middlewares/validate-request";
import { Post } from "../../models/post";
import { User } from "../../models/user";

const router = express.Router();

router.get("/api/posts/get/all", async (req: Request, res: Response) => {
  const posts = await Post.find().populate(["comments", "user"]);

  res.status(201).send(posts);
});

router.get("/api/posts/get/:id", async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate(["comments", "user"]);
    res.status(201).send(post);
  } catch (er) {
    console.log(er);
  }
});

router.get("/api/posts/get/byuser/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return;
  }
  const posts = await Post.find({ user: user.id }).populate([
    "comments",
    "user",
  ]);

  res.status(201).send(posts);
});

export { router as getPostRouter };
