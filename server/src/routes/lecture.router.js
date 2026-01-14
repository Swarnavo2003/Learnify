import express from "express";
import { createLecture } from "../controllers/lecture.controller.js";
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

export default router;
