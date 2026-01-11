import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createCourse,
  getAllPurchasedCourses,
  getCourse,
  getSingleCourse,
} from "../controllers/course.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post(
  "/create-course",
  protectedRoute,
  upload.single("thumbnail"),
  createCourse
);

router.get("/get-courses", protectedRoute, getCourse);

router.get("/get-course/:courseId", protectedRoute, getSingleCourse);

router.get("/get-purchased-courses", protectedRoute, getAllPurchasedCourses);

export default router;
