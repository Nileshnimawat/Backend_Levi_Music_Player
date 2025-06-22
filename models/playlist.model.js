import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    musics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },

    releaseYear:{
      type:String,
      default:new Date().getFullYear()
    },

    isGlobal: {
      type: Boolean,
      default: false,
    },
    region: {
      type: String, 
      default: "global",
    },
    category: {
      type: String, 
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
