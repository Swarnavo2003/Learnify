import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  addCourseToCart,
  getUserCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add-to-cart", protectedRoute, addCourseToCart);

router.get("/get-cart", protectedRoute, getUserCart);

export default router;
