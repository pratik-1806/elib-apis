import { config as conf } from "dotenv";


const _config ={

    port: process.env.PORT,

    databaseUrl : process.env.MONGO_CONNECTION_STRING,

    env : process.env.ENV,

    secretKey : process.env.SECRET_KEY,

    cloud_name : process.env.CLOUD_NAME,

    api_key : process.env.API_KEY,

    api_secret : process.env.API_SECRET,

    frontend_domain : process.env.FRONTEND_DOMAIN

}

export const config =Object.freeze(_config) ;