import express from "express";
import upload from "../middlewares/multer.middleware.js";
import { getAllMusics, deleteMusic, uploadMusic } from "../controllers/music.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

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

router.route("/delete/:id").delete(isAuthenticated,isAdmin, deleteMusic);


export default router;
