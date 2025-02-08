import { config as conf } from "dotenv";
conf();
const _config ={

    port: process.env.PORT,

    databaseUrl : process.env.MONGO_CONNECTION_STRING,

    env : process.env.ENV,

    secretKey : process.env.SECRET_KEY

}

export const config =Object.freeze(_config) ;