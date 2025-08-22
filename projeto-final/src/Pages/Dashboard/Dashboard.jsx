import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../Firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FaTicketAlt, FaTools, FaCheckCircle, FaClock } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { calcularKPIs } from './kpiUtils';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [kpis, setKpis] = useState({
    total: 0,
    abertos: 0,
    resolvidos: 0,
    pendentes: 0,
    mediaResolucao: 'N/A',
    porTecnico: {},
    sla: 0,
  });

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

  useEffect(() => {
    if (tickets.length > 0) {
      const novosKPIs = calcularKPIs(tickets);
      setKpis(novosKPIs);
    }
  }, [tickets]);

  const ticketsPorStatus = useMemo(() => {
    const data = [
      { name: 'Abertos', value: kpis.abertos },
      { name: 'Resolvidos', value: kpis.resolvidos },
      { name: 'Pendentes', value: kpis.pendentes },
    ];
    return data;
  }, [kpis]);

  const ticketsPorPrioridade = useMemo(() => {
      const prioridades = tickets.reduce((acc, ticket) => {
          acc[ticket.prioridade] = (acc[ticket.prioridade] || 0) + 1;
          return acc;
      }, {});
      return Object.keys(prioridades).map(p => ({ name: p, value: prioridades[p] }));
  }, [tickets]);


  const ticketsPorTecnico = useMemo(() => (
    Object.entries(kpis.porTecnico).map(([tecnico, total]) => ({
      subject: tecnico,
      A: total,
      fullMark: kpis.total
    }))
  ), [kpis.porTecnico, kpis.total]);


  return (
    <div className="container-fluid">
      <h3 className="mb-4">Dashboard de Suporte Técnico</h3>

      {/* Painel de KPIs */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card card-kpi">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Total de Tickets</h5>
                  <p className="card-text fs-2">{kpis.total}</p>
                </div>
                <FaTicketAlt className="card-icon" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
            <div className="card card-kpi">
                <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <h5 className="card-title">Tickets Abertos</h5>
                    <p className="card-text fs-2">{kpis.abertos}</p>
                    </div>
                    <FaTools className="card-icon" />
                </div>
                </div>
            </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
            <div className="card card-kpi">
                <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <h5 className="card-title">Tickets Resolvidos</h5>
                    <p className="card-text fs-2">{kpis.resolvidos}</p>
                    </div>
                    <FaCheckCircle className="card-icon" />
                </div>
                </div>
            </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
            <div className={`card card-kpi ${kpis.sla > 90 ? 'bg-success text-white' : 'bg-warning'}`}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="card-title">SLA</h5>
                            <p className="card-text fs-2">{kpis.sla.toFixed(2)}%</p>
                        </div>
                        <FaClock className="card-icon" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tickets por Status</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketsPorStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tickets por Prioridade</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={ticketsPorPrioridade} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label>
                    {ticketsPorPrioridade.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-12 mb-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Performance por Técnico</h5>
                     <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ticketsPorTecnico}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar name="Tickets" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                             <Tooltip />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div> 
  );
}