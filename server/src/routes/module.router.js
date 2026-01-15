import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";
import videoUpload from "../middleware/video-upload.middleware.js";
import {
  createModule,
  deleteModule,
  getModule,
  getModulesByCourseId,
  updateModule,
} from "../controllers/module.controller.js";

const router = express.Router();

router.post("/create-module", protectedRoute, adminRoute, createModule);

router.get("/get-modules/:courseId", protectedRoute, getModulesByCourseId);

router.get("/get-module/:moduleId", protectedRoute, getModule);

router.put(
  "/update-module/:moduleId",
  protectedRoute,
  adminRoute,
  // videoUpload.single("video"),
  updateModule
);

router.delete(
  "/delete-module/:moduleId",
  protectedRoute,
  adminRoute,
  deleteModule
);

export default router;
