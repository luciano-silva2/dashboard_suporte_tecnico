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

// Socket.io
io.on("connection", socket => {
  console.log("Usuário conectado:", socket.id);
  socket.on("mensagem", data => io.emit("mensagem", data));
  socket.on("disconnect", () => console.log("Usuário desconectado:", socket.id));
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