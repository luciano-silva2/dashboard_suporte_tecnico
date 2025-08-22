import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { firestore } from "../../Firebase/firebase";
import { auth } from "../../Firebase/firebase";

function ChatAlive({ ticketId }) {
    const [novaMensagem, setNovaMensagem] = useState("");
    const [msgs, setMsgs] = useState([]);

    useEffect(() => {
        if (!ticketId) return;

        // Referência para a subcoleção de mensagens do ticket
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

        setNovaMensagem("");
    };

    return (
        <div className="ChatAlive">
            <div className="Chat-div borda">
                <div className="msgs">
                    {msgs.map(({ id, usuarioNome, msg, tipo }) => {
                        const souEu = tipo === "funcionario" ? usuarioNome === auth.currentUser?.displayName : usuarioNome === auth.currentUser?.displayName;
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
