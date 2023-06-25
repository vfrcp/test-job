import {Request, Response, NextFunction} from "express";
import Tokens from "../../models/auth";
import UserDB from "../../models/db/classes/user";
import CustomError from "../../models/errors";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenA = req.headers?.authorization
    const tokenR = req.cookies?.Authorization
    if(tokenA && tokenR) {
      const check = Tokens.validate(tokenA.substring(7), tokenR)
      if(check.status === "normal" && check.data){
      const {id, name, role} = check.data
      req.customAuthData = {id, name, role}
    }else if(check.status === "expired" && check.data) {
      const {id, name, role} = check.data
      const token = await UserDB.getAuthToken(check.data.id)
      if(token !== check.tokenR || token === null) throw CustomError.authInvalid("There is a problem with authorization.") 
      const newTokens = Tokens.create({id, name, role})
      await UserDB.setAuthToken(check.data.id, newTokens.tokenR)
      Tokens.set(res, newTokens.tokenA, newTokens.tokenR)
      req.customAuthData = {id, name, role}
    } else {
      throw ""
    }
    }
  } catch (err) {
    Tokens.clear(res)
  } finally {
    next()
  }
}
