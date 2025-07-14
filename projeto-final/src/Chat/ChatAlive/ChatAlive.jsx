import React from "react";
import { useState } from "react";
import { addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore"
import { firestore } from "../Chat";
import { auth } from "../Chat";

function ChatAlive(){


    const [novaMensagem, setNovaMensagem] = useState("");

    const [msgs, setMsgs] = useState([])
    const ReferenciaDeMensagens = collection(firestore, "mensagens")

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(novaMensagem)
        if(novaMensagem.trim() === "") return;
        try{
            await addDoc(ReferenciaDeMensagens, {
                usuario : auth.currentUser.displayName,
                msg : novaMensagem,
                horaEnviada : serverTimestamp(),

            });
        }
        catch(e){
            console.error("Algo deu errado, aqui vai o erro: " + e)
        }
        setNovaMensagem("")

    }
    return(
        <div className="ChatAlive">
            <div className="Chat">
                <form
                onSubmit={handleSubmit}>
                    <input type="text"
                    placeholder="Escreva uma mensagem..." 
                    value={novaMensagem}
                    onChange={(msg) => setNovaMensagem(msg.target.value)} />
                    <button
                    type="submit">
                        Enviar
                    </button>
                </form>
                
                
            </div>
        </div>
    );
}
export default ChatAlive;