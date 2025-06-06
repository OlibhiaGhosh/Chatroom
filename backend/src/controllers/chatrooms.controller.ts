import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();
async function createChatroom(req: any, res: any) {
  const { name, creatorId } = req.body;
  try {
    if (!name || !creatorId) {
      return res
        .status(400)
        .json({ message: "Name and creatorId are required" });
    }
    const chatroom = await prisma.chatroom.create({
      data: {
        name,
        creatorId,
      },
    });
    console.log(
      "Chatroom: " + name + " created successfully by user ID: " + creatorId
    );
    return res.status(201).json({
      message: "Chatroom created successfully",
      chatroom,
    });
  } catch (error) {
    console.error("Error creating chatroom:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function getChatroomData(req: any, res: any) {
  const { chatroomId } = req.params; // Assuming chatroomId is passed as a URL parameter
  try {
    if (!chatroomId) {
      return res.status(400).json({ message: "Chatroom ID is required" });
    }
    const details = await prisma.chatroom.findUnique({
      where: { id: chatroomId },
    });
    if (!details) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    return res.status(200).json({
      message:
        "Chatroom-name:" +
        details.name +
        " created by user ID: " +
        details.creatorId,
    });
  } catch (error) {
    console.error("Error getting chatroom data:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function getChatrooms(req: any, res: any) {
  const { creatorId } = req.body;
  try {
    if (!creatorId) {
      return res.status(400).json({ message: "Creator ID is required" });
    }
    const details = await prisma.chatroom.findMany({
      where: { id: creatorId },
    });
    if (!details) {
      return res.status(404).json({ message: "No Chatroom found" });
    }
    return res.status(200).json({
      message: "Chatrooms retrieved successfully",
      chatrooms: details,
    });
  } catch (error) {
    console.error(
      "Error getting chatrooms data of the corresponding user:",
      error
    );
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function deleteChatroom(req: any, res: any) {
  const { chatroomId } = req.body;
  try {
    if (!chatroomId) {
      return res.status(400).json({ message: "Chatroom ID is required" });
    }
    const chatroom = await prisma.chatroom.delete({
      where: { id: chatroomId },
    });
    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    console.log("Chatroom deleted successfully");
    return res.status(200).json({
      message: "Chatroom deleted successfully",
      chatroom,
    });
  } catch (error) {
    console.error("Error deleting chatroom:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export { createChatroom, getChatroomData, getChatrooms, deleteChatroom };
