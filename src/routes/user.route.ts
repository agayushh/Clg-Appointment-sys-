import express from "express";
import { registerUser } from "../controllers/user.controller";

const UserRouter = express.Router();

UserRouter.get("/", registerUser);
UserRouter.post("/register", registerUser);
UserRouter.post("/login", registerUser);
export { UserRouter };

