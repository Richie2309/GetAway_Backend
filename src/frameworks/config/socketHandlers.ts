import { Server, Socket } from "socket.io";
import JwtService from "../utils/jwtService.utils";
import dotenv from 'dotenv'

dotenv.config();
const userSocketMap: { [key: string]: string } = {};
const jwtService = new JwtService();


export const getRecieverId = (receiverId: string) => {
  return userSocketMap[receiverId]
}

export default function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {

    const token = socket.handshake.auth.token;

    try {
      const decoded = jwtService.verifyToken(token);

      if (decoded) {
        const userId = decoded.id;

        userSocketMap[userId] = socket.id;

        // Join a room with the user's ID
        socket.join(userId);

        // Handle new message
        socket.on("sendMessage", (data) => {
          const { receiverId, content } = data;
          const receiverSocketId = userSocketMap[receiverId];

          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
              senderId: userId,
              content: content,
              timestamp: new Date()
            });
          }

          // Acknowledge the message was sent
          socket.emit("messageSent", { receiverId, content });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
          delete userSocketMap[userId];
        });
      } else {
        console.error("Invalid token");
        socket.disconnect();
      }
    } catch (err) {
      console.error("Token verification error:", err);
      socket.disconnect();
    }
  });
}