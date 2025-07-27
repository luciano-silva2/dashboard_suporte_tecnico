import React, { useState, useEffect } from "react";
import { collection, onSnapshot, Firestore, addDoc } from "firebase/firestore"
import { firestore } from "../../../Firebase/firebase.jsx";
import "../../Chat.css";
function ChatSideBar(){

    const [usuarios, setUsuarios] = useState([]);

    const RefUsuarios = collection(firestore, "mensagens");
    const RefTickets = collection(firestore, "tickets");
    useEffect(() => {
        const desconectar = onSnapshot(RefUsuarios, snapshot => {
            const usuariosCarregados = snapshot.docs.map( doc => ({
                id : doc.id,
                ...doc.data()
            }))
                const usuariosUnicos = [
                    ...new Map(
                        usuariosCarregados.map(u => [u.usuario, u])
                    ).values()
                    ];
            setUsuarios(usuariosUnicos)
        })
        return () => desconectar();
    })
    const lidarComSubmit = async (e) => {
        e.preventDefault();
        try{
            await addDoc(RefTickets, {
                reclamacao : "Preciso de ajuda",
            });
        }
        catch(error){
            console.log("Algo deu errado tentand criar o ticket, segue o erro" + error)
        }
    }


    return(
        <div 
        className="ChatSideBar">

            <ul className="contatos">
                <li className="addMsg">
                    <button
                    onClick={lidarComSubmit}>
                        Começar uma conversa
                    </button>
                </li>
                {usuarios.map(({ id, usuario}) => (
                    <li key={id} className="divMsg">
                        {usuario}
                    </li>
                ))}
                <li 
                className="contato">
                    Nome
                </li>
            </ul>

        </div>
    );
}

export default ChatSideBar;