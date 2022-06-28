import express from "express";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

router.post("/api/log", (req, res) => {
  console.log("log" ,req.body);
  res.status(200).send({});
});

export { router as logRouter };
