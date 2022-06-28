import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { newPostRouter } from "./routes/posts/new";
import { newCommentRouter } from "./routes/comments/new";
import { getPostRouter } from "./routes/posts/get";
import { logRouter } from "./routes/log";
import { refreshTokenRouter } from "./routes/refresh-token";
import multer from "multer";
import { imageUploadRouter } from "./routes/storage/image";
import { updateUserRouter } from "./routes/update-user";
import cors from "cors";
import { userByIdRouter } from "./routes/getUserById";
const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(json({limit: '50mb'}));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(newPostRouter);
app.use(newCommentRouter);
app.use(getPostRouter);
app.use(logRouter);
app.use(refreshTokenRouter);
app.use(imageUploadRouter);
app.use(updateUserRouter);
app.use(userByIdRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
