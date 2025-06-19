import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Music } from "../models/music.model.js";


export const uploadMusic = async (req, res) => {
  try {
    
    const { title, artist, duration } = req.body;

    if(!title || !artist || !duration) {
      return res.status(404).json({success : false,  message: "fill up the requirements" });
    }

    const files = req.files;

        const newSong = new Music({
      title,
      artist,
      duration,
    });

    if(files.url){
      const audioResponse = await uploadOnCloudinary(files.url[0].path);
      if(audioResponse) newSong.url = audioResponse.secure_url;
    }
    
    if(files.coverImage){
       const imageResponse = await uploadOnCloudinary(files.coverImage[0].path);
       if(imageResponse)  newSong.coverImage = imageResponse.secure_url;
    }



    await newSong.save();

    return res
      .status(201)
      .json({ success : true, message: "Song uploaded successfully", song: newSong });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};





export const getAllMusics = async (req, res) => {
  try {
    const musics = await Music.find();
    res.status(200).json({
      sucess: true,
      message: "All Tracks Successfully retrived",
      musics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: "Internal Server Error",
    });
  }
};





