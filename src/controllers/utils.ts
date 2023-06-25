import { Request, Response } from "express";
import CustomError  from "../models/errors/index";
import { ICustomError } from "../models/errors/types";
import { IResponse } from "../types";
import Logger from "../models/logger";

class Utils {
  sendWrongResponse (res: Response<IResponse>, err: Error | ICustomError) {
    if(err instanceof CustomError) {
      res.status(err.httpStatus)
      res.send({status: "error", message: err.message, body: null})
    } else {
      try {
        Logger.add(err)
        res.status(500)
        res.send({status: "unexpectedError", message: err.message, body: err})
      } catch (err) {
        //If very unexpected error
        res.send({status: "unexpectedError", message: "This is very unexpected error", body: err})
      }
    } 
  }
  sendSuccessResponse (res: Response<IResponse>, body: any = null ) {
    res.send({status: "success", message: null, body})
  }
  //If req.body don't have field or with wrong type it's throw error
  validateBodyFields (fields: Record<string, any>, reqFields: {name: string, type: string}[], isAcceptedZero: boolean = true) {
    const valuesArr: (string | number)[] = []
    reqFields.forEach(reqField => {
      if(!(reqField.name in fields) || typeof fields[reqField.name] !== reqField.type){
        throw CustomError.reqBodyInvalid(`${reqField.name} field are missing or of the wrong type`)
      }
      valuesArr.push(fields[reqField.name])
    })
    valuesArr.forEach((item, index) => {
      if(!item) throw CustomError.reqBodyInvalid(`The field ${reqFields[index]} cannot be undefined`)
      if(typeof item === "string" && !item) throw CustomError.reqBodyInvalid(`The field ${reqFields[index]} cannot be empty`)
      if(typeof item === "number" && item < (isAcceptedZero? 0: 1)) throw CustomError.reqBodyInvalid(`${isAcceptedZero? "The number must be positive": "The number must be greater than 0"}`)
    })
  } 
  isRoleValid (role: string) {
    switch (role) {
      case "administrator": return
      case "regular": return
      default: throw CustomError.reqBodyInvalid("The role is invalid")
    }
  }
  isUserAuth (req: Request<any>) {
    if(!req.customAuthData?.id) throw CustomError.authInvalid("You are not authorized")
  }
}

export default new Utils()