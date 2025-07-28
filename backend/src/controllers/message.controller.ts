import { PrismaClient } from "@prisma/client";
import { getIO } from "../lib/socket";

const prisma = new PrismaClient();

async function sendMessage(req: any, res: any) {
  const io = getIO();
  const { id: userId } = req.user; // Get user ID from the request
  const { content, username } = req.body; // Get message content from the request body
  try {
    const chatroomId: string = req.params.id;
    if (!chatroomId) {
      return res.status(400).json({ error: "Chatroom ID is required" });
    }
    if (!content || !userId || !username) {
      return res
        .status(400)
        .json({ error: "Content, User ID, and Username are required" });
    }
    const chatroom = await prisma.chatroom.findUnique({
      where: { room_id: chatroomId },
    });
    if (!chatroom) {
      return res.status(404).json({ error: "Chatroom not found" });
    }
    if (!chatroom.members.some((member: any) => member.userId === userId)) {
      return res.status(403).json({
        message: "User is not a member of this chatroom",
        chatroomDetails: chatroom,
      });
    }
    const chatroomExistsHere = await prisma.message.findFirst({
      where: { chatroomId: chatroomId },
    });
    if (!chatroomExistsHere) {
      const message = await prisma.message.create({
        data: {
          chatroomId: chatroomId,
          content: {
            set: [
              {
                user_id: userId,
                message: content,
                username: username,
                timestamp: new Date(),
              },
            ],
          },
        },
      });
      io.to(chatroomId).emit("new_message", {
        roomId: chatroomId,
        userId: userId,
        username: username,
        content: content,
      });
      return res.status(201).json({
        message: "Chatroom and Message added successfully",
        content: message,
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { chatroomId },
      data: {
        content: {
          set: [
            ...(chatroomExistsHere.content as any[]),
            {
              user_id: userId,
              message: content,
              username: username,
              timestamp: new Date(),
            },
          ],
        },
      },
    });
    io.to(chatroomId).emit("new_message", {
        roomId: chatroomId,
        userId: userId,
        username: username,
        content: content,
    });
    return res.status(201).json({
      message: "Message added successfully",
      content: updatedMessage,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getMessages(req: any, res: any) {
  try {
    const chatroomId: string = req.params.id;
    if (!chatroomId) {
      return res.status(400).json({ error: "Chatroom ID is required" });
    }
    const chatroom = await prisma.chatroom.findUnique({
      where: { room_id: chatroomId },
    });
    if (!chatroom) {
      return res.status(404).json({ error: "Chatroom not found" });
    }
    const messages = await prisma.message.findUnique({
      where: { chatroomId: chatroomId },
    });
    if (!messages) {
      return res
        .status(404)
        .json({ error: "No messages found in this chatroom" });
    }
    return res.status(200).json({
      message: "Messages retrieved successfully",
      content: messages.content,
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export { sendMessage, getMessages };
