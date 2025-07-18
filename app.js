import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/user.db.js";
import UserRoute from "./routes/user.routes.js";
import MusicRoute from "./routes/music.routes.js"
import cookieParser from "cookie-parser";
import compression from "compression";
import PlayListRoute from "./routes/playlist.routes.js"
import { initializeSocket } from "./Socket/socket.js";

import http from "http"



dotenv.config();

const app = express();
const socketServer = http.createServer(app);

initializeSocket(socketServer);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-levi-music.vercel.app",
  "https://frontend-levi-music-31jsnk76v-nilesh-nimawats-projects.vercel.app",
  "https://frontend-levi-music-git-master-nilesh-nimawats-projects.vercel.app",
  "https://frontend-levi-music-r600tpud3-nilesh-nimawats-projects.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
     methods: ["GET", "POST", "PUT", "DELETE"]
  })
);


connectDB();

// Routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/music", MusicRoute);
app.use("/api/v1/playlist", PlayListRoute);


app.get("/", (req, res) => {
  res.send("hello world ");
});

export {app, socketServer}