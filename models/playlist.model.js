
import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    coverImage:{
      type:String,
      default:""
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
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
