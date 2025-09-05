import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../../../Firebase/firebase.jsx";
import socket from "../../../socket/socket.js";
import "../../Chat.css";

function ChatSideBar({ setTicketSelecionado }) {
    const [tickets, setTickets] = useState([]);
    const [usuariosOnline, setUsuariosOnline] = useState([]);
    const [usuario, setUsuario] = useState(null);

    const ticketsRef = collection(firestore, "tickets");

    // Escuta mudanças de autenticação para ter o usuário atual
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUsuario(user);
        });
        return () => unsubscribeAuth();
    }, []);

    // Escuta a lista de usuários online vinda do servidor (eventos de join/disconnect)
    useEffect(() => {
        const handleUsersOnline = (usuarios) => {
            console.log("📡 Usuários online recebidos:", usuarios);
            setUsuariosOnline(usuarios);
        };

        socket.on("usuariosOnline", handleUsersOnline);
        
        return () => {
            socket.off("usuariosOnline", handleUsersOnline);
        };
    }, []);

    // Monitora os tickets em tempo real no Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(ticketsRef, (snapshot) => {
            const dados = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTickets(dados);
        });
        return () => unsubscribe();
    }, [ticketsRef]);

    
    

    return (
        <div className="ChatSideBar">
            <ul className="contatos">
                {tickets.map(({ id, nome, status, funcionarioId, clienteId }) => {
                    let estaOnline = false;
                    if(usuario.uid === funcionarioId){
                        estaOnline = usuariosOnline.some(u => u.idUsuario === clienteId);
                    }
                    else if(usuario.uid === clienteId){
                        estaOnline = usuariosOnline.some(u => u.idUsuario === funcionarioId);
                    }
                        
                    return (
                        <li 
                            key={id} 
                            className="contato" 
                            onClick={() => setTicketSelecionado(id)}
                        >
                            {nome} - {status} {estaOnline && <span style={{color: "green"}}>● Online</span>}
                        </li>
                    );
                })}
            </ul>
=======
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

>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
        </div>
    );
}

export default ChatSideBar;