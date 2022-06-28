import mongoose from "mongoose";
require("dotenv").config();

import { app } from "./app";
import logger from "./helpers/logger";

const start = async () => {
  if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger("Connected to MongoDb");
  } catch (err) {
    logger(err);
    console.error(err);
  }

  app.listen(4000, () => {
    logger("Listening on port 4000");
  });
};

start();
