import express from "express";
import {
  createComment,
  getAllCommentsByLectureId,
  updateCommentByCommenId,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create-comment/:lectureId", createComment);

router.post("/get-comments/:lectureId", getAllCommentsByLectureId);

router.put("/update-comment/:commentId", updateCommentByCommenId);

export default router;
