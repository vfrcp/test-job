import { JwtPayload } from "jsonwebtoken";
import { roles } from "../db/entities/user/types";

export interface authData {
  name: string
  id: string
  role: roles
}

export type jwtAuthPayload = JwtPayload & authData

export interface ITokensStatus {
  status: string,
  tokenA: string,
  tokenR: string,
  data: null | jwtAuthPayload
}


declare global {
  namespace Express {
    interface Request {
      customAuthData?: authData
    }
  }
}