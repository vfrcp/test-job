import { Router, Request, Response } from "express";
import { IResponse } from "../../types";

const router = Router()

router.all("*", (req: Request, res: Response<IResponse>) => {
  res.status(404)
  res.send({status: "error", message: "This page don't exist", body: null})
})

export default router