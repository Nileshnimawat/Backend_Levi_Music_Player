import { Music } from "../models/music.model.js";
import { Playlist } from "../models/playlist.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, isGlobal, region, category } = req.body;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const user = await User.findById(userId);
    if (isGlobal === "true" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create global playlists",
      });
    }

    const newPlaylistData = {
      title,
      description,
      isGlobal: isGlobal === "true",
      region,
      category,
    };

    if (isGlobal !== "true") {
      newPlaylistData.createdBy = userId;
    }

    const newPlaylist = new Playlist(newPlaylistData);

    if (file) {
      const imageResponse = await uploadOnCloudinary(file.path);
      if (imageResponse) newPlaylist.coverImage = imageResponse.secure_url;
    }

    await newPlaylist.save();

    if (!newPlaylist.isGlobal) {
      await User.findByIdAndUpdate(userId, {
        $push: { playlists: newPlaylist._id },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist: newPlaylist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const userId = req.userId;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }
    const user = await User.findById(userId);
    const isOwner = playlist.createdBy.toString() === userId;
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    await Playlist.findByIdAndDelete(playlistId);
    if (isOwner) {
      await User.findByIdAndUpdate(userId, {
        $pull: { playlists: playlistId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Delete Playlist Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.userId });

    res.status(200).json({
      success: true,
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch playlists",
    });
  }
};

export const addSongToPlaylist = async (req, res) => {
  const { id } = req.params;
  const { musicId } = req.body;

  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    const song = await Music.findById(musicId);
    if (!song) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }

    const alreadyAdded = playlist.musics.includes(musicId);
    if (alreadyAdded) {
      return res
        .status(400)
        .json({ success: false, message: "Song already in playlist" });
    }

    playlist.musics.push(musicId);
    await playlist.save();

    return res.status(200).json({
      success: true,
      message: "Song added to playlist successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error adding song to playlist:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeMusicFromPlaylist = async (req, res) => {
  try {
    const { musicId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.musics = playlist.musics.filter((id) => id.toString() !== musicId);
    await playlist.save();

    res.status(200).json({ message: "Music removed from playlist", playlist });
  } catch (error) {
    console.error("Remove music error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGlobalPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isGlobal: true });

    return res.status(200).json({
      success: true,
      playlists,
    });
  } catch (error) {
    console.error("Error fetching global playlists:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch global playlists",
    });
  }
};

export const getPlaylistByID = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id).populate("musics");
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "playlist successfully retrived",
      playlist: playlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

