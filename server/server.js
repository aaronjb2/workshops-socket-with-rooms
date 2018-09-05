// shortcut for express
const app = require("express")();
const socket = require("socket.io");

// socket needs to wrap the express server
const io = socket(
  app.listen(3007, () => console.log("app listens to Port: 3007"))
);

io.on("connection", socket => {
  // io.engine.clientsCount Will give the number of connected users to the socket
  socket.on("workshop-socket-listener", data => {
    socket.emit("client-listener", { name: data.name });
  });
});
