import React, { useMemo, useState } from "react";
import { MaterialReactTable } from 'material-react-table';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
<<<<<<< HEAD
import { exportarCSV, prioridades, statusOptions } from './ticketsUtils';
import Modal from "./Modal";
import AtenderTicketButton from "./AtenderTicketButton";
import { auth, db } from '../../Firebase/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
=======
import { exportarCSV, prioridades, statusOptions, tecnicos } from './ticketsUtils';
import Modal from "./Modal";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../Firebase/firebase'; // ajuste o caminho conforme seu projeto
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386

export default function TicketsExibicao({
    setTicketSelecionado,
    navigate,
<<<<<<< HEAD
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
=======
    searchInput,
    setSearchInput,
    filtroStatus,
    setFiltroStatus,
    filtroPrioridade,
    setFiltroPrioridade,
    filtroDataInicial,
    setFiltroDataInicial,
    filtroDataFinal,
    setFiltroDataFinal,
    filtroTecnico,
    setFiltroTecnico,
    ticketsFiltrados,
    atualizarCampo,
    excluirTicket,
    onTicketCriado, // novo callback para atualizar lista no pai
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Novo estado para criação
    const [novoNome, setNovoNome] = useState('');
    const [novoEmail, setNovoEmail] = useState('');
    const [novoProblema, setNovoProblema] = useState('');
    const [novaPrioridade, setNovaPrioridade] = useState(null);
    const [novoStatus, setNovoStatus] = useState(null);
    const [novoTecnico, setNovoTecnico] = useState('');
    const [novaData, setNovaData] = useState(new Date());

    // Função salvar novo ticket
    const salvarNovoTicket = async () => {
        try {
            const docRef = await addDoc(collection(firestore, 'tickets'), {
                nome: novoNome,
                email: novoEmail,
                problema: novoProblema,
                prioridade: novaPrioridade ? novaPrioridade.value : null,
                status: novoStatus ? novoStatus.value : null,
                tecnico: novoTecnico,
                data: novaData || serverTimestamp(),
            });
            alert('Ticket criado com sucesso!');
            setIsModalOpen(false);
            // Limpar campos
            setNovoNome('');
            setNovoEmail('');
            setNovoProblema('');
            setNovaPrioridade(null);
            setNovoStatus(null);
            setNovoTecnico('');
            setNovaData(new Date());
            if (onTicketCriado) onTicketCriado(); // informa o componente pai para atualizar
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            alert('Erro ao criar ticket');
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
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
<<<<<<< HEAD
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
=======
                    className="btn btn-primary btn-sm"
                    onClick={ () => {
                        setTicketSelecionado(row.original);
                        navigate("/chat");
                        }}
                    >
                        Abrir Chat
                    </button>
                </div>
            )
        },
    ], [atualizarCampo, excluirTicket]);

    return (
        <div className="container my-4">
            {/* Modal de detalhes */}
            <Modal isOpen={isModalOpen && selectedTicket !== null} onClose={() => {
                setIsModalOpen(false);
                setSelectedTicket(null);
            }}>
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
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
<<<<<<< HEAD
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

=======
                ) : null}
            </Modal>

            {/* Modal de criar novo ticket */}
            <Modal isOpen={isModalOpen && selectedTicket === null} onClose={() => setIsModalOpen(false)}>
                <h5>Criar Novo Ticket</h5>
                <div className="mb-3">
                    <label>Nome</label>
                    <input type="text" className="form-control" value={novoNome} onChange={e => setNovoNome(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Problema</label>
                    <textarea className="form-control" value={novoProblema} onChange={e => setNovoProblema(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Prioridade</label>
                    <Select
                        options={prioridades}
                        value={novaPrioridade}
                        onChange={setNovaPrioridade}
                        classNamePrefix="react-select"
                        isClearable
                    />
                </div>
                <div className="mb-3">
                    <label>Status</label>
                    <Select
                        options={statusOptions}
                        value={novoStatus}
                        onChange={setNovoStatus}
                        classNamePrefix="react-select"
                        isClearable
                    />
                </div>
                <div className="mb-3">
                    <label>Técnico</label>
                    <input type="text" className="form-control" value={novoTecnico} onChange={e => setNovoTecnico(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Data</label>
                    <DatePicker selected={novaData} onChange={setNovaData} className="form-control" dateFormat="dd/MM/yyyy" />
                </div>
                <button className="btn btn-primary" onClick={salvarNovoTicket}>Salvar</button>
                <button className="btn btn-secondary ms-2" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </Modal>

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={() => {
                    setSelectedTicket(null);
                    setIsModalOpen(true);
                }}>
                    + Novo Ticket
                </button>
            </div>

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={() => exportarCSV(ticketsFiltrados)}>Exportar CSV</button>
            </div>

            <div className="mb-4 p-3 border rounded bg-light shadow-sm">
                {/* Seus filtros */}
                {/* ... seu código dos filtros igual ao seu original ... */}
            </div>

>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
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
