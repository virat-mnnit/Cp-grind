import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided for upload.");
      return null;
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath);

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);

    // Return the secure URL of the uploaded file
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);

    // Attempt to clean up the local file if it exists
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (cleanupError) {
      console.error("Error deleting local file:", cleanupError.message);
    }

    return null;
  }
};

