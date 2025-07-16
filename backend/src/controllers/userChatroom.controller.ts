import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function joinChatroom(req: any, res: any) {
  const { userId, chatroomId } = req.body;
  try {
    if (!userId || !chatroomId) {
      return res
        .status(400)
        .json({ message: "User ID and Chatroom ID are required" });
    }
    const chatroomExists = await prisma.userChatroom.findUnique({
      where: { id: chatroomId },
    });
    if (chatroomExists){
        const result = await prisma.userChatroom.findUnique({
            where: { id: chatroomId },
        });
        const userList = result!.userId;
        if (userList.includes(userId)) {
            return res.status(400).json({ message: "User already in chatroom" });
        }
        else{
            let updatedUserList =[...userList, JSON.stringify(userId)]
            const updatedChatroom = await prisma.userChatroom.update({
              where: { id: chatroomId },
              data: {
                userId: updatedUserList,
              },
            });
            console.log("User ID: " + userId + " joined chatroom ID: " + chatroomId);
            return res.status(200).json({
              message: "User joined chatroom successfully",
              updatedChatroom,
            });
        }
    }else{
        const updatedChatroom = await prisma.userChatroom.update({
          where: { id: chatroomId },
          data:{
            userId: userList.
          }
        })
    }
    }
    const response = await prisma.userChatroom.create({
      data: {
        userId: userId,
        chatroomId: chatroomId,
      },
    });
    console.log("User ID: " + userId + " joined chatroom ID: " + chatroomId);
    return res.status(201).json({
      message: "User joined chatroom successfully",
      response,
    });
  } catch (error) {
    console.error("Error joining chatroom:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getUser(req: any, res: any) {
  const { chatroomId } = req.params; // Assuming userId is passed as a URL parameter
  try {
    if (!chatroomId) {
      return res.status(400).json({ message: "Chatroom Id is required" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
