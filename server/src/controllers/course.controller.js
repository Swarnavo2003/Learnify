import logger from "../config/logger.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { getKeywordsFromAI } from "../services/ai.service.js";
import { uploadImage } from "../services/upload.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { prompts } from "../utils/propmts.js";
import { courseCreationSchema } from "../validations/index.js";

export const createCourse = asyncHandler(async (req, res, next) => {
  const courseCreationData = courseCreationSchema.safeParse(req.body);
  const thumbnail = req.file;
  if (!thumbnail) {
    logger.error("Thumbnail image is required for course creation");
    throw new ApiError(400, "Thumbnail image is required");
  }

  if (!courseCreationData.success) {
    throw new ApiError(
      400,
      "Validation Error",
      courseCreationData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { title, description, amount } = courseCreationData.data;

  const base64 = `data:${thumbnail.mimetype};base64,${thumbnail.buffer.toString(
    "base64"
  )}`;

  const { url, publicId } = await uploadImage(base64, "course-thumbnails");

  const course = await Course.create({
    userId: req.user._id,
    title,
    description,
    amount: Number(amount),
    thumbnail: url,
    thumbnailPublicId: publicId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

export const getCourse = asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  if (!search || !search.trim()) {
    const allCourses = await Course.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { allCourses, count: allCourses.length },
          "Courses fetched successfully"
        )
      );
  }

  const prompt = prompts.getCoursePrompt(search);

  const keyword = await getKeywordsFromAI(prompt);
  logger.info(`Extracted keyword from AI: ${keyword}`);

  const regex = new RegExp(keyword, "i");
  const courses = await Course.find({
    $or: [
      { title: { $regex: regex, $exists: true } },
      { description: { $regex: regex, $exists: true } },
    ],
  }).sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { courses, count: courses.length, keyword },
        "Courses fetched successfully"
      )
    );
});

export const getSingleCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, course, "Course fetched successfully"));
});

export const getAllPurchasedCourses = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("purchasedCourse");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const purchasedCourses = user.purchasedCourse;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        purchasedCourses,
        "Purchased courses fetched successfully"
      )
    );
});

export const getPurchasedCourse = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  const user = await User.findById(userId).populate("purchasedCourse");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const purchasedCourse = user.purchasedCourse.find((course) =>
    course._id.equals(courseId)
  );

  if (!purchasedCourse) {
    throw new ApiError(404, "Purchased course not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, purchasedCourse, "Purchased course fetched"));
});
