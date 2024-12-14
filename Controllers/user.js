import catchAsyncError from "../Middleware/catchAsyncError.js";
import User from "../Models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendCookie from "../utils/sendCookie.js";

export const registerUser = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  sendCookie(user, 201, res);
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Invalid email or password", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid email or password", 401));

  sendCookie(user, 200, res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("access_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged-out successfully",
  });
});

export const getMyDetails = catchAsyncError(async(req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
})
