import { UserModal } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asycnHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';


export const verifyJWT = asycnHandler( async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","") // header in case we do not have cookie like in mobile application
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedTokenInfo =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await UserModal.findById(decodedTokenInfo?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
    
        req.user = user
        next()
    } catch (error) {
        console.warn("error encountered on verifying jwt token")
        throw new ApiError(401,"token verification gone wrong")
    }
})
