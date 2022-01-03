const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getAllUsers,
} = require("./utils/users");
const server = http.createServer(app);
const io = socketio(server);

// io.emit(); //for all the clients
//static folder
app.use(express.static("./public"));

//Run when client connect
io.on("connection", (socket) => {
  console.log("New client joined");

  socket.emit("message", formatMessage("Admin", "Welcome to chatApp"));

  //BroadCast when a user connect except for the one who is connecting
  socket.on("joinRoom", ({ username }) => {
    const user = userJoin(socket.id, username);
    socket.broadcast.emit(
      "message",
      formatMessage("Admin", `${username} has joined a chat`)
    );

    //Send users info
    io.emit("roomusers", {
      users: getAllUsers(),
    });
  });

  //runs when clients disconnect

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      console.log(user.username);
      console.log(user);
      io.emit(
        "message",
        formatMessage("Admin", `${user[0].username} has left the chat `)
      );
    }
    io.emit("roomusers", {
      users: getAllUsers(),
    });
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(`${user.username}`, msg));
  });
});

const Port = 3000;

server.listen(Port, () => {
  console.log(`server running at ${Port}`);
});
