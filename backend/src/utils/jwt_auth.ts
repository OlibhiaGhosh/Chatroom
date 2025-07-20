const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
import { user } from "../types";

function generateAccessAndRefreshToken(user: user) {
  const payload = {
    id: user.id,
    username: user.username,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

async function verifyAccessToken( token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error verifying access token:", error);
    throw new Error("Token verification failed");
  }
}

export { generateAccessAndRefreshToken, verifyAccessToken };
