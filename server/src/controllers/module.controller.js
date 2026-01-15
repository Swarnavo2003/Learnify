import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import Module from "../models/module.model.js";
import { deleteVideo } from "../services/upload.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  moduleCreationSchema,
  moduleUpdationSchema,
} from "../validations/index.js";

export const createModule = asyncHandler(async (req, res, next) => {
  const moduleCreationData = moduleCreationSchema.safeParse(req.body);

  if (!moduleCreationData.success) {
    throw new ApiError(
      400,
      "Validation Error",
      moduleCreationData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { courseId, title } = moduleCreationData.data;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const module = await Module.create({
    courseId,
    title,
  });

  course.modules.push(module._id);
  await course.save();

  return res
    .status(201)
    .json(new ApiResponse(201, module, "Module created successfully"));
});

export const getModulesByCourseId = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const modules = await Module.find({ courseId }).populate("lectures");
  return res
    .status(200)
    .json(new ApiResponse(200, modules, "Modules fetched successfully"));
});

export const getModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const module = await Module.findById(moduleId).populate("lectures");
  if (!module) {
    throw new ApiError(404, "Module not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, module, "Module fetched successfully"));
});

export const deleteModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const module = await Module.findByIdAndDelete(moduleId);
  if (!module) {
    throw new ApiError(404, "Module not found");
  }

  if (module.lectures.length > 0) {
    module.lectures.map(async (lecture) => {
      await deleteVideo(lecture.videoPublicId);
    });

    module.lectures.map(async (lecture) => {
      await Lecture.findByIdAndDelete(lecture._id);
    });
  }

  const course = await Course.findById(module.courseId);
  course.modules.pull(moduleId);
  await course.save();

  return res
    .status(200)
    .json(new ApiResponse(200, module, "Module deleted successfully"));
});

export const updateModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const module = await Module.findById(moduleId);
  if (!module) {
    throw new ApiError(404, "Module not found");
  }

  const moduleUpdationData = moduleUpdationSchema.safeParse(req.body);
  if (!moduleUpdationData.success) {
    throw new ApiError(
      400,
      "Validation Error",
      moduleUpdationData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { title } = moduleUpdationData.data;

  module.title = title;
  await module.save();

  return res
    .status(200)
    .json(new ApiResponse(200, module, "Module updated successfully"));
});
