import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import {
  generateAccessAndRefreshToken,
  verifyAccessToken,
} from "../utils/jwt_auth";
import jwt from "jsonwebtoken";
const dotenv = require("dotenv");
dotenv.config();

const prisma = new PrismaClient();
const cookie_options = {
  httpOnly: true,
  secure: false, // Set to true if using HTTPS
  sameSite: "lax", // This is important for Chrome
  path: "/", // Ensure cookie is available across your entire domain
  maxAge: 15 * 60 * 1000, // 15 minutes for access token
};

const refreshToken_cookie_options = {
  httpOnly: true,
  secure: false, // Set to true if using HTTPS
  sameSite: "lax", // This is important for Chrome
  path: "/", // Ensure cookie is available across your entire domain
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
};

async function signup(req: any, res: any) {
  const { username, email, password, firstName, lastName, confirmPassword } =
    req.body;
  try {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (
      !email.match(
        /^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/
      )
    ) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (firstName.length < 2 || lastName.length < 2) {
      return res.status(400).json({
        message: "First name and last name must be at least 2 characters",
      });
    }
    const dup_email = await prisma.user.findUnique({
      where: { email },
    });
    const dup_username = await prisma.user.findUnique({
      where: { username },
    });
    if (dup_email || dup_username) {
      console.log("Email or username already exists");
      return res
        .status(400)
        .json({ message: "Email or Username already exists" });
    }
    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
    console.log(
      "User: " + firstName + " " + lastName + " created successfully"
    );
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function login(req: any, res: any) {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    console.log("User logged in successfully");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user
    );
    const response = await prisma.user.update({
      data: {
        refreshToken,
      },
      where: {
        id: user.id,
      },
    });
    if (!response) {
      return res.status(401).json({
        message: "Failed to update user tokens",
      });
    }
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, refreshToken_cookie_options)
      .cookie("accessToken", accessToken, cookie_options)
      .json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getUserdata(req: any, res: any) {
  // Get user data from the access token via middleware
  try {
    const userId = req.user.id;
    if (!userId) {
      throw new Error("User ID is required");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    console.log("User data retrieved successfully");
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" , refreshToken: null});}
    return res.status(500).json({
      message: "Internal server error",
      refreshToken: refreshToken,
    });
  }
}
async function getUserdatabyId(req: any, res: any) {
  const userId = req.params.id;
  console.log("User ID from request body:", userId);
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    console.log("User data retrieved successfully");
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function updateUser(req: any, res: any) {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const body = req.body;
  const userId = req.params.id;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...body,
      },
    });
    console.log("User updated successfully");
    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function changePassword(req: any, res: any) {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.id;
  try {
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    console.log("Password changed successfully");
    return res.status(200).json({
      message: "Password changed successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function deleteUser(req: any, res: any) {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    await prisma.user.delete({
      where: { id: userId },
    });
    console.log("User deleted successfully");
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
async function logout(req: any, res: any) {
  try {
    const userId = req.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
    console.log("User logged out successfully");
    return res
      .status(200)
      .clearCookie("accessToken", cookie_options)
      .clearCookie("refreshToken", cookie_options)
      .json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function refreshToken(req: any, res: any) {
  console.log("🔐 refreshToken hit!");
  console.log("   req.cookies =", req.cookies);
  console.log("   refreshToken =", req.cookies.refreshToken);
  try {
    console.log("Access Token verification failed, trying to refresh token:");
    const refreshToken = req.body.refreshToken || req.data.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded: any = await jwt.verify(
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
    if (user.refreshToken != refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newTokens = await generateAccessAndRefreshToken(user);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newTokens.refreshToken,
      },
    });
    req.user = await verifyAccessToken(newTokens.accessToken);
    console.log("Tokens refreshed successfully");
    res.cookie("accessToken", newTokens.accessToken, cookie_options);
    res.cookie(
      "refreshToken",
      newTokens.refreshToken,
      refreshToken_cookie_options
    );
    return res.status(200).json({
      message: "Tokens refreshed successfully",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error in refreshToken function:", error);
    res.status(401).json({ message: "Authentication failed" });
    return;
  }
}
// add logout function after session handling is implemented
export {
  signup,
  login,
  updateUser,
  changePassword,
  deleteUser,
  getUserdata,
  getUserdatabyId,
  refreshToken,
  logout,
};
