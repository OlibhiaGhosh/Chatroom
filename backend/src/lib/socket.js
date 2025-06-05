import { on } from "events";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const onConnection = (socket) => {
  socket.on("message_sent", ({ roomId, message }) => {
    if (!message || !message.type) {
      console.error("Invalid message received:", message);
      return;
    }
    console.log("Message received:", message);
    io.to(roomId).emit("chat_message", message);
  });
  socket.on("join_room", ({ roomId, username }) => {
    if (!roomId) {
      console.error("Invalid roomId received:", roomId);
      return;
    }
    console.log("User joined room:", roomId);
    socket.join(roomId);
    io.to(roomId).emit("user_joined", {
      message: ` ${username} has joined the room`,
    });
  });
  socket.on("disconnected", ({roomId, username}) => {
    console.log("User disconnected");
    io.to(roomId).emit("user_disconnected", {
      message: `${username} has disconnected`,
    });
  });
};
io.on("connection", onConnection);

httpServer.listen(3000);
