import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";


const globalErrorHandlers = (err:HttpError, req: Request, res: Response, next:NextFunction)=>{
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message : err.message,
        errorStack: config.env == "Development" ? err.stack : ''
    });
    next();
}

export default globalErrorHandlers;