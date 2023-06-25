import { Document } from "mongoose"

export type roles = "boss" | "regular" | "administrator" 

export interface IUser extends Document {
  name: string
  password: string
  role: roles
  bossId?: string
  subordinates?: IUser[]
  authToken: string | null
} 