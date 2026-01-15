import Cart from "../models/cart.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { addCourseToCartSchema } from "../validations/index.js";

export const addCourseToCart = asyncHandler(async (req, res, next) => {
  const addCourseToCartData = addCourseToCartSchema.safeParse(req.body);
  if (!addCourseToCartData.success) {
    throw new ApiError(
      400,
      "Validation Error",
      addCourseToCartData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { courseId } = addCourseToCartData.data;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let userCart = await Cart.findOne({ userId: req.user._id });
  if (!userCart) {
    userCart = await Cart.create({ userId: req.user._id, totalAmount: 0 });
  }
  userCart.courseId.push(courseId);
  userCart.totalAmount = userCart.totalAmount + course.amount;
  await userCart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, userCart, "Course added to cart"));
});

export const getUserCart = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ userId: req.user._id }).populate(
    "courseId"
  );
  if (!userCart) {
    throw new ApiError(404, "Cart not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userCart, "User cart fetched successfully"));
});
