import { PrismaClient } from "@prisma/client";
import { userChatroom } from "../types";
const prisma = new PrismaClient();
async function joinUserChatroomTable(req: any, res: any) {
  const userId = req.user.id;
  console.log("UserId: ", userId);
  const { chatroomId } = req.body;
  console.log("chatroomId: ", chatroomId);
  try {
    if (!userId || !chatroomId) {
      return res
        .status(400)
        .json({ message: "User ID and Chatroom ID are required" });
    }
    const chatroomExists: userChatroom[] = await prisma.userChatroom.findMany({
      where: { chatroomId: chatroomId },
    });
    if (!chatroomExists) {
      const isChatroominChatroomTable = await prisma.chatroom.findUnique({
        where: { room_id: chatroomId },
      });
      await prisma.userChatroom.create({
        data: {
          userId: userId,
          chatroomId: chatroomId,
          createdAt: new Date(),
        },
      });
      return res.status(200).json({
        message: "User entered in UserChatroom table",
      });
    }
    const userIdArrayofExistingChatroom = chatroomExists.map((data) => {
      data.userId;
    });
    if (userIdArrayofExistingChatroom.includes(userId)) {
      return res.status(400).json({
        message: "Already added in user Chatroom",
      });
    } else {
      await prisma.userChatroom.create({
        data: {
          userId: userId,
          chatroomId: chatroomId,
          createdAt: new Date(),
        },
      });
      return res.status(200).json({
        message: "User entered in UserChatroom table",
      });
    }
  } catch (error) {
    console.error("Error joining userchatroomTable:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getChatroomfromUserChatroomTable(req: any, res: any) {
  const userId = req.user.id;
  try {
    if (!userId) {
      return res.status(400).json({ message: "user Id is required" });
    }
    const memberships = await prisma.userChatroom.findMany({
      where: { userId },
      include: {
        chatroom: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const chatrooms = memberships.map((m) => m.chatroom);
    return res.status(200).json({
      message: "Fetched chatrooms for the users successfully",
      chatrooms,
    });
  } catch (error) {
    console.error("Error getting chatroom data for the user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export { joinUserChatroomTable, getChatroomfromUserChatroomTable };
