import React, { useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { exportarCSV, exportarPDF, prioridades, statusOptions, tecnicos } from './ticketsUtils';
import Modal from "./Modal";

export default function TicketsExibicao({
    navigate,
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
    excluirTicket
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const columns = useMemo(() => [
        { Header: "Nome", accessor: "nome" },
        { Header: "Email", accessor: "email" },
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
                </div>
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
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data: ticketsFiltrados,
            initialState: { pageSize: 5 }
        },
        useSortBy,
        usePagination
    );

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
                    <p>Nenhum ticket selecionado.</p>
                )}
            </Modal>

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={() => navigate('/criar-ticket')}>
                    + Novo Ticket
                </button>
            </div>

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={() => exportarCSV(ticketsFiltrados)}>Exportar CSV</button>
            </div>

            <div className="mb-4 p-3 border rounded bg-light shadow-sm">
                <div className="row g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nome, email ou problema..."
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

            <div className="d-flex justify-content-between align-items-center my-3">
                <div>
                    <label className="me-2">Tickets por página:</label>
                    <select
                        className="form-select d-inline-block w-auto"
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 20, 50].map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    Página {pageIndex + 1} de {Math.ceil(ticketsFiltrados.length / pageSize)} ({ticketsFiltrados.length} tickets)
                </div>

                <div>
                    <button className="btn btn-outline-primary me-2" onClick={previousPage} disabled={!canPreviousPage}>
                        &lt; Anterior
                    </button>
                    <button className="btn btn-outline-primary" onClick={nextPage} disabled={!canNextPage}>
                        Próxima &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
