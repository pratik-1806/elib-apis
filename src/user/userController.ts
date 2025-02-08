import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";


const createUser =async (req: Request,res: Response, next: NextFunction)=>{
    
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    const user = await userModel.findOne({email})

    if(user){
        const error = createHttpError(400, "User already exists");
        next(error);
    }

    //hashed password

    const hashedPassword = bcrypt.hash(password, 10);
    
   res.json({message: "created"})
}



export {createUser};
