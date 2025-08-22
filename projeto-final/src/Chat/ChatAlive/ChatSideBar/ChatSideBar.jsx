import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../Firebase/firebase.jsx";
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

    return (
        <div className="ChatSideBar">
            <ul className="contatos">
                {tickets.map(({ id, nome, status }) => (
                    <li key={id} className="contato" onClick={() => setTicketSelecionado(id)}>
                        {nome} - {status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatSideBar;
