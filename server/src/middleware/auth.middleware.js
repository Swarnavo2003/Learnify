import parsedEnv from "../config/env.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const protectedRoute = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      throw new ApiError(
        401,
        "Unauthorized: Invalid authorization format. Use 'Bearer <token>'"
      );
    }
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  const decoded = jwt.verify(token, parsedEnv.JWT_SECRET);
  if (!decoded || !decoded.userId) {
    throw new ApiError(401, "Unauthorized: Invalid token");
  }

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  req.user = user;

  next();
});

export const adminRoute = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.email === parsedEnv.ADMIN_EMAIL) {
    next();
  } else {
    return res.status(403).json(new ApiResponse(403, null, "Forbidden"));
  }
});
