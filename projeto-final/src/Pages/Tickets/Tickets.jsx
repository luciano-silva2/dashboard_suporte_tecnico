import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { db } from '../../Firebase/firebase';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  filtrarTickets
} from './ticketsUtils';
import TicketsExibicao from "./TicketsExibicao";

export default function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroPrioridade, setFiltroPrioridade] = useState(null);
  const [filtroDataInicial, setFiltroDataInicial] = useState(null);
  const [filtroDataFinal, setFiltroDataFinal] = useState(null);
  const [filtroTecnico, setFiltroTecnico] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        data: doc.data().data?.toDate?.() || new Date()
      }));
      setTickets(dados);
    });
    return () => unsubscribe();
  }, []);

  const excluirTicket = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'tickets', id));
      alert('Ticket excluído com sucesso');
    } catch (erro) {
      console.log(erro);
    }
  }, []);

  const atualizarCampo = useCallback(async (id, campo, valor) => {
    try {
      const ref = doc(db, 'tickets', id);
      await updateDoc(ref, { [campo]: valor });
    } catch (erro) {
      console.error(`Erro ao atualizar ${campo}:`, erro);
    }
  }, []);

  const ticketsFiltrados = useMemo(() => {
    return filtrarTickets(tickets, {
      searchTerm,
      filtroStatus,
      filtroPrioridade,
      filtroDataInicial,
      filtroDataFinal,
      filtroTecnico,
    });
  }, [tickets, searchTerm, filtroStatus, filtroPrioridade, filtroDataInicial, filtroDataFinal, filtroTecnico]);

  return (
    <TicketsExibicao
      navigate={navigate}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      filtroStatus={filtroStatus}
      setFiltroStatus={setFiltroStatus}
      filtroPrioridade={filtroPrioridade}
      setFiltroPrioridade={setFiltroPrioridade}
      filtroDataInicial={filtroDataInicial}
      setFiltroDataInicial={setFiltroDataInicial}
      filtroDataFinal={filtroDataFinal}
      setFiltroDataFinal={setFiltroDataFinal}
      filtroTecnico={filtroTecnico}
      setFiltroTecnico={setFiltroTecnico}
      ticketsFiltrados={ticketsFiltrados}
      atualizarCampo={atualizarCampo}
      excluirTicket={excluirTicket}
    />
  );
}
