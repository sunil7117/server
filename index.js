import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import videoRouter from "./routes/videos.js";
import commentRouter from "./routes/comments.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const DB = process.env.URL;
const connectDB = async (DATABASE_URL) => {
  const DB_OPTION = {
    dbName: "video_share_app",
  };
  await mongoose.connect(DATABASE_URL, DB_OPTION);
  console.log("Connect to DB");
};
connectDB(DB);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);
app.use("/api/comment", commentRouter);
// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({ success: false, status, message });
});

app.listen(PORT, () => {
  console.log("Connect to server");
});
