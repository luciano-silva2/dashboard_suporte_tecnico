import React, { useMemo, useState } from "react";
import { MaterialReactTable } from 'material-react-table';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { exportarCSV, prioridades, statusOptions } from './ticketsUtils';
import Modal from "./Modal";
import AtenderTicketButton from "./AtenderTicketButton";
import { auth, db } from '../../Firebase/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function TicketsExibicao({
    setTicketSelecionado,
    navigate,
    ticketsFiltrados,
    atualizarCampo,
    excluirTicket,
    isFuncionario,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [novoTicket, setNovoTicket] = useState({
        nome: '',
        email: '',
        clienteId: null,
        funcionarioId: null,
        problema: '',
        prioridade: null,
        status: null,
        tecnico: '',
        data: new Date(),
    });

    const abrirModalNovoTicket = () => {
        const user = auth.currentUser;
        setSelectedTicket(null);
        setNovoTicket({
            nome: user?.displayName || '',
            email: user?.email || '',
            clienteId: user?.uid || null,
            funcionarioId: null,
            problema: '',
            prioridade: null,
            status: null,
            tecnico: '',
            data: new Date(),
        });
        setIsModalOpen(true);
    };

    const salvarNovoTicket = async () => {
        try {
            await addDoc(collection(db, 'tickets'), {
                ...novoTicket,
                prioridade: novoTicket.prioridade?.value || null,
                status: novoTicket.status?.value || null,
                data: novoTicket.data || serverTimestamp(),
                clienteId: novoTicket.clienteId || auth.currentUser?.uid,
            });
            alert('Ticket criado com sucesso!');
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Erro ao criar ticket.');
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'nome', header: 'Nome' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'problema', header: 'Problema' },
        {
            accessorKey: 'prioridade',
            header: 'Prioridade',
            Cell: ({ cell, row }) => (
                <Select
                    value={prioridades.find(opt => opt.value === cell.getValue())}
                    onChange={selected => atualizarCampo(row.original.id, 'prioridade', selected.value)}
                    options={prioridades}
                    classNamePrefix="react-select"
                />
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ cell, row }) => (
                <Select
                    value={statusOptions.find(opt => opt.value === cell.getValue())}
                    onChange={selected => atualizarCampo(row.original.id, 'status', selected.value)}
                    options={statusOptions}
                    classNamePrefix="react-select"
                />
            ),
        },
        { accessorKey: 'tecnico', header: 'Técnico' },
        {
            accessorKey: 'data',
            header: 'Data',
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
        },
        {
            accessorKey: 'acoes',
            header: 'Ações',
            Cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => {
                            setSelectedTicket(row.original);
                            setIsModalOpen(true);
                        }}
                    >
                        Ver Detalhes
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => excluirTicket(row.original.id)}
                    >
                        Excluir
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate("/chat")}
                    >
                        Abrir Chat
                    </button>
                    {isFuncionario && row.original.status === "aberto" && !row.original.funcionarioId && (
                        <AtenderTicketButton
                            ticket={row.original}
                            currentUser={auth.currentUser}
                            isFuncionario={isFuncionario}
                            onAfter={() => {}}
                        />
                    )}
                </div>
            )
        },
    ], [atualizarCampo, excluirTicket, isFuncionario]);

    return (
        <div className="container my-4">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedTicket ? (
                    <div>
                        <h5>Detalhes do Ticket</h5>
                        <p><strong>Nome:</strong> {selectedTicket.nome}</p>
                        <p><strong>Email:</strong> {selectedTicket.email}</p>
                        <p><strong>Problema:</strong> {selectedTicket.problema}</p>
                        <p><strong>Prioridade:</strong> {selectedTicket.prioridade}</p>
                        <p><strong>Status:</strong> {selectedTicket.status}</p>
                        <p><strong>Técnico:</strong> {selectedTicket.tecnico}</p>
                        <p><strong>Data:</strong> {selectedTicket.data?.toLocaleDateString()}</p>
                    </div>
                ) : (
                    <div>
                        <h5>Criar Novo Ticket</h5>
                        <input
                            className="form-control mb-2"
                            placeholder="Problema"
                            value={novoTicket.problema}
                            onChange={e => setNovoTicket({...novoTicket, problema: e.target.value})}
                        />
                        <Select
                            options={prioridades}
                            value={novoTicket.prioridade}
                            onChange={opt => setNovoTicket({...novoTicket, prioridade: opt})}
                            placeholder="Prioridade"
                            classNamePrefix="react-select"
                        />
                        <Select
                            options={statusOptions}
                            value={novoTicket.status}
                            onChange={opt => setNovoTicket({...novoTicket, status: opt})}
                            placeholder="Status"
                            classNamePrefix="react-select"
                        />
                        <input
                            className="form-control mt-2"
                            placeholder="Técnico"
                            value={novoTicket.tecnico}
                            onChange={e => setNovoTicket({...novoTicket, tecnico: e.target.value})}
                        />
                        <DatePicker
                            selected={novoTicket.data}
                            onChange={date => setNovoTicket({...novoTicket, data: date})}
                            className="form-control mt-2"
                            dateFormat="dd/MM/yyyy"
                        />
                        <button
                            type="button"
                            className="btn btn-primary mt-3"
                            onClick={salvarNovoTicket}
                        >
                            Salvar
                        </button>
                    </div>
                )}
            </Modal>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-success" onClick={abrirModalNovoTicket}>+ Novo Ticket</button>
                <button className="btn btn-danger" onClick={() => exportarCSV(ticketsFiltrados)}>Exportar CSV</button>
            </div>

            <MaterialReactTable
                columns={columns}
                data={ticketsFiltrados}
                enablePagination
                initialState={{ pagination: { pageSize: 5 } }}
                muiTableProps={{ className: 'table-striped table-hover' }}
                enableSorting
            />
        </div>
    );
}
