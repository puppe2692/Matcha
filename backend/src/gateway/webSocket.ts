import { Server as HTTPServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { Message, chatServices } from "../routes/chat/chat-service";

export class WebSocket {
  io: SocketServer;

  constructor(appserver: HTTPServer) {
    this.io = new SocketServer(appserver, {
      cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "DELETE", "PUT"],
      },
    });

    this.io.on("connection", this.startListeners);
  }

  startListeners = (socket: Socket) => {
    const userId: string = (socket.handshake.query?.id || "") as string;
    // console.log("connection");
    // console.log("socket id: " + socket.id);
    // console.log("user id: " + userId);
    if (userId !== "") {
      socket.join(userId);
    }

    socket.on("disconnect", () => {
      if (userId !== "") {
        socket.leave(userId);
      }
      // console.log("disconnection " + socket.id);
      // console.log("disconneced user " + userId);
    });

    socket.on("chat message", ({ content, sender_id, receiver_id }) => {
      const message: Message = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        date_sent: new Date(),
        content: content,
        seen: false,
      };
      chatServices.pushMessage(message);
      socket
        .to(message.receiver_id.toString())
        .to(message.sender_id.toString())
        .emit("receive-message", message);
    });

    socket.on("login", (userId: string) => {
      socket.join(userId);
    });

    socket.on("logout", (userId: string) => {
      if (userId !== "") {
        socket.leave(userId);
        const socketsInRoom = this.io.sockets.adapter.rooms.get(userId);
        if (socketsInRoom) {
          socketsInRoom.forEach((socketId) => {
            const socket = this.io.sockets.sockets.get(socketId);
            socket!.leave(userId);
          });
        }
      }
      userId = "";
    });
  };
}
