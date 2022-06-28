import mongoose, { ObjectId, Schema } from "mongoose";

// An interface that describes the properties
// that are requried to create a new User
interface CommentAttrs {
  user: ObjectId;
  post: ObjectId;
  message: string;
  createdAt?: Date;
}

// An interface that describes the properties
// that a User Model has
export interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

// An interface that describes the properties
// that a User Document has
export interface CommentDoc extends mongoose.Document {
  user: ObjectId;
  post: ObjectId;
  message: string;
  createdAt?: Date;
}

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      default: new Date(),
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
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

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment };
