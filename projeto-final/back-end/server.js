const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Quando o usuário se identifica
  socket.on("usuario-online", (nomeUsuario) => {
    onlineUsers.set(socket.id, nomeUsuario);
    io.emit("lista-usuarios", Array.from(onlineUsers.values()));
  });

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    onlineUsers.delete(socket.id);
    io.emit("lista-usuarios", Array.from(onlineUsers.values()));
  });
});

server.listen(3001, () => {
  console.log("Servidor Socket.IO rodando na porta 3001");
});
