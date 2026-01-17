import express from "express";
import {
  createComment,
  deleteCommentByCommentId,
  getAllCommentsByLectureId,
  updateCommentByCommentId,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create-comment/:lectureId", createComment);

router.post("/get-comments/:lectureId", getAllCommentsByLectureId);

router.put("/update-comment/:commentId", updateCommentByCommentId);

router.delete(
  "/delete-comment/:commentId/lecture/:lectureId",
  deleteCommentByCommentId,
);

export default router;
