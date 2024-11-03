import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system of node
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.COUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnClouudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded
    console.log("response of cloudinary upload::", response);
    console.log(
      "file uploaded successfully on cloudinary and url is :",
      response.url
    );
    fs.unlinkSync(localFilePath) // remove the local file storing in public/temp
    return response;
  } catch (error) {
    fs.unlink(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    console.warn(error);
    return null;
  }
};

export { uploadOnClouudinary };
