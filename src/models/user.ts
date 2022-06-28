import mongoose, { ObjectId, Schema } from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  firstName: string;
  lastName: string;
  displayPicture?: string;
  about?: string;
  email: string;
  password: string;
  posts?: ObjectId[];
}

// An interface that describes the properties
// that a User Model has
export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  displayPicture?: string;
  about?: string;
  email: string;
  password: string;
  posts?: ObjectId[];
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    displayPicture: {
      type: String,
    },
    about: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
