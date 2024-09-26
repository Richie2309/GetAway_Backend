import { Server } from "socket.io";
import { Server as HttpServer } from 'http'
import setupSocketHandlers from "./socketHandlers"

export default function initializeSocketIO(server: HttpServer) {  
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL!
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  })
  setupSocketHandlers(io)

  return io
}