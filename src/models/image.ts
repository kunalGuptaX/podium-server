import mongoose from "mongoose";

interface ImageAttrs {
  data: Buffer;
  contentType: string;
  name: string;
}

// An interface that describes the properties
// that a User Model has
export interface ImageModel extends mongoose.Model<ImageDoc> {
  build(attrs: ImageAttrs): ImageDoc;
}

// An interface that describes the properties
// that a User Document has
export interface ImageDoc extends mongoose.Document {
  data: Buffer;
  contentType: string;
  name: string;
}

const imageSchema = new mongoose.Schema(
  {
    data: Buffer,
    contentType: String,
    name: String,
  },
  { timestamps: true }
);

export const ImageModel = mongoose.model<ImageDoc, ImageModel>(
  "images",
  imageSchema
);
