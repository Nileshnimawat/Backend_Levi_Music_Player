import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import cloudinary, { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { Music } from "../models/music.model.js";

export const SignUp = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    if (!name || !username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already Registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error ",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Username or Password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Username or Password",
      });
    }

    const tokens = jwt.sign(
      { userId: existingUser._id },
      process.env.SECRET_TOKEN,
      { expiresIn: process.env.SECRET_TOKEN_EXPIRY }
    );

    res.cookie("tokens", tokens, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Successfully Logged In",
      user: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

export const Logout = async (req, res) => {
  res.clearCookie("tokens", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 0,
  });
  return res.status(200).json({
    success: true,
    message: "user successfully logout",
  });
};

export const toggleLikeSong = async (req, res) => {
  const userId = req.userId;
  const musicId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const song = await Music.findById(musicId);
    if (!song)
      return res.status(404).json({ success: false, message: "Music not found" });

    const isLiked = user.liked_playlist.includes(musicId);

    if (isLiked) {
      user.liked_playlist = user.liked_playlist.filter(
        (id) => id.toString() !== musicId
      );
      await user.save();

      return res.status(200).json({
        liked: false,
        message: "Removed from liked playlist",
        music: song,
      });
    } else {
      user.liked_playlist.unshift(musicId);
      await user.save();

      return res.status(200).json({
        liked: true,
        message: "Added to liked playlist",
        music: song,
      });
    }
  } catch (error) {
    console.error("Toggle like error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};




export const getLoggedInUser = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserLikedMusics = async (req, res) => {
  const id = req.usedId;
  try {
    const musics = await User.findById(id).populate("liked_playlist");
    if (!musics) {
      return res.status(404).json({
        success: false,
        message: " liked musics not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "liked musics successfully retrived",
      musics,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};
