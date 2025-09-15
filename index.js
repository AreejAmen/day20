const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  // المستخدم يعلن اسمه بعد ما يعمل login
  socket.on("login", (username) => {
    socket.username = username; // نخزن الاسم في socket
    socket.join(username);      // نخليه يدخل روم باسمه
    console.log(`${username} logged in and joined room: ${username}`);
  });

  // إرسال رسالة لشخص محدد
  socket.on("sendToUser", ({ to, message }) => {
    console.log(`${socket.username} -> ${to}: ${message}`);
    io.to(to).emit("privateMessage", {
      from: socket.username,
      message: message
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username || socket.id} disconnected`);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});