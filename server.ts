
import app from "./src/app"
import { config } from "./src/config/config";

const startServer=()=>{

    const PORT = config.port || 3000;
    
    app.listen(PORT, ()=>{
        console.log(`app is listening on port ${PORT}`)
    })
}

startServer();