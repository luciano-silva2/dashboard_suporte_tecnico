import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../../../Firebase/firebase.jsx";
import "../../Chat.css";

function ChatSideBar({ setTicketSelecionado }) {
    const [tickets, setTickets] = useState([]);
    const ticketsRef = collection(firestore, "tickets");

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

    const usuarioUid = auth.currentUser?.uid;
    const usuarioEmail = auth.currentUser?.email;

    // Aqui filtramos os tickets para mostrar apenas os que pertencem ao usuário
    const ticketsFiltrados = tickets.filter(ticket => {
        if (!auth.currentUser) return false;

        // Cliente só vê tickets que criou
        if (ticket.email && ticket.email === usuarioEmail) return true;

        // Funcionário só vê tickets que está associado
        if (ticket.funcionarioId && ticket.funcionarioId === usuarioUid) return true;

        return false;
    });

    return (
        <div className="ChatSideBar">
            <ul className="contatos">
                {ticketsFiltrados.map(({ id, nome, status }) => (
                    <li key={id} className="contato" onClick={() => setTicketSelecionado(id)}>
                        {nome} - {status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatSideBar;
