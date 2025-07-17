import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot } from "firebase/firestore"
import { firestore } from "../Chat";
import { auth } from "../Chat";
 
function ChatAlive(){


    const [novaMensagem, setNovaMensagem] = useState("");
    const [msgs , setMsgs] = useState([])
    const ReferenciaDeMensagens = collection(firestore, "mensagens")

    useEffect(() => {
        const desconectar = onSnapshot(ReferenciaDeMensagens, (snapshot) => {
            const msgsCarregadas = snapshot.docs.map( doc =>  ({
                id: doc.id,
                ...doc.data()
            }));
            setMsgs(msgsCarregadas)
        });
        return () => desconectar();

    }, []);

   

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
                {msgs.map(({ id, usuario, msg}) => (
                    <div key={id} className="divMsg">
                        {usuario} : {msg}
                    </div>
                ))}
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