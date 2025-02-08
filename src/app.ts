import express from "express";

const app = express();


//routes

app.use('/',(req,res, next)=>{
    res.json({message: "Welcome to elib apis"})
})


export default app;