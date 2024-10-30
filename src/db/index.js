import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`)
        console.log("\n mongodb connected !! db host:",connectionInstance.connection.host)
    } catch (error) {
        console.warn("cannot connect to mongo db, error:",error);
        process.exit(1)
    }
}
export default connectDB;