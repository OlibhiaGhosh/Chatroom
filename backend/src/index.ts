import express from "express";
import dotenv from "dotenv";
const app = express();
app.use(express.json());
import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("server is running on PORT:" + 3000);
});