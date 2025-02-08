import mongoose from "mongoose";
import { config } from "./config";


const connectDB = async()=>{

    mongoose.connect(config.databaseUrl as string).then(()=>{
        console.log("Connected to DB")
    }).catch((err)=>{
        console.log(`error while connecting ${err}`)
        process.exit(1);
    })
}

export default connectDB;