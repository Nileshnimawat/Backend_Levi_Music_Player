import express from "express";
import { Music } from "../models/music.model.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createPlaylist,getPlaylistByID, deletePlaylist, getUserPlaylists, addSongToPlaylist, removeMusicFromPlaylist, getGlobalPlaylists } from "../controllers/playlist.controller.js";
import upload from "../middlewares/multer.middleware.js";


const router = express.Router();

router.route("/createPlaylist").post(isAuthenticated,upload.single("coverImage") , createPlaylist);
router.route("/deletePlaylist/:id").delete(isAuthenticated, deletePlaylist);

router.route("/").get(isAuthenticated, getUserPlaylists )
router.route("/addMusic/:id").post( isAuthenticated, addSongToPlaylist); 
router.route("/removeMusic/:id").put( isAuthenticated, removeMusicFromPlaylist); 
router.route("/global").get(getGlobalPlaylists);

router.route("/:id").get(getPlaylistByID);



export default router;