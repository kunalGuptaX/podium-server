import express, { Request, Response } from "express";
import { body } from "express-validator";
import { currentUser } from "../../middlewares/current-user";
import { validateRequest } from "../../middlewares/validate-request";
import { Comment } from "../../models/comment";
import { Post } from "../../models/post";
import { User } from "../../models/user";

const router = express.Router();

router.post(
  "/api/comments/new",
  currentUser,
  [
    body("postId").isString().isMongoId().withMessage("Invalid post id"),
    body("message").isString().withMessage("Invalid comment"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);
    const post = await Post.findById(req.body.postId);

    if (!user || !post) {
      return;
    }

    const comment = Comment.build({
      message: req.body.message,
      post: post.toObject(),
      user: user.toObject(),
    });

    await comment.save();

    post.comments?.push(comment);
    await post.save();

    res.status(201).send(comment);
  }
);

export { router as newCommentRouter };
