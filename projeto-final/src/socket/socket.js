// socket.js
import { io } from "socket.io-client";
import { auth } from "../Firebase/firebase.jsx";


// 👇 aqui precisa ser o link com -3001 (porta do seu servidor)
export const socket = io("https://ideal-space-cod-v6pvww7qppjgcwj67-3001.app.github.dev", {
  transports: ["websocket", "polling"],
});

// Monitora login/logout do Firebase
auth.onAuthStateChanged((user) => {
  if (user) {
    // Usuário logou
    socket.emit("entrar", { uid: user.uid, nome: user.displayName || "Anônimo" });
  } else {
    // Usuário saiu
    socket.emit("sair", user?.uid);
  }
});
