import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
const uploadOnCloudinary = async (filePath) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.API_SECRET
  });
  try {
    if (!filePath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader
      .upload(filePath)
    fs.unlinkSync(filePath) // delete the file from the local system
    return uploadResult.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath)
    console.log(error)
  }
}

export default uploadOnCloudinary;