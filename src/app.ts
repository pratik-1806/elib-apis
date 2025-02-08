import express from "express"
import cors from "cors"
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import userRoutes from "./user/userRotes";
import bookRouter from "./book/bookRoutes";
import { config } from "./config/config";

const app = express();

//cors setup
app.use(
    cors({
        origin: config.frontend_domain
    })
)

//json parse
app.use(express.json())


//routes

app.use('/api/users',userRoutes)
app.use("/api/books", bookRouter)

//Global error handling 

app.use(globalErrorHandlers)


export default app;