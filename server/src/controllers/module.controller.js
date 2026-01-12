import Course from "../models/course.model.js";
import Module from "../models/module.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { moduleCreationSchema } from "../validations/index.js";

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

  const video = req.file;
  if (!video) {
    logger.error("Video is required for module creation");
    throw new ApiError(400, "Video is required");
  }

  const module = await Module.create({
    courseId,
    title,
    video: req.file.path,
    videoPublicId: req.file.filename,
    videoDuration: req.file.duration || 0,
  });

  course.modules.push(module._id);
  await course.save();

  return res
    .status(201)
    .json(new ApiResponse(201, module, "Module created successfully"));
});
