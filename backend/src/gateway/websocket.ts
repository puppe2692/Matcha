import { server as appServer } from "../server";
import { Server } from "socket.io";

export const io = new Server(appServer);
