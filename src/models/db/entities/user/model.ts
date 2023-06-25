import { model } from "mongoose";
import { IUser } from "./types";
import { userSchema } from "./schema";

export const UserModel = model<IUser>("user", userSchema)