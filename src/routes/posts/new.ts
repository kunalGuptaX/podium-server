import express, { Request, Response } from "express";
import { body } from "express-validator";
import { currentUser } from "../../middlewares/current-user";
import { validateRequest } from "../../middlewares/validate-request";
import { Post } from "../../models/post";
import { User } from "../../models/user";

const router = express.Router();

router.post(
  "/api/posts/new",
  currentUser,
  [
    body("title")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Title should be between 5 to 90 characters"),
    body("subTitle")
      .isString()
      .isLength({ min: 5, max: 90 })
      .withMessage("Sub-Title should be between 5 to 90 characters"),
    body("body")
      .isString()
      .isLength({ min: 200 })
      .withMessage("Post body should be greater than 200 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.currentUser!.id);
      console.log(user, "user");
      if (!user) {
        return res.status(400).send("User not found");
      }
      const post = Post.build({
        body: req.body.body,
        title: req.body.title,
        subTitle: req.body.subTitle,
        user: user.toObject(),
        banner: req.body.banner,
      });

      await post.save();

      user.posts?.push(post.toObject());
      await user.save();

      res.status(201).send(post);
    } catch (er) {
      console.log(er);
      res.status(400).send(er);
    }
  }
);

export { router as newPostRouter };
