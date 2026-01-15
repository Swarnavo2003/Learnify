import { asyncHandler } from "../utils/async-handler.js";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validations/index.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../services/email.service.js";
import jwt from "jsonwebtoken";
import parsedEnv from "../config/env.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const registerData = userRegistrationSchema.safeParse(req.body);
  if (!registerData.success) {
    throw new ApiError(400, "Validation Error", registerData.error.errors);
  }

  const { fullName, email, password } = registerData.data;

  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(409, "User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    admin: email === parsedEnv.ADMIN_EMAIL ? true : false,
  });

  sendWelcomeEmail(newUser.email, newUser.fullName).catch((err) => {
    console.error("Error sending welcome email:", err);
  });

  const token = jwt.sign({ userId: newUser._id }, parsedEnv.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(201, newUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const loginData = userLoginSchema.safeParse(req.body);

  if (!loginData.success) {
    throw new ApiError(400, "Validation Error", loginData.error.errors);
  }

  const { email, password } = loginData.data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }
  const token = jwt.sign({ userId: user._id }, parsedEnv.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        user,
        user.admin ? "Welcome Back Admin" : `Welcome Back ${user.fullName}`
      )
    );
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    })
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});
