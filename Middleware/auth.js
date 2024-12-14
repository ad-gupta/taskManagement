import User from "../Models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import catchAsyncError from "./catchAsyncError.js";

export const isAuthorised = catchAsyncError (async(req, res, next) => {

    const {access_token} = req.cookies;

    if(!access_token) return next(new ErrorHandler("Please login first", 400));

    const decodedData = jwt.verify(access_token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
})