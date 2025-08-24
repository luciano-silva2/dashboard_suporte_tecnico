import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Rota API
app.get("/api/hello", (req, res) => res.json({ message: "Olá" }));

// Lista para rastrear os usuários online usando o e-mail como chave
const onlineUsers = new Map();

io.on("connection", socket => {
  console.log("Conexão de socket estabelecida:", socket.id);

  // Evento para quando um usuário entra
  socket.on("join", (userData) => {
    // Adiciona o usuário ao Map de usuários online usando o EMAIL como chave
    onlineUsers.set(userData.email, socket.id); 

    // Adição para mostrar o email no console do servidor
    console.log(`Usuário: ${userData.email} conectado com ID: ${socket.id}`);

    // Envia a lista atualizada de EMAILS para todos os clientes
    io.emit("usuariosOnline", Array.from(onlineUsers.keys()));
  });
  
  // Evento de desconexão
  socket.on("disconnect", () => {
    console.log("Socket desconectado:", socket.id);

    // Encontra e remove o usuário do Map pelo socket.id
    for (let [email, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
            console.log(`Usuário: ${email} desconectado.`);
            onlineUsers.delete(email);
            break;
        }
    }

    // Envia a lista atualizada de EMAILS para todos os clientes
    io.emit("usuariosOnline", Array.from(onlineUsers.keys()));
  });

  socket.on("mensagem", data => io.emit("mensagem", data));
});

// Serve React static files from the build directory within the `projeto-final` subfolder.
app.use(express.static(path.join(__dirname, "projeto-final", "build")));

// Fallback route for React.
// This route will catch all requests that do not match a file in 'build' or the `/api` route.
app.get(/^(?!.*\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "projeto-final", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));