import { Router } from "express";

//routes
import usersRouter from "./users";
import invalidRouter from "./invalid";

const router = Router()

router.use("/users", usersRouter)
router.use("*", invalidRouter)



export default router