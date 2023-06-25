import { Router } from "express";
import { authMiddleware } from "./auth";

const router = Router()

router.use(authMiddleware)

export default router