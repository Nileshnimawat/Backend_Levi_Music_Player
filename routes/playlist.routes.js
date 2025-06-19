import express from "express";
import { Music } from "../models/music.model.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createPlaylist, deletePlaylist, getAllPlaylists, addSongToPlaylist, removeMusicFromPlaylist } from "../controllers/playlist.controller.js";

const router = express.Router();

router.route("/createPlaylist").post(isAuthenticated, createPlaylist);
router.route("/deletePlaylist/:id").delete(isAuthenticated, deletePlaylist);

router.route("/").get(isAuthenticated, getAllPlaylists )
router.route("/addMusic/:id").post( isAuthenticated, addSongToPlaylist); 
router.route("/removeMusic/:id").put( isAuthenticated, removeMusicFromPlaylist); 



export default router;