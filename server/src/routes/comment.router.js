import express from "express";
import {
  createComment,
  getAllCommentsByLectureId,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create-comment/:lectureId", createComment);

router.post("/get-comments/:lectureId", getAllCommentsByLectureId);

export default router;
