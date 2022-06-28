import jwt from "jsonwebtoken";
import config from "../config";
import { UserDoc } from "../models/user";

export default (user: UserDoc) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN!,
    {
      expiresIn: config.accessTokenExpires,
    }
  );
};
