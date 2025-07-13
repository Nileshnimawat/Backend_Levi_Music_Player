
# 🎵 Levi Music Player – Backend

This is the backend server of the **Levi Music Player**, a full-featured music streaming and sharing platform. Built with **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **Redis**, it enables real-time music syncing, playlist management, and room-based listening experiences.

---

## 🚀 Features

### 🔐 User Authentication
- Signup/Login with secure password hashing  
- JWT-based authentication  

### 📁 Playlist Management
- Create, edit, and delete playlists  
- Add or remove songs from playlists  
- Like/unlike songs  

### 🎧 Room Functionality
- Create & join listening rooms  
- Real-time user activity with Socket.IO  
- Auto-cleanup rooms on disconnect  
- Reconnect handling with Redis  

### 🧑‍💼 Admin Controls
- Admin route protection  
- Ability to control rooms and content  

### ⚡ Real-time Updates
- Sync playback across users in a room  
- Show currently playing song per user  
- Track user activities (like, play, pause)  

---

## 💾 Tech Stack

- **Node.js + Express**  
- **MongoDB + Mongoose**  
- **Redis** (for room/user state)  
- **Socket.IO** (real-time communication)  
- **JWT** for authentication  
- **CORS**, **dotenv**, **morgan**, **cookie-parser**, etc.  

---

## 📂 Project Structure

```
Backend_Levi_Music_Player/
├── config/           # MongoDB, Redis configuration
├── controllers/      # Logic for users, playlists, admin, rooms
├── middlewares/      # Auth, admin protection, error handling
├── models/           # Mongoose schemas (User, Song, Playlist, Room)
├── routes/           # Route definitions for users, music, rooms
├── socket/           # Socket.IO server setup
├── utils/            # Helper functions (e.g., redisClient)
├── .env              # Environment variables
├── server.js         # Main entry point
└── package.json      # Project dependencies
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/Backend_Levi_Music_Player.git
cd Backend_Levi_Music_Player
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### 4. Start the server

```bash
npm start
```

Or in dev mode:

```bash
npm run dev
```

---

## 📡 API Routes

| Endpoint              | Method | Description               |
|-----------------------|--------|---------------------------|
| `/api/auth/register`  | POST   | Register a new user       |
| `/api/auth/login`     | POST   | Login user                |
| `/api/user/:id/like`  | PUT    | Like/unlike a song        |
| `/api/playlist`       | CRUD   | Manage playlists          |
| `/api/room`           | CRUD   | Create/join/leave room    |
| `/api/admin/*`        | VARIES | Admin protected routes    |

---

## 🧪 Technologies Used

- **Node.js**
- **Express**
- **MongoDB** with **Mongoose**
- **Redis** for state management
- **Socket.IO** for real-time interactions
- **JWT** for authentication
- **dotenv**, **morgan**, **cors**, etc.

---

## 🛠️ Future Improvements

- Audio streaming optimizations  
- Admin analytics dashboard  
- WebSockets reconnection with persistence  
- Logging with Winston  

---

## 💡 Author

Developed by [Nilesh Nimawat](https://github.com/Nileshnimawat)


WebSockets reconnection with persistence

Logging with Winston

💡 Author
Developed by Nilesh Nimawat
