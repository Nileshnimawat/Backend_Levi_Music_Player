import express from "express"
import {Login, Logout, SignUp, toggleLikeSong,getLoggedInUser, getUserLikedMusics, getStats, searchItems } from "../controllers/user.controller.js";
import {isAuthenticated }from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.middleware.js";
import { User } from "../models/user.model.js";


const router = express.Router();
//auth
router.route("/signup").post(SignUp);
router.route("/login").post(Login);
router.route("/logout").post(Logout);

router.route("/likeOrDislike/:id").put(isAuthenticated, toggleLikeSong);
router.route("/myprofile").get(isAuthenticated, getLoggedInUser);
router.route("/likedMusics").get(isAuthenticated, getUserLikedMusics)
router.route("/stats").get(isAuthenticated, getStats);

router.route("/search").get(searchItems);

export default router
