import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import  { verify } from "jsonwebtoken"
import { config } from "../config/config";

export interface AuthRequest extends Request{
    userId : string;
}

const authenticate =(req : Request, res : Response, next: NextFunction)=>{

    const token = req.header('Authorization');

    if(!token){
        return next(createHttpError(401, "You Are Unauthorized"))
    }

    const parsedToken = token.split(" ")[1];

    try{
        const decode = verify(parsedToken, config.secretKey as string)

    const _req =req as AuthRequest;

    _req.userId = decode.sub as string;

    next();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }catch(err){
     return next(createHttpError(401, "Token Expired"))
    }

    

}

export default authenticate;