// import { Server as SocketIOServer, Socket } from "socket.io";
// import { ISocketService } from "../../interface/utils/ISocketService";

// class SocketService implements ISocketService {
//   private io: SocketIOServer | null = null;

//   connect(server: any) {
//     this.io = new SocketIOServer(server, {
//       cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"],
//       },
//     });

//     this.io.on("connection", (socket: Socket) => {
//       console.log(`New client connected: ${socket.id}`);

//       socket.on("joinRoom", (roomId: string) => {
//         socket.join(roomId);
//         console.log(`User joined room: ${roomId}`);
//       });

//       socket.on("sendMessage", (data) => {
//         const { roomId, message } = data;
//         this.io?.to(roomId).emit("receiveMessage", message);
//         console.log(`Message sent to room ${roomId}`);
//       });

//       socket.on("disconnect", () => {
//         console.log(`Client disconnected: ${socket.id}`);
//       });
//     });
//   }

//   emit(event: string, data: any) {
//     this.io?.emit(event, data);
//   }
// }

// export const socketService = new SocketService();
