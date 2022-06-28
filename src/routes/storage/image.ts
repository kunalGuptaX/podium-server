import express from "express";
import multer from "multer";
// import { upload } from "../../app";
import { BadRequestError } from "../../errors/bad-request-error";
import { ImageModel } from "../../models/image";

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const storage = multer.memoryStorage();

router.post(
  "/api/upload/image",
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    if (!req.file?.buffer) {
      throw new BadRequestError("Invalid file");
    }
    var fullUrl = req.protocol + '://' + req.get('host') + req.baseUrl;

    const image = {
      // @ts-ignore /
      data: Buffer.from(req.file.buffer, "base64"),
      contentType: req.file.mimetype,
      name: req.file.originalname,
    };

    const savedImage = await ImageModel.create(image);
    const foundImage = await ImageModel.findById(savedImage?._id).lean().exec();
    res.status(200).send({
        url: `${fullUrl}/api/get/image/${foundImage?._id}`
    });
  }
);

router.get("/api/get/image/:id", async (req, res, next) => {
  const { id: _id } = req.params;
  // If you dont use lean(), you wont decode image as base64
  const image = await ImageModel.findOne({ _id });
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": image?.data.length,
  });
  res.end(image!.data);
});

export { router as imageUploadRouter };
