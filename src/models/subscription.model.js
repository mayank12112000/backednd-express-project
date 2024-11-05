import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const subscriptionModel= mongoose.model("Subscription",subscriptionSchema)