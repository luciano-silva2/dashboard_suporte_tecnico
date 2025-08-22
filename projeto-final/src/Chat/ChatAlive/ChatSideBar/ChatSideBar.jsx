import React, { useState, useEffect } from "react";
import { collection, onSnapshot, Firestore, addDoc } from "firebase/firestore"
import { firestore } from "../../../Firebase/firebase.jsx";
import "../../Chat.css";
function ChatSideBar({ setTicketSelecionado }){

    const [usuarios, setUsuarios] = useState([]);

    
    const RefTickets = collection(firestore, "tickets");

    useEffect(() => {
        const desconectar = onSnapshot(RefTickets, snapshot => {
            const usuariosCarregados = snapshot.docs.map( doc => ({
                id : doc.id,
                ...doc.data()
            }))
                // const usuariosUnicos = [
                //     ...new Map(
                //         usuariosCarregados.map(u => [u.usuario, u])
                //     ).values()
                //     ];
            setUsuarios(usuariosCarregados);
        })
        return () => desconectar();
    })
    


    return(
        <div 
        className="ChatSideBar">

            <ul className="contatos">
                {usuarios.map(({ id }) => (
                    <li key={id} className="contato"
                    onClick={() => setTicketSelecionado(id)}>
                        {id}
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default ChatSideBar;