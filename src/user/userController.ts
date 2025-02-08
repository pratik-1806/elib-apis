import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User already exists");
      next(error);
    }
  } catch (err) {
    return next(createHttpError(500, `Error while getting user: ${err}`));
  }

  //hashed password

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    //token generation

    const token = sign({ sub: newUser._id }, config.secretKey as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(400, `Error while creating user ${err}`));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) =>{
    const {email, password } = req.body;

    if(!email || !password){
        return next(createHttpError(400, "All fields are required"))
    }

    const user = await userModel.findOne({email});

    if(!user){
        return next(createHttpError(404, "User not found"))
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return next( createHttpError(401, "Username or Password incorrect"))
    }

    try{
        const token = sign({ sub: user._id }, config.secretKey as string, {
            expiresIn: "7d",
          });
      
          res.status(200).json({ accessToken: token });

    }catch(err){
        return next(createHttpError(400, `Error while creating token: ${err}`));

    }


}

export { createUser ,loginUser};
