import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../../../Firebase/firebase.jsx";
import socket from "../../../socket/socket.js"; // This is correct
import "../../Chat.css";

function ChatSideBar({ setTicketSelecionado }) {
    const [tickets, setTickets] = useState([]);
    const [usuariosOnline, setUsuariosOnline] = useState([]);
    const [usuario, setUsuario] = useState(null);

    const ticketsRef = collection(firestore, "tickets");

    // Escuta login/logout do Firebase só para ter o usuário atual
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUsuario(user);
        });
        return () => unsubscribe();
    }, []);

    // Escuta usuários online vindos do socket
    useEffect(() => {
        socket.on("usuariosOnline", (usuarios) => {
            setUsuariosOnline(usuarios);
        });
        return () => {
            socket.off("usuariosOnline");
        };
    }, []);

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
        if (!usuario) return false;
        if (ticket.email && ticket.email === usuario.email) return true;
        if (ticket.funcionarioId && ticket.funcionarioId === usuario.uid) return true;
        return false;
    });

    return (
        <div className="ChatSideBar">
            <ul className="contatos">
                {ticketsFiltrados.map(({ id, nome, status, funcionarioId }) => {
                    const estaOnline = usuario && funcionarioId && funcionarioId !== usuario.uid && usuariosOnline.includes(funcionarioId);
                    return (
                        <li 
                            key={id} 
                            className="contato" 
                            onClick={() => setTicketSelecionado(id)}
                        >
                            {nome} - {status} {estaOnline && <span style={{color: "green"}}>● Online</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default ChatSideBar;
