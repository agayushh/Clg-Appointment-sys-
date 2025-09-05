import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller";

const UserRouter = express.Router();

UserRouter.get("/", loginUser);
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
export { UserRouter };

