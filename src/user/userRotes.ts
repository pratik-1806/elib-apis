import express from "express";
import { createUser } from "./userController";



const userRoutes = express.Router();

//Routes

userRoutes.post('/register', createUser)


export default userRoutes;