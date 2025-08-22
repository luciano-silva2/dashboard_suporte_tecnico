import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

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
    const termo = searchTerm?.toLowerCase() || "";


    const matchesSearch =
      !termo ||
      ticket.nome?.toLowerCase().includes(termo) ||
      ticket.problema?.toLowerCase().includes(termo) ||
      ticket.email?.toLowerCase().includes(termo);

    const matchesStatus = filtroStatus ? ticket.status === filtroStatus.value : true;
    const matchesPrioridade = filtroPrioridade ? ticket.prioridade === filtroPrioridade.value : true;
    const matchesData =
      (!filtroDataInicial || ticket.data >= filtroDataInicial) &&
      (!filtroDataFinal || ticket.data <= filtroDataFinal);
    const matchesTecnico = filtroTecnico ? ticket.tecnico === filtroTecnico.value : true;

    return matchesSearch && matchesStatus && matchesPrioridade && matchesData && matchesTecnico;
  });
}

export function exportarCSV(tickets) {

  const cabecalho = ["Nome", "Email", "Problema", "Prioridade", "Status", "Técnico", "Data"];
  
  const linhas = tickets.map(t => [
    t.nome,
    t.email || '',
    t.problema,
    t.prioridade,
    t.status,
    t.tecnico,
    t.data?.toLocaleDateString?.() || ''
  ]);

  const csvContent = [
    cabecalho.join(","),
    ...linhas.map(linha => linha.map(escapeCSV).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'tickets.csv');
}

function escapeCSV(valor) {
  if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"') || valor.includes('\n'))) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor ?? '';
}
