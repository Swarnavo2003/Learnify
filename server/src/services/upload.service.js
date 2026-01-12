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

export const uploadVideo = async (
  videoPath,
  folder = "learnify/course-videos"
) => {
  try {
    console.log(videoPath);
    const result = await cloudinary.uploader.upload(videoPath, {
      folder,
      resource_type: "video",
      chunk_size: 6000000,
    });
    logger.info("Video uploaded to Cloudinary: " + result.secure_url);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    };
  } catch (error) {
    logger.error("Cloudinary video upload error: " + error.message);
    throw new Error("Video upload failed: " + error.message);
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

export const deleteVideo = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    logger.info("Video deleted from Cloudinary: " + publicId);
  } catch (error) {
    logger.error("Cloudinary video deletion error: " + error.message);
    throw new Error("Video deletion failed: " + error.message);
  }
};
