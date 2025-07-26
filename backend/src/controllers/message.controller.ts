import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addMessage(req: any, res: any) {
    const { id: userId } = req.user; // Get user ID from the request
    const { content } = req.body; // Get message content from the request body
  try{
    const chatroomId: string = req.params.id;
  if (!chatroomId) {
    return res.status(400).json({ error: "Chatroom ID is required" });
  }
  if (!content || !userId) {
    return res.status(400).json({ error: "Content and User ID are required" });
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
  const chatroomExistsHere = await prisma.message.findUnique({
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
              messages: [
                {
                  text: content,
                  timestamp: new Date(),
                },
              ],
            },
          ],
        },
      },
    });
    return res.status(201).json({
      message: "Chatroom and Message added successfully",
      content: message,
    });
  }
  const contentArray = chatroomExistsHere.content as any[];

    const userEntryIndex = contentArray.findIndex((entry) => entry.user_id === userId);

    if (userEntryIndex !== -1) {
      // User already has messages → append new message to their message array
      contentArray[userEntryIndex].message.push({
        text: content,
        timestamp: new Date(),
      });
    } else {
      // User doesn't exist → add new user block
      contentArray.push({
        user_id: userId,
        message: [
          {
            text: content,
            timestamp: new Date(),
          },
        ],
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { chatroomId },
      data: { content: contentArray },
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
      return res.status(404).json({ error: "No messages found in this chatroom" });
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

export { addMessage, getMessages };