import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";
import videoUpload from "../middleware/video-upload.middleware.js";
import { createModule } from "../controllers/module.controller.js";

const router = express.Router();

router.post(
  "/create-module",
  protectedRoute,
  adminRoute,
  videoUpload.single("video"),
  createModule
);

export default router;
