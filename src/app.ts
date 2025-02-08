import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHandlers from "./middlewares/globalerrorhandlers";

const app = express();


//routes

app.use('/',(req,res, next)=>{

    const error = createHttpError(400, "something went wrong");

    throw error;
    // res.json({message: "Welcome to elib apis"})
})

//Global error handling 

app.use(globalErrorHandlers)


export default app;