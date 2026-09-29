import express from "express";
import { loginUser, registerUser, getAllUsers, deleteUser, demoteToUser, makeAdmin } from "../controllers/userController.js";


const userRouter = express.Router();


userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/list", getAllUsers);
userRouter.delete("/delete/:id", deleteUser);
userRouter.put("/make-admin/:id", makeAdmin);
userRouter.put("/demote-to-user/:id", demoteToUser);



export default userRouter;