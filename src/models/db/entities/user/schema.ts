import { Schema } from "mongoose";
import { IUser } from "./types";

export const userSchema = new Schema<IUser>({
  name: {type: String, required: true, unique: true},
  role: {type: String, required: true, default: "regular"},
  password: {type: String, required: true},
  authToken: {type: String, nullable: true},
  bossId: {type: Schema.Types.ObjectId, ref: "user"}
})

userSchema.virtual('subordinates', {
  ref: "user",
  localField: "_id",
  foreignField: "bossId"
});