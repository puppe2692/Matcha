//id will need to be passed as a string
export let activeUsers = new Map<string, User>();

export class User {
  id: number;
  email: string;
  username: string;
  active_sockets: string[];

  constructor(id: number, email: string, username: string) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.active_sockets = [];
  }

  addSocket = (socketId: string): void => {
    if (!this.active_sockets.includes(socketId)) {
      this.active_sockets.concat(socketId);
    }
  };

  removeSocket = (socketId: string): void => {
    const idx = this.active_sockets.indexOf(socketId);
    if (idx !== -1) {
      this.active_sockets.splice(idx, 1);
    }
  };

  removeAllSockets = (): void => {
    this.active_sockets = [];
  };

  isConnected = (): boolean => {
    return this.active_sockets.length >= 1;
  };
}
