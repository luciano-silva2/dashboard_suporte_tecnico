import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../../../Firebase/firebase.jsx";
import { socket } from "../../../socket/socket.js";
import "../../Chat.css";

function ChatSideBar({ setTicketSelecionado }) {
    const [tickets, setTickets] = useState([]);
    const [usuariosOnline, setUsuariosOnline] = useState([]);
    const ticketsRef = collection(firestore, "tickets");

    const usuarioUid = auth.currentUser?.uid;
    const usuarioEmail = auth.currentUser?.email;

    // Conecta ao socket assim que o componente monta
    useEffect(() => {
        if (!auth.currentUser) return;

        // Envia evento de entrar com UID
        socket.emit("entrar", { uid: usuarioUid });

        // Escuta lista de usuários online
        socket.on("usuariosOnline", (usuarios) => {
            setUsuariosOnline(usuarios);
        });

        // Ao desmontar, avisa que o usuário saiu
        return () => {
            socket.emit("sair", usuarioUid);
            socket.off("usuariosOnline");
        };
    }, [usuarioUid]);

    // Monitora tickets do Firebase
    useEffect(() => {
        const unsubscribe = onSnapshot(ticketsRef, snapshot => {
            const dados = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTickets(dados);
        });
        return () => unsubscribe();
    }, []);

    // Filtra tickets que o usuário pode ver
    const ticketsFiltrados = tickets.filter(ticket => {
        if (!auth.currentUser) return false;

        if (ticket.email && ticket.email === usuarioEmail) return true;
        if (ticket.funcionarioId && ticket.funcionarioId === usuarioUid) return true;

        return false;
    });

    return (
        <div className="ChatSideBar">
            <ul className="contatos">
                {ticketsFiltrados.map(({ id, nome, status, funcionarioId }) => {
                    const estaOnline = usuariosOnline.includes(funcionarioId);
                    return (
                        <li key={id} className="contato" onClick={() => setTicketSelecionado(id)}>
                            {nome} - {status} {estaOnline && <span style={{color: "green"}}>● Online</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default ChatSideBar;
