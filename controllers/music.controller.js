//import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js"; // adjust path if needed


import { User } from "../models/user.model.js";
import { Music } from "../models/music.model.js";


// export const uploadMusic = async (req, res) => {
//   try {
    
//     const { title, artist, duration } = req.body;

//     const files = req.files;
//     let url, coverImage;

//     // Cloudinary Uploads
//     if(files.url){
//       const audioResponse = await uploadOnCloudinary(files.url[0].path);
//       if(audioResponse) url = audioResponse.secure_url;
//     }
    
//     if(files.coverImage){
//        const imageResponse = await uploadOnCloudinary(files.coverImage[0].path);
//        if(imageResponse)  coverImage = imageResponse.secure_url;
//     }

//     const newSong = new Music({
//       title,
//       artist,
//       duration,
//       url,
//       coverImage,
//     });

//     await newSong.save();

//     return res
//       .status(201)
//       .json({ success : true, message: "Song uploaded successfully", song: newSong });
//   } catch (error) {
//     console.error("Upload error:", error.message);
//     return res.status(500).json({ message: "Internal Server error" });
//   }
// };


export const uploadMusic = async (req, res) => {
  try {
    const { title, artist, duration } = req.body;
    const files = req.files;

    let url = "";
    let coverImage = "";

    // ✅ Upload audio
    if (files.url && files.url[0]?.buffer) {
      const audioResponse = await uploadBufferToCloudinary(files.url[0].buffer, "audios");
      if (audioResponse) url = audioResponse.secure_url;
    }

    // ✅ Upload cover image
    if (files.coverImage && files.coverImage[0]?.buffer) {
      const imageResponse = await uploadBufferToCloudinary(files.coverImage[0].buffer, "coverImages");
      if (imageResponse) coverImage = imageResponse.secure_url;
    }

    const newSong = new Music({
      title,
      artist,
      duration,
      url,
      coverImage,
    });

    await newSong.save();

    return res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      song: newSong,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
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





