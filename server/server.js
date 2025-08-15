const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); 

const io = new Server(server, { 
  cors: { origin: "http://localhost:5173" } // Vite dev URL
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send_message", (message) => {
    io.emit("receive_message", { id: socket.id, text: message });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));
