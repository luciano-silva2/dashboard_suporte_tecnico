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
import { useTable, usePagination, useSortBy } from "react-table";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  prioridades,
  statusOptions,
  tecnicos,
  filtrarTickets
} from './ticketsUtils';

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

  const columns = useMemo(() => [
    { Header: "Nome", accessor: "nome" },
    { Header: "Problema", accessor: "problema" },
    {
      Header: "Prioridade",
      accessor: "prioridade",
      Cell: ({ row, value }) => (
        <Select
          value={prioridades.find(opt => opt.value === value)}
          onChange={selected => atualizarCampo(row.original.id, 'prioridade', selected.value)}
          options={prioridades}
          classNamePrefix="react-select"
        />
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row, value }) => (
        <Select
          value={statusOptions.find(opt => opt.value === value)}
          onChange={selected => atualizarCampo(row.original.id, 'status', selected.value)}
          options={statusOptions}
          classNamePrefix="react-select"
        />
      ),
    },
    { Header: "Técnico", accessor: "tecnico" },
    {
      Header: "Data",
      accessor: "data",
      Cell: ({ value }) => value?.toLocaleDateString?.()
    },
    {
      Header: "Ações",
      accessor: "id",
      Cell: ({ value }) => (
        <button className="btn btn-danger btn-sm" onClick={() => excluirTicket(value)}>Excluir</button>
      ),
    },
  ], [atualizarCampo, excluirTicket]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = useTable({ columns, data: ticketsFiltrados }, useSortBy, usePagination);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => navigate('/criar-ticket')}>
          + Novo Ticket
        </button>
      </div>
      <div className="mb-4 p-3 border rounded bg-light shadow-sm">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nome ou problema..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <Select
              value={filtroStatus}
              onChange={setFiltroStatus}
              options={statusOptions}
              placeholder="Filtrar por status"
              classNamePrefix="react-select"
            />
          </div>
          <div className="col-md-2">
            <Select
              value={filtroPrioridade}
              onChange={setFiltroPrioridade}
              options={prioridades}
              placeholder="Filtrar por prioridade"
              classNamePrefix="react-select"
            />
          </div>
          <div className="col-md-2">
            <Select
              value={filtroTecnico}
              onChange={setFiltroTecnico}
              options={tecnicos}
              placeholder="Filtrar por técnico"
              classNamePrefix="react-select"
            />
          </div>
          <div className="col-md-1">
            <DatePicker
              selected={filtroDataInicial}
              onChange={setFiltroDataInicial}
              placeholderText="Data inicial"
              className="form-control"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="col-md-1">
            <DatePicker
              selected={filtroDataFinal}
              onChange={setFiltroDataFinal}
              placeholderText="Data final"
              className="form-control"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      <table {...getTableProps()} className="table table-striped table-hover">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-between my-3">
        <button className="btn btn-outline-primary" onClick={previousPage} disabled={!canPreviousPage}>
          &lt; Anterior
        </button>
        <button className="btn btn-outline-primary" onClick={nextPage} disabled={!canNextPage}>
          Próxima &gt;
        </button>
      </div>
    </div>
  );
}
