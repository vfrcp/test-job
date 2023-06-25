import { Router } from "express";
import UserController from "../../controllers/users";

const router = Router()

router.get("/", UserController.getUsers)
router.post("/changeBoss", UserController.changeBoss)
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.delete("/logout", UserController.logout)

export default router