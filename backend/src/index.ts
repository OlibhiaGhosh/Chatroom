import express from "express";
const app = express();
app.use(express.json());
import authRoutes from "./routes/auth.routes";
import chatroomRoutes from "./routes/chatroom.routes";
app.use("/api/auth", authRoutes);
app.use("/api/chatroom", chatroomRoutes);

app.listen(3000, () => {
  console.log("server is running on PORT:" + 3000);
});