import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../model/Admin.model.js';
import { ApiError } from '../utils/Apierrors.js';
import { ApiResponse } from '../utils/Apiresponse.js';
const generateAccessAndRefreshToken = async function (user_id) {
    try {
      const user = await Admin.findById(user_id);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
     
      throw new ApiError(
        500,
        "Something went wrong while generating access and refresh token"
      );
    }
  };
  
export const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the admin with the same username or email already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      email,
    });
await newAdmin.save()
    const Options = {
        httpOnly: true,
        secure: true,
      };
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        newAdmin._id
      );
  
      const userResponse = newAdmin.toObject();
      delete userResponse.password;
      return res
        .status(201)
        .cookie("accessToken", accessToken, Options)
        .cookie("refreshToken", refreshToken, Options)
        .send(new ApiResponse(201, userResponse));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    
  }
};



export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the admin by email
      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
    
  const isMatch=await bcrypt.compare(password,existingAdmin.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const Options = {
        httpOnly: true,
      };
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        existingAdmin._id
      );
      const userResponse = existingAdmin.toObject();
      delete userResponse.password;
      delete userResponse.refreshToken;
      return res
        .status(201)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken, Options)
        .send(new ApiResponse(201, {accessToken:accessToken,userResponse}));
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
      
    }
  };