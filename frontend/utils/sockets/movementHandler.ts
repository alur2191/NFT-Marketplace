export default (io, socket) => {
  const createdPosition = (position) => {
    socket.broadcast.emit("newIncomingPosition", position);
  };

  socket.on("createdPosition", createdPosition);
};