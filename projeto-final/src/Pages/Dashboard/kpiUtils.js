export function calcularKPIs(tickets) {
  const total = tickets.length;
  const abertos = tickets.filter(t => t.status === 'aberto').length;
  const resolvidos = tickets.filter(t => t.status === 'resolvido').length;
  const pendentes = tickets.filter(t => t.status === 'em_andamento').length;

  const porTecnico = tickets.reduce((acc, ticket) => {
    if (ticket.tecnico) {
      acc[ticket.tecnico] = (acc[ticket.tecnico] || 0) + 1;
    }
    return acc;
  }, {});

  const sla = total > 0 ? (resolvidos / total) * 100 : 0;
  
  const mediaResolucao = "Dados insuficientes";

  return {
    total,
    abertos,
    resolvidos,
    pendentes,
    mediaResolucao,
    porTecnico,
    sla,
  };
}