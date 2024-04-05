import { Server as HTTPServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";

export class WebSocket {
  io: SocketServer;

  constructor(appserver: HTTPServer) {
    this.io = new SocketServer(appserver, {
      cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "DELETE", "PUT"],
      },
    });

    this.io.on("connect", this.startListeners);
  }

  startListeners = (socket: Socket) => {
    console.log(socket.id);
    socket.on("chat message", (message: string) => {
      socket.broadcast.emit("receive-message", message);
      console.log(message);
    });
  };
}
