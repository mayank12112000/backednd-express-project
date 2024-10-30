import dotenv from 'dotenv';
import express from "express"
import connectDB from './db/index.js';

dotenv.config({path:"/.env"})

const app = express()

connectDB()


/**
  
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