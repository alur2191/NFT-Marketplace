import { Server } from "socket.io";
import userHandler from "../../utils/sockets/movementHandler";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    userHandler(io, socket);
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}