<<<<<<< HEAD
import React, { Suspense, lazy, useState, useEffect } from "react";
=======
import React, { Suspense, lazy, useState } from "react";
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Sidebar from './Components/Sidebar/Sidebar';
import Home from "./Pages/Home/Home";
import Chat from './Chat/Chat';
import Login from './Login/Login';
import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { auth } from './Firebase/firebase';
import { UserProvider } from './context/UserContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ToastContainer, toast, Flip } from 'react-toastify';
import socket from "./socket/socket.js";
import 'react-toastify/dist/ReactToastify.css';
=======
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './Firebase/firebase';
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386

const Tickets = lazy(() => import("./Pages/Tickets/Tickets"));
const CriarTicket = lazy(() => import("./Pages/Tickets/CriarTicket"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
<<<<<<< HEAD

function App() {
  const [user] = useAuthState(auth);
  const [ticketSelecionado, setTicketSelecionado] = useState(null);

  // useEffect para as notificações
  useEffect(() => {
    // Escuta o evento 'mensagem' do servidor
    socket.on("mensagem", (data) => {
      // Verifica se a mensagem não foi enviada pelo próprio usuário logado
      if (user && data.remetente !== user.displayName) {
        toast.info(`${data.remetente}: ${data.msg}`, {
          // Aqui você pode adicionar opções personalizadas para a notificação
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });

    // Função de limpeza para remover o listener quando o componente for desmontado
    return () => {
      socket.off("mensagem");
    };
  }, [user]); // Adiciona 'user' como dependência para que o efeito seja reexecutado se o usuário mudar

  return (
    <UserProvider>
=======
function App() {
  const [user] = useAuthState(auth);
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  return (
    <>
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
      {user ? (
        <>
          <Header />
          <Sidebar />
          <div style={{ marginLeft: '200px', padding: '2rem' }}>
            <Suspense fallback={<div>Carregando...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/filtros" element={<Home />} />
<<<<<<< HEAD
                <Route path="/tickets" element={<Tickets setTicketSelecionado={setTicketSelecionado} />} />
                <Route path="/configuracoes" element={<Home />} />
                <Route path="/chat" element={<Chat
                  ticketSelecionado={ticketSelecionado}
                  setTicketSelecionado={setTicketSelecionado}
                />} />
                <Route path="/graficos" element={<Dashboard />} />
=======
                <Route path="/tickets" element={<Tickets setTicketSelecionado = {setTicketSelecionado} />} />
                <Route path="/configuracoes" element={<Home />} />
                <Route path="/chat" element={<Chat ticketSelecionado = {ticketSelecionado}
                  setTicketSelecionado = {setTicketSelecionado}/>} />
                <Route path="/graficos" element={<Dashboard />} /> {}
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
                <Route path="/criar-ticket" element={<CriarTicket />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
<<<<<<< HEAD
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Flip}
          />
=======
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
        </>
      ) : (
        <Login />
      )}
<<<<<<< HEAD
    </UserProvider>
=======
    </>
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
  );
}

export default App;