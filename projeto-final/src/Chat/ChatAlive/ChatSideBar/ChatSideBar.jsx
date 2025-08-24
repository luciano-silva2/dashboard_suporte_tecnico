import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../../../Firebase/firebase.jsx";
import socket from "../../../socket/socket.js";
import "../../Chat.css";

function ChatSideBar({ setTicketSelecionado }) {
    const [tickets, setTickets] = useState([]);
    const [usuariosOnline, setUsuariosOnline] = useState([]);
    const [usuario, setUsuario] = useState(null);

    const ticketsRef = collection(firestore, "tickets");

    // Escuta mudanças de autenticação para ter o usuário atual
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUsuario(user);
        });
        return () => unsubscribeAuth();
    }, []);

    // Escuta a lista de usuários online vinda do servidor (eventos de join/disconnect)
    useEffect(() => {
        const handleUsersOnline = (usuarios) => {
            setUsuariosOnline(usuarios);
        };

        socket.on("usuariosOnline", handleUsersOnline);
        
        return () => {
            socket.off("usuariosOnline", handleUsersOnline);
        };
    }, []);

    // Monitora os tickets em tempo real no Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(ticketsRef, (snapshot) => {
            const dados = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTickets(dados);
        });
        return () => unsubscribe();
    }, [ticketsRef]);

    // Filtra os tickets que o usuário pode visualizar
    const ticketsFiltrados = tickets.filter(ticket => {
        if (!usuario) return false;
        if (ticket.email && ticket.email === usuario.email) return true;
        if (ticket.funcionarioId && ticket.funcionarioId === usuario.uid) return true;
        return false;
    });

    return (
        <div className="ChatSideBar">
            <ul className="contatos">
                {ticketsFiltrados.map(({ id, nome, status, funcionarioId, email }) => {
                    // VERIFICA AGORA PELO E-MAIL que o servidor está enviando
                    const estaOnline = usuario && funcionarioId && funcionarioId !== usuario.uid && usuariosOnline.includes(email);
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