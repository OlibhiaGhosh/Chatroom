import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL (don't use * with credentials)
  credentials: true // This is crucial for cookies
}));
app.use(express.json());
app.use(cookieParser());
import authRoutes from "./routes/auth.routes";
import chatroomRoutes from "./routes/chatroom.routes";
app.use("/api/auth", authRoutes);
app.use("/api/chatroom", chatroomRoutes);

app.listen(3000, () => {
  console.log("server is running on PORT:" + 3000);
});