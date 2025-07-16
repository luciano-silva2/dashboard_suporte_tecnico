import React, { useState, useEffect } from "react";
import { collection, onSnapshot, Firestore } from "firebase/firestore"
import { firestore } from "../../Chat";
import "../../Chat.css";
function ChatSideBar(){

    const [usuarios, setUsuarios] = useState([]);

    const RefUsuarios = collection(firestore, "mensagens");

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



    return(
        <div 
        className="ChatSideBar">

            <ul className="contatos">
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