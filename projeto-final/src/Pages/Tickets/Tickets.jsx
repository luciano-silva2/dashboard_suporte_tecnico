import React, { useState, useEffect, useMemo, useCallback } from "react";
import { db } from '../../Chat/Chat';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useTable } from "react-table";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [nome, setNome] = useState('');
  const [problema, setProblema] = useState('');
  const [prioridade, setPrioridade] = useState('');



  
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim().toLowerCase());
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const salvarDados = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'tickets'), { nome, problema, prioridade });
      setNome('');
      setProblema('');
      setPrioridade('');
      alert("Ticket criado com sucesso");
    } catch (erro) {
      console.log("Erro ao criar ticket:", erro);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const ticketsFiltrados = useMemo(() => {
    if (!searchTerm) return tickets;
    return tickets.filter(ticket =>
      ticket.nome.toLowerCase().includes(searchTerm) ||
      ticket.problema.toLowerCase().includes(searchTerm)
    );
  }, [searchTerm, tickets]);

  const columns = useMemo(() => [
    {
      Header: "Nome",
      accessor: "nome",
    },
    {
      Header: "Problema",
      accessor: "problema",
    },
    {
      Header: "Prioridade",
      accessor: "prioridade",
    },
    {
      Header: "Ações",
      accessor: "id",
      Cell: ({ value }) => (
        <button onClick={() => excluirTicket(value)}>Excluir</button>
      ),
    },
  ], [excluirTicket]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data: ticketsFiltrados });

  return (
    <div>
      <form onSubmit={salvarDados} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Digite seu nome"
          required
        />
        <input
          type="text"
          value={problema}
          onChange={e => setProblema(e.target.value)}
          placeholder="Digite seu problema"
          required
        />
        <input
          type="text"
          value={prioridade}
          onChange={e => setPrioridade(e.target.value)}
          placeholder="Digite a prioridade do problema"
          required
        />
        <button type="submit" id="botaoCriarTicket">Criar Ticket</button>
      </form>

      <input
        type="text"
        placeholder="Buscar tickets por nome ou problema..."
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        style={{
          marginBottom: '10px',
          padding: '8px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      <table
        {...getTableProps()}
        style={{ width: "100%", borderCollapse: "collapse", marginTop: '20px' }}
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  style={{ borderBottom: "2px solid black", padding: "10px", textAlign: "left" }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id} style={{ borderBottom: "1px solid gray" }}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    style={{ padding: "10px" }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
