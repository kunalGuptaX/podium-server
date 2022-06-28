import mongoose, { ObjectId, Schema } from "mongoose";
import { CommentDoc } from "./comment";
import { UserDoc } from "./user";

// An interface that describes the properties
// that are requried to create a new User
interface PostAttrs {
  user: ObjectId;
  comments?: CommentDoc[];
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  subTitle: string;
  banner: string;
  body: string;
  tags?: string[];
}

// An interface that describes the properties
// that a User Model has
export interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

// An interface that describes the properties
// that a User Document has
export interface PostDoc extends mongoose.Document {
  user: ObjectId;
  comments?: CommentDoc[];
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  subTitle: string;
  banner: string;
  body: string;
  tags?: string[];
}

const postSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: {
      type: Schema.Types.Date,
      default: new Date(),
    },
    updatedAt: {
      type: Schema.Types.Date,
      default: new Date(),
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// postSchema.pre("save", async function (done) {
//   if (this.isModified("password")) {
//     const hashed = await Password.toHash(this.get("password"));
//     this.set("password", hashed);
//   }
//   done();
// });

postSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);

export { Post };
