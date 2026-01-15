import express from "express";
import {
  createLecture,
  getLectureByLectureId,
  getLecturesByModuleId,
} from "../controllers/lecture.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";
import videoUpload from "../middleware/video-upload.middleware.js";

const router = express.Router();

router.post(
  "/create-lecture",
  protectedRoute,
  adminRoute,
  videoUpload.single("video"),
  createLecture
);

router.get("/get-lectures/:moduleId", protectedRoute, getLecturesByModuleId);

router.get("/get-lecture/:lectureId", protectedRoute, getLectureByLectureId);

export default router;
