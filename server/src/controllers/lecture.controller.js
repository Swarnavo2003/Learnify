import Lecture from "../models/lecture.model.js";
import Module from "../models/module.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { lectureCreationSchema } from "../validations/index.js";

export const createLecture = asyncHandler(async (req, res, next) => {
  const lectureCreationData = lectureCreationSchema.safeParse(req.body);

  if (!lectureCreationData.success) {
    throw new ApiError(
      400,
      "Validation Error",
      lectureCreationData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { moduleId, title } = lectureCreationData.data;
  const lecture = await Lecture.create({
    moduleId,
    title,
    video: req.file.path,
    videoPublicId: req.file.filename,
    videoDuration: req.file.duration || 0,
  });

  const module = await Module.findById(moduleId);
  module.lectures.push(lecture._id);
  await module.save();

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture created successfully"));
});

export const getLecturesByModuleId = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  const lectures = await Lecture.find({ moduleId })
    .sort({ createdAt: -1 })
    .populate("comment");

  if (!lectures) {
    throw new ApiError(404, "Lectures not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lectures, "Lectures fetched successfully"));
});

export const getLectureByLectureId = asyncHandler(async (req, res, next) => {
  const { lectureId } = req.params;
  const lecture = await Lecture.findById(lectureId).populate("comment");

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture fetched successfully"));
});
