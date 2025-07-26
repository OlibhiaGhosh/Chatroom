// import { createServer } from "http";
// import { Server } from "socket.io";
// import { express } from "express";

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });
// const onConnection = (socket) => {
//   console.log("New client connected:", socket.id);
//   socket.on("message_sent", ({ roomId, message }) => {
//     if (!message || !message.type) {
//       console.error("Invalid message received:", message);
//       return;
//     }
//     console.log("Message received:", message);
//     io.to(roomId).emit("chat_message", message);
//   });
//   socket.on("join_room", ({ roomId, username }) => {
//     if (!roomId) {
//       console.error("Invalid roomId received:", roomId);
//       return;
//     }
//     console.log("User joined room:", roomId);
//     socket.join(roomId);
//     io.to(roomId).emit("user_joined", {
//       message: ` ${username} has joined the room`,
//     });
//   });
//   socket.on("disconnected", ({roomId, username}) => {
//     console.log("User disconnected");
//     io.to(roomId).emit("user_disconnected", {
//       message: `${username} has disconnected`,
//     });
//   });
// };
// io.on("connection", onConnection);

// httpServer.listen(3000);

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",  // or your frontend domain
      credentials: true, 
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket first.");
  }
  return io;
};