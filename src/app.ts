import express from "express"
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import userRoutes from "./user/userRotes";

const app = express();


//routes

app.use('/api/users',userRoutes)

//Global error handling 

app.use(globalErrorHandlers)


export default app;