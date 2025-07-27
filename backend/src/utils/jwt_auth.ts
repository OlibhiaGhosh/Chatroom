const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
import { user } from "../types";

async function generateAccessToken(user: user) {
  const payload = {
    id: user.id,
    username: user.username,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  if (!accessToken) {
    throw new Error("Failed to generate access token");
  }
  return { accessToken };
}

async function generateRefreshToken(user: user) {
  const payload = {
    id: user.id,
    username: user.username,
  };
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", // Refresh token valid for 1 day
  });
  if (!refreshToken) {
    throw new Error("Failed to generate refresh token");
  }
  return { refreshToken };
};


export { generateAccessToken, generateRefreshToken };
