import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import chatroomRoutes from "./routes/chatroom.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // whatever your React app’s URL is
    credentials: true, // <— allows cookies to be sent & received
  })
);

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/chatroom", chatroomRoutes);

app.listen(3000, () => {
  console.log("server is running on PORT:" + 3000);
});
