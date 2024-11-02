import cookieParser from 'cookie-parser';
import express  from 'express';
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.emitWarning.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"})) // it allows json 

app.use(express.urlencoded({extended:true,limit:"16kb"})) // extended allow to nesting the payload

app.use(express.static("public")) // for public static asset

app.use(cookieParser())

// routes import
import userRouter from './routes/user.routes.js';

// routes declaration
app.use("/api/v1/users",userRouter)
export {app}