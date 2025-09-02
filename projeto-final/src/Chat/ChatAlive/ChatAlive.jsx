import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc } from "firebase/firestore"; // <- adicionei doc
import { firestore } from "../../Firebase/firebase";
import { auth } from "../../Firebase/firebase";
import { useUser } from "../../context/UserContext.jsx";
import socket from "../../socket/socket.js"

function ChatAlive({ ticketId }) {
    const [novaMensagem, setNovaMensagem] = useState("");
    const [msgs, setMsgs] = useState([]);
    const { usuario } = useUser();
    const [ticket, setTicket] = useState(null);

    // 🔹 Buscar o ticket específico
    useEffect(() => {
        if (!ticketId) return;

        const docRef = doc(firestore, "tickets", ticketId);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                setTicket({
                    id: snapshot.id,
                    ...snapshot.data()
                });
            } else {
                setTicket(null);
            }
        });

        return () => unsubscribe();
    }, [ticketId]);

    // 🔹 Buscar mensagens do ticket
    useEffect(() => {
        if (!ticketId) return;

        const colecaoMensagens = collection(firestore, "tickets", ticketId, "mensagens");
        const q = query(colecaoMensagens, orderBy("horaEnviada"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mensagens = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMsgs(mensagens);
        });

        return () => unsubscribe();
    }, [ticketId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim()) return;

        try {
            const colecaoMensagens = collection(firestore, "tickets", ticketId, "mensagens");
            await addDoc(colecaoMensagens, {
                usuarioId: auth.currentUser?.uid,
                usuarioNome: auth.currentUser?.displayName || "Anônimo",
                msg: novaMensagem,
                tipo: auth.currentUser?.tipo || "cliente",
                horaEnviada: serverTimestamp(),
            });
        } catch (e) {
            console.error("Erro ao enviar mensagem: ", e);
        }

        socket.emit("mensagem", {
            destinatarioEmail: ticket?.emailDestinatario,
            remetente: auth.currentUser?.displayName || "Anônimo",
            msg: novaMensagem
        });

        setNovaMensagem("");
    };

    return (
        <div className="ChatAlive">
            <div className="Chat-div borda">
                <div className="msgs">
                    {msgs.map(({ id, usuarioNome, msg, tipo }) => {
                        const souEu = usuarioNome === auth.currentUser?.displayName;
                        return (
                            <div key={id} className={souEu ? "mensagem-chat" : "mensagem-chat-outro"}>
                                <div className="conteudo-msg">
                                    {!souEu && <strong>{usuarioNome}: </strong>}
                                    {msg}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Escreva uma mensagem..."
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
}

export default ChatAlive;
