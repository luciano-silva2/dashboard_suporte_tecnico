import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { prioridades, statusOptions, tecnicos } from './ticketsUtils';

export default function CriarTicket() {
  const [nome, setNome] = useState('Antony');
  const [email, setEmail] = useState('');
  const [problema, setProblema] = useState('');
  const [prioridade, setPrioridade] = useState(null);
  const [status, setStatus] = useState(null);
  const [tecnico, setTecnico] = useState(null);
  const [dataCriacao, setDataCriacao] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setNome(user.displayName || "Usuário sem nome");
      setEmail(user.email || "");
    }
  }, []);




  const salvarDados = async (e) => {
    e.preventDefault();

    if (!email || !prioridade || !status || !tecnico) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await addDoc(collection(db, 'tickets'), {
        nome,
        email,
        problema,
        prioridade: prioridade.value,
        status: status.value,
        tecnico: tecnico.value,
        data: Timestamp.fromDate(dataCriacao),
      });

      alert("Ticket criado com sucesso");
      navigate('/tickets');
    } catch (erro) {
      console.error("Erro ao criar ticket:", erro);
    }
    console.log(auth)
  };

  return (
    <form onSubmit={salvarDados} className="border rounded p-4 shadow-sm bg-white mb-4">
      <h5 className="mb-3">Criar Novo Ticket</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            required
            readOnly={true}
          />
        </div>
        <div className="col-md-4">
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
            readOnly={true}
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
        <div className="col-md-4">
          <Select
            value={tecnico}
            onChange={setTecnico}
            options={tecnicos}
            placeholder="Técnico responsável"
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
