import Comment from "../models/comment.model.js";
import Lecture from "../models/lecture.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  commendCreationSchema,
  commendtUpdationSchema,
} from "../validations/index.js";

export const createComment = asyncHandler(async (req, res, next) => {
  const { lectureId } = req.params;
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  const commentCreationData = commendCreationSchema.safeParse(req.body);
  if (!commentCreationData.success) {
    throw new ApiError(
      400,
      "Validation Error",
      commentCreationData.error.issues.map((issue) => issue.message).join(", "),
    );
  }

  const { comment } = commentCreationData.data;
  const newComment = await Comment.create({
    userId: req.user._id,
    moduleId: module._id,
    comment,
  });

  lecture.comment.push(newComment._id);
  await lecture.save();

  return res
    .status(200)
    .json(new ApiResponse(200, module, "Comment created successfully"));
});

export const getAllCommentsByLectureId = asyncHandler(
  async (req, res, next) => {
    const { lectureId } = req.params;
    const comments = await Comment.find({ lectureId });

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
  },
);

export const updateCommentByCommenId = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    throw new ApiError(404, "Comment not found");
  }

  const commentUpdationData = commendtUpdationSchema.safeParse(req.body);
  if (!commentUpdationData.success) {
    throw new ApiError(
      400,
      "Validation Error",
      commentUpdationData.error.issues.map((issue) => issue.message).join(", "),
    );
  }

  const { comment } = commentUpdationData.data;

  existingComment.comment = comment;
  await existingComment.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, existingComment, "Comment updated successfully"),
    );
});
