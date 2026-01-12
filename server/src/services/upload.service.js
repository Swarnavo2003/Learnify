import cloudinary from "../config/cloudinary.js";
import logger from "../config/logger.js";

export const uploadImage = async (base64Image, folder = "learnify") => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
    });
    logger.info("Image uploaded to Cloudinary: " + result.secure_url);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    logger.error("Cloudinary upload error: " + error.message);
    throw new Error("Image upload failed: " + error.message);
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info("Image deleted from Cloudinary: " + publicId);
  } catch (error) {
    logger.error("Cloudinary deletion error: " + error.message);
    throw new Error("Image deletion failed: " + error.message);
  }
};
