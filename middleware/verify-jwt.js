import { User } from "../models/User.model.js";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
     
    if (!token) {
      return res.json(new ApiResponse(400,{
        unauthorized:true
      },"Unauthorized request"))
      // throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if(!user){
      throw new ApiError(401,"Invalid Access Token")
    }
    req.user=user;
    next();
  } catch (error) {
    throw new ApiError(401,error.message||"Invalid access token")
  }
});
export default verifyJWT;