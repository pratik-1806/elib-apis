import mongoose from "mongoose";
import { config } from "./config";


const connectDB = async()=>{
    console.log(config.databaseUrl)

    mongoose.connect(config.databaseUrl as string).then(()=>{
        console.log("Connected to DB")
    }).catch((err)=>{
        console.log(`error while connecting= ${err.message}`)
        process.exit(1);
    })
}

export default connectDB;