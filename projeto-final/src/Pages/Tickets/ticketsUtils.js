export const prioridades = [
  { value: 'urgente', label: 'Urgente' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' }
];

export const statusOptions = [
  { value: 'aberto', label: 'Aberto' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'resolvido', label: 'Resolvido' },
  { value: 'cancelado', label: 'Cancelado' }
];

export const tecnicos = [
  { value: 'joao', label: 'João' },
  { value: 'ana', label: 'Ana' },
  { value: 'maria', label: 'Maria' }
];

export function filtrarTickets(tickets, filtros) {
  const {
    searchTerm,
    filtroStatus,
    filtroPrioridade,
    filtroDataInicial,
    filtroDataFinal,
    filtroTecnico,
  } = filtros;

  return tickets.filter(ticket => {
    const matchesSearch =
      ticket.nome.toLowerCase().includes(searchTerm) ||
      ticket.problema.toLowerCase().includes(searchTerm);

    const matchesStatus = filtroStatus ? ticket.status === filtroStatus.value : true;
    const matchesPrioridade = filtroPrioridade ? ticket.prioridade === filtroPrioridade.value : true;
    const matchesData = (!filtroDataInicial || ticket.data >= filtroDataInicial) &&
                        (!filtroDataFinal || ticket.data <= filtroDataFinal);
    const matchesTecnico = filtroTecnico ? ticket.tecnico === filtroTecnico.value : true;

    return matchesSearch && matchesStatus && matchesPrioridade && matchesData && matchesTecnico;
  });
}
