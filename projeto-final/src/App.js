import React, { Suspense, lazy, useState } from "react";
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Sidebar from './Components/Sidebar/Sidebar';
import Home from "./Pages/Home/Home";
import Chat from './Chat/Chat';
import Login from './Login/Login';
import { Routes, Route } from "react-router-dom";
import { auth } from './Firebase/firebase';
import { UserProvider } from './context/UserContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ToastContainer, toast, Flip } from 'react-toastify';
import socket from "./socket/socket.js"; 

const Tickets = lazy(() => import("./Pages/Tickets/Tickets"));
const CriarTicket = lazy(() => import("./Pages/Tickets/CriarTicket"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));

function App() {
  const [user] = useAuthState(auth);
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const notify = () => toast('Wow so easy !');
  return (
    <UserProvider>
      {user ? (
        <>
          <Header />
          <Sidebar />
          <div style={{ marginLeft: '200px', padding: '2rem' }}>
            <Suspense fallback={<div>Carregando...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/filtros" element={<Home />} />
                <Route path="/tickets" element={<Tickets setTicketSelecionado={setTicketSelecionado} />} />
                <Route path="/configuracoes" element={<Home />} />
                <Route path="/chat" element={<Chat 
                  ticketSelecionado={ticketSelecionado}
                  setTicketSelecionado={setTicketSelecionado} 
                />} />
                <Route path="/graficos" element={<Dashboard />} />
                <Route path="/criar-ticket" element={<CriarTicket />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
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
        </>
      ) : (
        <Login />
      )}
    </UserProvider>
  );
}

export default App;
