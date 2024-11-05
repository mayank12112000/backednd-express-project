import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModal } from "../models/user.model.js";
import { uploadOnClouudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await UserModal.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    //save accesstoken and refresh token to db
    user.refreshToken = refreshToken;
    user.accessToken = accessToken
    await user.save({ validateBeforeSave: false }); // we are not making validation for other fields of user like username password etc
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(503, "something got wrong while generating tokens");
  }
};

const registeruser = asyncHandler(async (req, res) => {
  // get required user details from client
  const { fullName, email, userName, password } = req.body;
  console.log(fullName, email, userName, password);

  // validation of fields - not empty
  if (
    [fullName, email, password, userName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are requried");
  }

  // check if user already exists
  const existedUser = await UserModal.findOne({
    $or: [{ userName }, { email }],
  });
  console.log("User alreay existed found", existedUser);
  if (existedUser) {
    throw new ApiError(409, "User with  email/user name already exists");
  }

  // check for images, check for avatar(required)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage && req.files.coverImage.length > 0)
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }
  console.log(req.files);

  // upload to cloudinary
  const avatar = await uploadOnClouudinary(avatarLocalPath);
  const coverImage = await uploadOnClouudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(503, "avatar file failed to upload");
  }

  // create user objects - create entry in db
  const user = await UserModal.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  // remove password and refresh token field from response
  const createdUser = await UserModal.findById(user._id).select(
    "-password -refreshToken" // de select what we do not want, little wierd syntax but this is how it is
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(
      503,
      "something went wrong, user not created, please try again"
    );
  } else {
    console.log("created user:", createdUser);
  }

  // return response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "user registered successfully") //    constructor(statusCode,data,message = "success"){
  );

  // statusCode, message="something went wrong",errors=[],stack=""
});

// login user
const loginUser = asyncHandler(async (req, res, next) => {
  // req body
  const { email, password, userName } = req.body;
  // username or email for login
  if (!userName || !email) {
    throw new ApiError(400, "username or email is required");
  }

  // find the user
  const user = await UserModal.findOne({
    $or: [{ userName }, { email }],
  });
  // password check
  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password incorrect");
  }
  // access and refresh token
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user?._id);

  const loggedinUser = await UserModal.findById(user._id).select("-password -refreshToken")

  // send cookie
  const options = {
    httpOnly : true,
    secure : true
  }

  return  res
  .status(200)
  .cookie("acccessToken",accessToken, options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,{user:loggedinUser,accessToken,refreshToken},"user logged in successfully")
  )

});

const logoutUser = asyncHandler( async (req,res,next)=>{
    // fetch user from token and clear token in db
    await UserModal.findByIdAndUpdate(
        req.user?._id,{
            $set:{
                refreshToken:undefined
            }
        })
    // clear cookie
    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refresToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
    // reset fresher & access token 
})

const refreshAccessToken = asyncHandler( async(req,res,next)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const userFound = await UserModal.findById(decodedToken?._id)
        if(!userFound){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== userFound?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {newAccessToken,newRefreshToken} = await generateAccessandRefreshTokens(userFound._id)
    
        return res.status(200)
        .cookie("accessToken",newAccessToken)
        .cookie("refreshToken",newRefreshToken)
        .json(
            new ApiResponse(200,{newAccessToken,newRefreshToken},"access token refreshed")
        )
    } catch (error) {
        throw new ApiError(503,error?.message || "invalid refresh token")
    }
})

export { registeruser, loginUser, logoutUser, refreshAccessToken };