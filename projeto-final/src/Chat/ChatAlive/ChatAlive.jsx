import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestore } from "../../Firebase/firebase";
import { auth } from "../../Firebase/firebase";

function ChatAlive({ ticketId }) {
    const [novaMensagem, setNovaMensagem] = useState("");
    const [msgs, setMsgs] = useState([]);
    
    


    const mensagemRef = collection(firestore, "mensagens");

    useEffect(() => {
        if (!ticketId) return;
        console.log("ID Ticket: ", ticketId);

        const colecaoMensagens = collection(firestore, "mensagens");

        const q = query(colecaoMensagens, where("ticket", "==", ticketId), orderBy("horaEnviada"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mensagens = [];
            setMsgs([]);
            snapshot.forEach((doc) => {
                const dados = doc.data();
                const mensagemComId = {
                    id : doc.id,
                    ...dados,
                }
                mensagens.push(mensagemComId);
                console.log("Mensagem: ", doc.data().msg);
                });
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
                    <div className="Chat borda">
                        <div className="msgs">
                            {msgs.map(({ id, usuario, msg }) => (
                                <div key={id} className="mensagem-chat">
                                    <div className="conteudo-msg">{usuario} : {msg}</div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Escreva uma mensagem..."
                                value={novaMensagem}
                                onChange={(e) => setNovaMensagem(e.target.value)}
                            />
                            <button type="submit">Enviar</button>
                            {msgs.length}
                        </form>
                    </div>
                </div>
            </div>
        );
    }

export default ChatAlive;
