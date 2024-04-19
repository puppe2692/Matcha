import { Server as HTTPServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { Message, chatServices } from "../routes/chat/chat-service";
import { notification } from "../routes/action/action-service";

export class WebSocket {
  io: SocketServer;

  constructor(appserver: HTTPServer) {
    this.io = new SocketServer(appserver, {
      cors: {
        origin: [`http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`],
        methods: ["GET", "POST", "DELETE", "PUT"],
      },
    });

    this.io.on("connection", this.startListeners);
  }

  startListeners = (socket: Socket) => {
    const userId: string = (socket.handshake.query?.id || "") as string;
    if (userId && userId !== "") {
      socket.join(userId);
    }

    socket.on("disconnect", () => {
      if (userId && userId !== "") {
        socket.leave(userId);
      }
    });

    socket.on(
      "chat message",
      ({
        content,
        sender_id,
        receiver_id,
      }: {
        content: string;
        sender_id: number;
        receiver_id: number;
      }) => {
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
      }
    );

    socket.on("login", (userId: string) => {
      if (userId && userId !== "") {
        socket.join(userId);
      }
    });

    socket.on("logout", (userId: string) => {
      if (userId && userId !== "") {
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

  readMessages = (userId: string, readCount: number) => {
    this.io.in(userId).emit("notify-read", readCount);
  };

  sendNotification = (userId: string, notif: notification) => {
    this.io.in(userId).emit("notification", notif);
  };

  notifyMatch = (
    destinationId: number,
    originId: number,
    originUsername: string
  ) => {
    console.log("username", originUsername);
    this.io.in(destinationId.toString()).emit("notify-match", {
      userId: originId,
      username: originUsername,
    });
  };

  notifyUnmatchBlock = (destinationId: number, originId: number) => {
    this.io.in(destinationId.toString()).emit("notify-unmatch-block", originId);
  };
}
