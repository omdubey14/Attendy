import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join:room", (room) => {
      socket.join(room);
    });

    socket.on("leave:room", (room) => {
      socket.leave(room);
    });
  });

  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
};
