import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({path:"/.env"})
console.log("PORT from .env:", process.env.PORT);

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8080,()=>{
        console.log("server is running at port:",process.env.PORT || 8080)
    })
})
.catch((err)=>{
    console.warn("Mongo db connection failed !! ERROR:",err);
    
})
/**
other way to achieve mongodb connection
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error:",error)
        })
        app.listen(process.env.PORT,()=>{
            console.log("app is listing on,",process.env.PORT)
        })
    } catch (error) {
        console.error("database connectivty issue:",error)
        throw error
    }
})()
*/