import express from "express";
import upload from "../middlewares/multer.middleware.js";
import { getAllMusics, uploadMusic } from "../controllers/music.controller.js";

const router = express.Router();



router.post(
  "/upload",
  upload.fields([
    { name: "url", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadMusic
);


router.route("/").get(getAllMusics);


export default router;
