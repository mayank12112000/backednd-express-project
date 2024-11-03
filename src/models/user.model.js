import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index:true
      },
    avatar:{
        type:String, // cloudnary url
        required:true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"VideoModel"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps: true });

userSchema.pre("save",async function(next){
    if(this.isModified("password")){ //only when password  is different then we encrypt
        this.password = await bcrypt.hash(this.password,10) // 10 hash round
    }
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    console.log("user password:",this.password) // removie
    return await bcrypt.compare(password,this.password) // will return boolean
}

userSchema.methods.generateAccessToken =  function() {
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.userName,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const UserModal = mongoose.model("User", userSchema);
