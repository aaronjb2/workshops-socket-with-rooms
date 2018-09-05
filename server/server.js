// shortcut for express
const app = require("express")();
const socket = require("socket.io");

// socket needs to wrap the express server
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

  socket.on("join-room", data => {
    // this will join the socket id to whatever room was passed to it, therefore will have access to all future messages emitted to this room until leave()
    socket.join(data.room);
    // Need to specify which room this message will be emitted to
    io.to(data.room).emit("room-message-received", {
      message: `new user to room ${data.room}`
    });
  });

  socket.on("send-room-message", data => {
    // to and in are interchangeable
    io.in(data.room).emit("send-room-message-received", {
      message: `${data.name} says: ${data.message}`
    });
  });

  io.on("disconnect", () => {
    console.log("he out");
  });
});
