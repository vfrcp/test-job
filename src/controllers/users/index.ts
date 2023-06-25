import { Request, Response } from "express";
import Tokens from "../../models/auth/index"
import Utils from "../utils";
import UserDB from "../../models/db/classes/user";
import { IBossChange, ILogin, IRegister } from "./types";

class UsersController {

  async getUsers (req: Request, res: Response) {
    try {
      Utils.isUserAuth(req)
      if(req.customAuthData?.role === "administrator") {
        Utils.sendSuccessResponse(res, await UserDB.getAllUsers())
      } else {
        //Ts ignore because if id do not exist. Utils.isUserAuth throw error
        //@ts-ignore
        Utils.sendSuccessResponse(res, await UserDB.getSubordinates(req.customAuthData.id))
      } 
    } catch (err: any) { 
      Utils.sendWrongResponse(res, err)
    }
  }
  async login (req: Request<{}, {}, ILogin>, res: Response) {
    try {
      const reqFields = [{name: "name", type: "string"}, {name: "password", type: "string"}]
      Utils.validateBodyFields(req.body, reqFields)
      const user = await UserDB.login(req.body)
      const tokens = Tokens.create({id: user.id, name: user.name, role: user.role})
      await UserDB.setAuthToken(user.id, tokens.tokenR)
      Tokens.set(res, tokens.tokenA, tokens.tokenR)
      Utils.sendSuccessResponse(res, user)
    } catch (err: any) {
      Utils.sendWrongResponse(res, err)
    }
  }
  async register (req: Request<{}, {}, IRegister>, res: Response) {
    try {
      const reqFields = [{name: "name", type: "string"}, {name: "password", type: "string"}, {name: "role", type: "string"}] 
      Utils.validateBodyFields(req.body, reqFields)
      Utils.isRoleValid(req.body.role)
      if(req.body.role === "administrator") {
        Utils.sendSuccessResponse(res, await UserDB.registerAdmin(req.body))
      } else if (req.body.bossId){
        Utils.sendSuccessResponse(res, await UserDB.registerRegular(req.body))
      } else Utils.validateBodyFields(req.body, [{name: "bossId", type: "string"}])
      
    } catch (err: any) {
      Utils.sendWrongResponse(res, err)
    }
  }
  async logout (req: Request, res: Response) {
    try {
      Utils.isUserAuth(req)
      Tokens.clear(res)
      //Ts ignore because if id do not exist. Utils.isUserAuth throw error
      //@ts-ignore
      await UserDB.setAuthToken(req.customAuthData?.id, "")
      Utils.sendSuccessResponse(res)
    } catch (err: any) {
      Utils.sendWrongResponse(res, err)
    }
  }
  async changeBoss (req: Request<{}, {}, IBossChange>, res: Response) {
    try {
      Utils.isUserAuth(req)
      const reqFields = [{name: "newBossId", type: "string"}, {name: "subordinateId", type: "string"}] 
      Utils.validateBodyFields(req.body, reqFields)
      //Ts ignore because if id do not exist. Utils.isUserAuth throw error
      //@ts-ignore
      Utils.sendSuccessResponse(res, await UserDB.changeBoss({...req.body, bossId: req.customAuthData?.id}))
    } catch (err: any) {
      Utils.sendWrongResponse(res, err)
    }
  }
}

export default new UsersController()