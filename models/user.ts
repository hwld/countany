import { Schema, Model, Document } from "mongoose";
import { model } from "../util/mongodb";

// next-authが自動的に作成するUserに手動でスキーマを定義している。
interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String },
  image: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const UserModel: Model<IUser> = model("User", UserSchema, "users");
