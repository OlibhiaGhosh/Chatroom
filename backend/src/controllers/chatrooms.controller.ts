import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function createChatroom(req: any, res: any) {
  const { id, username } = req.user;
  const { name, description } = req.body;
  try {
    if (!name || !id) {
      return res.status(400).json({ message: "Name and ID are required" });
    }
    const chatroom = await prisma.chatroom.create({
      data: {
        name,
        description: description || null,
        creatorId: id,
        members: [{ userId: id, username: username}],
      },
    });
    console.log(
      "Chatroom: " + name + " created successfully by user ID: " + id
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
async function getChatroomDatabyChatroomId(req: any, res: any) {
  const chatroomId = await req.params.id; // Assuming chatroomId is passed as a URL parameter
  const { id, username } = await req.user; // Get user ID from the request
  console.log("Chatroom ID:", chatroomId);
  console.log("User ID:", id);
  try {
    if (!chatroomId) {
      return res.status(401).json({ message: "Chatroom ID is required" });
    }

    const details = await prisma.chatroom.findUnique({
      where: { room_id: chatroomId },
    });
    if (!details) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    if (!details.members.some((member: any) => member.userId === id)) {
      return res.status(403).json({
        message: "User is not a member of this chatroom",
        chatroomDetails: details,
      });
      }      
    return res.status(200).json({
      message:
        "Chatroom-name:" +
        details.name +
        " created by user ID: " +
        details.creatorId,
      chatroomDetails: details,
    });
  } catch (error) {
    console.error("Error getting chatroom data:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function joinChatroom(req: any, res: any) {
  const chatroomId = await req.params.id; // Assuming chatroomId is passed as a URL parameter
  const { id, username } = await req.user; // Get user ID from the request
  try {
    if (!id || !username) {
      return res
        .status(401)
        .json({ message: "Username and User ID are required" });
    }
    if (!chatroomId) {
      return res.status(400).json({ message: "Chatroom ID is required" });
    }
    const chatroom = await prisma.chatroom.findUnique({
      where: { room_id: chatroomId },
    });
    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    const memberArray = chatroom.members
    const memberExists = memberArray.find((member:any) => {member?.userId === id})
    if(memberExists){
      return res.status(200).json({
          message: "User " + username + " joined the chatroom successfully",
          chatroomDetails: chatroom,
        });
    }
    const chatroomDetails = await prisma.chatroom.update({
      where: { room_id: chatroomId },
          data: {
            members: {
              set: [
                ...(chatroom.members as any[]),
                {
                  userId: id,
                  username: username,
                },
              ],
            },
          },
        });
        if (!chatroomDetails) {
          return res.status(404).json({ message: "Chatroom members could not be updated" });
        }
        console.log("User with ID:", id, "joined chatroom:", chatroom.name);
        return res.status(200).json({
          message: "User " + username + " joined the chatroom successfully",
          chatroomDetails,
        });
      } catch (error) {
        console.error("Error joining chatroom:", error);
        return res.status(500).json({
          message: "Internal server error",
        });
      }
}
async function getChatroomDatabyCreatorId(req: any, res: any) { //for fetching data of dashboard for each user
  const { id: userId } = req.user; 
  try {
    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }
    const details = await prisma.chatroom.findMany({
      where: { creatorId: userId },
    });
    if (!details) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    console.log("Chatroom dAta retrieved successfully for user ID:", userId);
    return res.status(200).json({
      message: "chatroom details retrieved successfully",
      chatrooms: details,
    });
  } catch (error) {
    console.error("Error getting chatroom data:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function getChatrooms(req: any, res: any) {// Extra unnecessary route
  const { creatorId } = req.body;
  try {
    if (!creatorId) {
      return res.status(400).json({ message: "Creator ID is required" });
    }
    const details = await prisma.chatroom.findMany({
      where: { creatorId },
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
      where: { room_id: chatroomId },
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
export {
  createChatroom,
  getChatroomDatabyChatroomId,
  getChatroomDatabyCreatorId,
  joinChatroom,
  getChatrooms,
  deleteChatroom,
};
