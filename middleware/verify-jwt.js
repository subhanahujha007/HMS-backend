import Admin from "../model/Admin.model.js";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token from cookies/headers:", token);

    if (!token) {
      return res.status(400).json(new ApiResponse(400, { unauthorized: true }, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const admin = await Admin.findById(decodedToken._id).select("-password -refreshToken");

    if (!admin) {
      throw new ApiError(401, "Admin not found");
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    throw new ApiError(401, error.message || "Invalid access token");
  }
});

export default verifyJWT;
