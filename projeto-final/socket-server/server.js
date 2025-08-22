// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO
const io = new Server(server, {
  cors: { origin: "*" } // permite qualquer origem (pode restringir depois)
});

let usuariosOnline = {};

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  // Usuário entra (login)
  socket.on("entrar", (usuario) => {
    usuariosOnline[usuario.uid] = socket.id;
    io.emit("usuariosOnline", Object.keys(usuariosOnline));
    console.log("Usuários online:", Object.keys(usuariosOnline));
  });

  // Usuário sai manualmente
  socket.on("sair", (uid) => {
    delete usuariosOnline[uid];
    io.emit("usuariosOnline", Object.keys(usuariosOnline));
    console.log("Usuário saiu:", uid);
  });

  // Usuário desconecta (fecha aba ou perde conexão)
  socket.on("disconnect", () => {
    for (let uid in usuariosOnline) {
      if (usuariosOnline[uid] === socket.id) {
        delete usuariosOnline[uid];
      }
    }
    io.emit("usuariosOnline", Object.keys(usuariosOnline));
    console.log("Usuário desconectado:", socket.id);
  });

  // Nova mensagem
  socket.on("novaMensagem", (msg) => {
    io.emit("receberMensagem", msg);
  });
});

server.listen(3001, () => console.log("✅ Socket.IO rodando na porta 3001"));
