import React, { useState, useEffect } from "react";
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    orderBy,
    query,
    where
} from "firebase/firestore";
import { firestore } from "../../Firebase/firebase";
import { auth } from "../../Firebase/firebase";

function ChatAlive({ ticketId }) {
    const [novaMensagem, setNovaMensagem] = useState("");
    const [msgs, setMsgs] = useState([]);

    const mensagemRef = collection(firestore, "mensagens");

    useEffect(() => {
        if (!ticketId) return;

        const q = query(
            mensagemRef,
            where("ticket", "==", ticketId),
            orderBy("horaEnviada")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mensagens = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setMsgs(mensagens);
        });

        return () => unsubscribe();
    }, [ticketId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (novaMensagem.trim() === "") return;

        try {
            await addDoc(mensagemRef, {
                ticket: ticketId,
                usuario: auth.currentUser?.displayName || "Anônimo",
                msg: novaMensagem,
                horaEnviada: serverTimestamp()
            });
        } catch (e) {
            console.error("Erro ao enviar mensagem: ", e);
        }

        setNovaMensagem("");
    };

    return (
        <div className="ChatAlive">
            <div className="Chat">
                {msgs.map(({ id, usuario, msg }) => (
                    <div key={id} className="divMsg">
                        {usuario} : {msg}
                    </div>
                ))}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Escreva uma mensagem..."
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                    />
                    <button type="submit">Enviar</button>
                    <div>Total de mensagens: {msgs.length}</div>
                </form>
            </div>
        </div>
    );
}

export default ChatAlive;
