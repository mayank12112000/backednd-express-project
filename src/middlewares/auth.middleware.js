import { UserModal } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // fixed typo
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token for verification:", token);
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await UserModal.findById(decodedTokenInfo?._id).select("-password -refreshToken");
        
        if (!user) {
            throw new ApiError(401, "Invalid access token: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.warn("Error encountered on verifying JWT token:", error.message);
        next(new ApiError(401, "Token verification failed"));
    }
});
