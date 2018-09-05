const app = require("express")();
const socket = require("socket.io");

const io = socket(
  app.listen(3007, () => console.log("app listens to Port: 3007"))
);

io.on("connection", socket => {
  // io.engine.clientsCount Will give the number of connected users to the socket

  socket.on("join-chat", data => {
    // The Broadcast flag will send to all sockets except the one that sent the message
    socket.broadcast.emit("joined-chat", data.name);
  });
  socket.on("send-message", data => {
    //io.emit will broadcast the message to all users
    io.emit("message-received", data);
  });
  io.on("disconnect", () => {
    console.log("he out");
  });
});
