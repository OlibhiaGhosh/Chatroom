import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function signup(req: any, res: any) {
  const { username, email, password, firstName, lastName } = req.body;
  try {
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!(email.match(/^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/))){
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
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
        .json({ message: "Email and password are required" });
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
    return res.status(200).json({
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
async function updateUser(req: any, res: any) {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { username, email, firstName, lastName } = req.body;
  const userId = req.params.id;
  try {
    if (!username || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        firstName,
        lastName,
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
// add logout function after session handling is implemented
export {signup,
login,
updateUser,
changePassword, 
deleteUser}
