import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String, //cloudnary url
        required:true,
    },
    thumbnail:{
        type:String, 
        required:true
    },
    title:{
        type:String, 
        required:true
    },
    description:{
        type:String, 
        required:true
    },
    duration:{
        type:Number, // cloudnary
        required:true
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"UserModal"
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const VideoModel = mongoose.model("Video",videoSchema)