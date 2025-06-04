import { on } from "events";

module.exports = (io) => {
  const onMessage = function (this, message, room) {
    if (!message || !message.type) {
      console.error("Invalid message received:", message);
      return;
    }
    const socket = this;
    socket.on("message_sent", (message) => {
        console.log("Message received:", message);
         io.to(room).emit("chat_message", message);
    }
    );
  };

  const onJoin = function (this, room) {
    // ...
  };

  return {
    onMessage,
    on
  }
}