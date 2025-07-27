import React, { useState, useEffect } from "react";
import { collection, onSnapshot, Firestore, addDoc } from "firebase/firestore"
import { firestore } from "../../../Firebase/firebase.jsx";
import "../../Chat.css";
function ChatSideBar(){

    const [usuarios, setUsuarios] = useState([]);

    const RefUsuarios = collection(firestore, "mensagens");
    const RefTickets = collection(firestore, "tickets");
    useEffect(() => {
        const desconectar = onSnapshot(RefTickets, snapshot => {
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
    


    return(
        <div 
        className="ChatSideBar">

            <ul className="contatos">
                {usuarios.map(({ id, usuario}) => (
                    <li key={id} className="divMsg">
                        {id}
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