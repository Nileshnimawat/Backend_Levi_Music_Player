import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  username: {
    type: String,
    required: true,
    unique: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  liked_playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    }
  ],
  playlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    }
  ],
  profileImage: {
    type: String,
    default: "",
  },
}, {
  timestamps: true
});

export const User = mongoose.model("User", userSchema);