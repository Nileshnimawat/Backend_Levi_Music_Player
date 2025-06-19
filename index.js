import  {app, socketServer}  from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

socketServer.listen(PORT, () => {
  console.log("Server listening at port:", PORT);
});