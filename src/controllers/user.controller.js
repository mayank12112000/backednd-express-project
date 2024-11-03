import { asycnHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModal } from "../models/user.model.js";
import { uploadOnClouudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registeruser = asycnHandler(async (req, res) => {
  // get required user details from client
  const { fullName, email, userNme, password } = req.body;
  console.log(fullName, email, userNme, password);

  // validation of fields - not empty
  if (
    [fullName, email, password, userNme].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are requried");
  }

  // check if user already exists
  const existedUser = UserModal.findOne({
    $or: [{ userNme }, { email }],
  });
  console.log("User alreay existed found", existedUser);
  if (existedUser) {
    throw new ApiError(409, "User with  email/user name already exists");
  }

  // check for images, check for avatar(required)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
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
    userName: userNme.toLowerCase(),
  });

  // remove password and refresh token field from response
  const createdUser = await UserModal.findById(user._id).select(
    "-password -refreshToken" // de select what we do not want, little wierd syntax but this is how it is
  );
  
  // check for user creation
  if (!createdUser) {
    throw new ApiError(503,"something went wrong, user not created, please try again");
  }
  console.log("created user:", createdUser);

  // return response
  return res.status(201).json(new ApiResponse( //    constructor(statusCode,data,message = "success"){
    200,createdUser,"user registered successfully"
  ))

  // statusCode, message="something went wrong",errors=[],stack=""
});

export { registeruser };
