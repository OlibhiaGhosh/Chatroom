import { verifyAccessToken } from "../utils/jwt_auth";
import { PrismaClient } from "../generated/prisma/client";
import { CookieOptions } from "express";
import { generateAccessAndRefreshToken } from "../utils/jwt_auth";
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const prisma = new PrismaClient();
const cookie_options = {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: 'lax', // This is important for Chrome
    path: '/' // Ensure cookie is available across your entire domain
}

async function authMiddleware(req: any, res: any, next: any) {
  try {
    console.log("authMiddleware called");
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    let decoded = await verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    try {
      console.error(
        "Access Token verification failed, trying to refresh token:",
        error
      );
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
      }
      const decoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET || ""
      );
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!user.refreshToken) {
        return res.status(403).json({ message: "No refresh token found" });
      }
      if (user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const newTokens = generateAccessAndRefreshToken(user);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: newTokens.refreshToken,
        },
      });
      return res
        .status(200)
        .cookie("accessToken", newTokens.accessToken, cookie_options)
        .cookie("refreshToken", newTokens.refreshToken, cookie_options)
        .json({
          message: "Tokens refreshed successfully",
        });
    } catch (error) {
      console.error("Error in authMiddleware:", error);
      res.status(401).json({ message: "Authentication failed" });
      return;
    }
  }
}

export { authMiddleware };
