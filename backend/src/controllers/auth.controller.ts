import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt_auth";
import jwt from "jsonwebtoken";
const dotenv = require("dotenv");
dotenv.config();
import { getIO } from "../lib/socket";

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
  const io = getIO();
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(401)
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
    const { accessToken } = await generateAccessToken(
      user
    );
    const { refreshToken } = await generateRefreshToken(
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
      return res.status(403).json({
        message: "Failed to update user tokens. Try again later.",
      });
    }
    io.emit("user_logged_in", {
      message: `${user.username} has logged in`,
    });
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, refreshToken_cookie_options)
      .json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken: accessToken,
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
  console.log("In get user data function");
  try {
    const userId = req.user.id;
    console.log("User Id: ", userId)
    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function getUserdatabyId(req: any, res: any) {
  const userId = req.params.id;
  console.log("User ID from request body:", userId);
  if (!userId) {
    return res.status(401).json({ message: "User ID is required" });
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const foundUser = await prisma.user.findUnique({
      where: { refreshToken: refreshToken },
    });
    console.log("Found user:", foundUser);
    if (!foundUser) {
      return res.status(403).json({ message: "User not found" });
    }
    console.log("Going to verify refreshToken")
    console.log("Refresh Token: ", refreshToken);
    console.log("JWT secret",process.env.JWT_SECRET as string )
    jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string,
        async (err:any, decoded:any) => {
            console.log("error", (err|| undefined));
            console.log("Decoded refresh token: ", decoded);
            if (err || foundUser.username !== decoded?.username){ console.log("Mismatch or error in refresh token");return res.sendStatus(403)}
            const { accessToken } = await generateAccessToken(decoded);
            res.json({ message: "Token refreshed successfully", accessToken });
        }
    );
}
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
