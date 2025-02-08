import express from "express"
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import userRoutes from "./user/userRotes";
import bookRouter from "./book/bookRoutes";

const app = express();

//json parse
app.use(express.json())


//routes

app.use('/api/users',userRoutes)
app.use("/api/book", bookRouter)

//Global error handling 

app.use(globalErrorHandlers)


export default app;