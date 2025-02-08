import express from "express";
import { createUser, loginUser} from "./userController";



const userRoutes = express.Router();

//Routes

userRoutes.post('/register', createUser)
userRoutes.post('/login', loginUser)


export default userRoutes;