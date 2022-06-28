import jwt from "jsonwebtoken";
import { UserDoc } from "../models/user";

export default (user: UserDoc) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN!,
  );
};
