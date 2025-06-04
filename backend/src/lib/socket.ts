import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    },
 });
const onConnection = (socket: any) => {}
io.on("connection", onConnection);

httpServer.listen(3000);