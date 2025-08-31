import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUser } from "../../context/UserContext";

import { prioridades, statusOptions } from './ticketsUtils';

export default function CriarTicket() {
  const [problema, setProblema] = useState('');
  const [prioridade, setPrioridade] = useState(null);
  const [status, setStatus] = useState(null);
  const [dataCriacao, setDataCriacao] = useState(new Date());

  const usuario = useUser(); // pega user do auth + dados extras
  const navigate = useNavigate();

  const salvarDados = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user?.email || !prioridade || !status) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await addDoc(collection(db, 'tickets'), {
        nome: usuario.userData?.nome || user.displayName || "Usuário sem nome",
        email: user.email,
        problema,
        prioridade: prioridade.value,
        clienteId: user.uid,     // 🔑 garantido
        tecnico: null,
        funcionarioId: null,
        status: status.value,
        data: Timestamp.fromDate(dataCriacao),
      });

      alert("Ticket criado com sucesso");
      navigate('/tickets');
    } catch (erro) {
      console.error("Erro ao criar ticket:", erro);
    }
  };

  return (
    <form onSubmit={salvarDados} className="border rounded p-4 shadow-sm bg-white mb-4">
      <h5 className="mb-3">Criar Novo Ticket</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={usuario.userData?.nome || auth.currentUser?.displayName || ""}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <input
            type="email"
            className="form-control"
            value={auth.currentUser?.email || ""}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={problema}
            onChange={(e) => setProblema(e.target.value)}
            placeholder="Descreva o problema"
            required
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <Select
            value={prioridade}
            onChange={setPrioridade}
            options={prioridades}
            placeholder="Prioridade"
            classNamePrefix="react-select"
          />
        </div>
        <div className="col-md-4">
          <Select
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Status"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <DatePicker
            selected={dataCriacao}
            onChange={setDataCriacao}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data do ticket"
            className="form-control"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button type="submit" className="btn btn-primary px-4">
          Criar Ticket
        </button>
      </div>
    </form>
  );
}
