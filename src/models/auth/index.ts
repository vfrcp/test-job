import JWT from "jsonwebtoken";
import { Response } from "express";
import { authData, jwtAuthPayload } from "./types";
import { ITokensStatus } from "./types";
import { config } from "../../config";

class Tokens {
  create (data: authData) {
    return {
      tokenA: JWT.sign(data, config.auth.secretA, {
        expiresIn: "5m"
      }),
      tokenR: JWT.sign(data, config.auth.secretR, {
        expiresIn: "30 days"
      })

    }
  }
  _isEqual (tokenAPayload: jwtAuthPayload, tokenRPayload: jwtAuthPayload) {
    try{
      if(
        tokenAPayload.name === tokenRPayload.name &&
        tokenAPayload.id === tokenRPayload.id && tokenAPayload.role === tokenRPayload.role
        ) {
        return true
      } else return false
    }catch (err) {
      return false
    }
  }
  validate (tokenA: string, tokenR: string) {
    try{
      const tokensStatus: ITokensStatus = {
        status: "normal",
        tokenA,
        tokenR,
        data: null
      }
      //If verify not valid. it's throw error
      const tokenAData = JWT.verify(tokenA, config.auth.secretA) as jwtAuthPayload
      const tokenRData = JWT.verify(tokenR, config.auth.secretR) as jwtAuthPayload
      if(!this._isEqual(tokenAData, tokenRData)) {
        tokensStatus.status = "invalid"
      }else {
        tokensStatus.data = tokenAData
      }
      return tokensStatus
    }catch (err) {
      const tokensStatus: ITokensStatus = {
        status: "expired",
        tokenA,
        tokenR,
        data: null
      }
      let tokenRData: jwtAuthPayload
      try{
        tokenRData = JWT.verify(tokenR, config.auth.secretR) as jwtAuthPayload
      }catch (err) {
        tokensStatus.status = "fullExpiresOrMissing"
        return tokensStatus
      }
      const tokenAData = JWT.decode(tokenA) as jwtAuthPayload | null
      if(!tokenAData || !this._isEqual(tokenAData, tokenRData)) tokensStatus.status = "invalid"
      else if(tokenAData) tokensStatus.data = tokenAData
      return tokensStatus
    }
  }
  set (res: Response, tokenA: string, tokenR: string) {
    res.cookie("Authorization", tokenR, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    })
    res.header("Authorization", "Bearer " + tokenA)
  }
  clear (res: Response) {
    res.clearCookie("Authorization")
  }
}


export default new Tokens()