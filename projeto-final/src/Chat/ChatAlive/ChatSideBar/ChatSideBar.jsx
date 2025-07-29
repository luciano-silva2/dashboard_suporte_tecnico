import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, getDoc, query, where } from "firebase/firestore";
import { auth, firestore } from "../../../Firebase/firebase.jsx";
import "../../Chat.css";

function ChatSideBar({ setTicketSelecionado }) {
  const [tickets, setTickets] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    async function buscarTipoUsuario() {
      const usuarioAtual = auth.currentUser;
      if (!usuarioAtual) return;

      const docRef = doc(firestore, "usuarios", usuarioAtual.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTipoUsuario(docSnap.data().tipo);
      }
    }

    buscarTipoUsuario();
  }, []);

  useEffect(() => {
    const usuarioAtual = auth.currentUser;
    if (!usuarioAtual || !tipoUsuario) return;

    let q = collection(firestore, "tickets");

    if (tipoUsuario !== "admin") {
      q = query(q, where("usuario", "==", usuarioAtual.uid));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const ticketsFiltrados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsFiltrados);
    });

    return () => unsub();
  }, [tipoUsuario]);

  return (
    <div className="ChatSideBar">
      <ul className="contatos">
        {tickets.map(({ id, nome, problema }) => (
          <li
            key={id}
            className="contato"
            onClick={() => setTicketSelecionado(id)}
            style={{ cursor: "pointer" }}
          >
            {nome || id} - {problema || "Sem descrição"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatSideBar;
