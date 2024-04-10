import { Server as HTTPServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { activeUsers, User } from "../users/user";

interface Message {
  content: string;
  recipient: string;
}

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
    if (activeUsers.has(userId)) {
      const curUser: User = activeUsers.get(userId)!;
      curUser.addSocket(socket.id);
    }

    socket.on("disconnect", () => {
      if (activeUsers.has(userId)) {
        const curUser: User = activeUsers.get(userId)!;
        curUser.removeSocket(socket.id);
      }
      // console.log("disconnection " + socket.id);
      // console.log("disconneced user " + userId);
    });

    socket.on("chat message", (message: Message) => {
      socket.broadcast.emit("receive-message", {
        content: message.content,
        sender: activeUsers.get(userId)?.username,
      });
      console.log(message);
    });

    socket.on("login", (userId: string) => {
      if (activeUsers.has(userId)) {
        const curUser: User = activeUsers.get(userId)!;
        curUser.addSocket(socket.id);
      }
    });

    socket.on("logout", (userId: string) => {
      if (activeUsers.has(userId)) {
        const curUser: User = activeUsers.get(userId)!;
        curUser.removeAllSockets();
      }
      userId = "-1";
    });
  };
}
