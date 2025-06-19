import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Music } from "./models/music.model.js";
import { uploadOnCloudinary } from "./utils/cloudinary.js";
import { connect } from "http2";
import connectDB from "./db/user.db.js";

dotenv.config();

connectDB();

const musicData = JSON.parse(fs.readFileSync("./music_songs_cleaned.json", "utf-8"));

const extractReleaseDate = () => {
  return new Date(); // you can customize this if needed
};

const uploadAllSongs = async () => {
  for (const song of musicData) {
    try {
      const audioPath = path.resolve(`.${song.music}`);
      const imagePath = path.resolve(`.${song.image}`);

      const [audioUpload, imageUpload] = await Promise.all([
        uploadOnCloudinary(audioPath),
        uploadOnCloudinary(imagePath),
      ]);

      if (!audioUpload || !imageUpload) {
        console.error(`❌ Failed upload for ${song.title}`);
        continue;
      }

      const [min, sec] = song.duration.split(":").map(Number);
      const durationInSeconds = min * 60 + sec;

      const newSong = new Music({
        title: song.title,
        artist: song.artist,
        releaseDate: extractReleaseDate(),
        duration: durationInSeconds,
        url: audioUpload.secure_url,
        coverImage: imageUpload.secure_url,
      });

      await newSong.save();
      console.log(`✅ Uploaded: ${song.title}`);
    } catch (err) {
      console.error(`⚠️ Error with ${song.title}:`, err.message);
    }
  }

  mongoose.disconnect();
};

uploadAllSongs();
