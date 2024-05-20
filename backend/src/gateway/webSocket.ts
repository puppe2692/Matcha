import { Server as HTTPServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { Message, chatServices } from "../routes/chat/chat-service";
import { notification } from "../routes/action/action-service";
import prismaFromWishInstance from "../database/prismaFromWish";

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
    let userId: string = (socket.handshake.query?.id || "") as string;
    if (userId && userId !== "") {
      socket.join(userId);
      socket.broadcast.emit("user-connected", userId);
    }

    socket.on("disconnect", () => {
      if (userId && userId !== "") {
        socket.leave(userId);
        const socketsInRoom = this.io.sockets.adapter.rooms.get(userId);
        if (!socketsInRoom) {
          socket.broadcast.emit("user-left", userId);
          prismaFromWishInstance.update(
            "users",
            ["updated_at"],
            [new Date()],
            ["id"],
            [userId]
          );
        }
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

    socket.on("login", (connectionId: string) => {
      if (connectionId && connectionId !== "") {
        socket.join(connectionId);
        socket.broadcast.emit("user-connected", connectionId);
      }
      userId = connectionId;
    });

    //TODO: update last seen in the db
    socket.on("logout", () => {
      if (userId && userId !== "") {
        socket.leave(userId);
        const socketsInRoom = this.io.sockets.adapter.rooms.get(userId);
        if (socketsInRoom) {
          socketsInRoom.forEach((socketId) => {
            const socket = this.io.sockets.sockets.get(socketId);
            socket!.leave(userId);
          });
        }
        socket.broadcast.emit("user-left", userId);
        prismaFromWishInstance.update(
          "users",
          ["updated_at"],
          [new Date()],
          ["id"],
          [userId]
        );
      }
      userId = "";
    });

    socket.on("check-connection", (checkId: string, callback) => {
      const socketsInRoom = this.io.sockets.adapter.rooms.get(checkId);
      if (socketsInRoom) {
        callback(true);
      } else {
        callback(false);
      }
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
    this.io.in(destinationId.toString()).emit("notify-match", {
      userId: originId,
      username: originUsername,
    });
  };

  notifyUnmatchBlock = (destinationId: number, originId: number) => {
    this.io.in(destinationId.toString()).emit("notify-unmatch-block", originId);
  };
}
