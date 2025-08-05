import React, { Suspense, lazy } from "react";
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Sidebar from './Components/Sidebar/Sidebar';
import Home from "./Pages/Home/Home";
import Chat from './Chat/Chat';
import Login from './Login/Login';
import { Routes, Route } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './Firebase/firebase';

const Tickets = lazy(() => import("./Pages/Tickets/Tickets"));
const CriarTicket = lazy(() => import("./Pages/Tickets/CriarTicket"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      {user ? (
        <>
          <Header />
          <Sidebar />
          <div style={{ marginLeft: '200px', padding: '2rem' }}>
            <Suspense fallback={<div>Carregando...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/filtros" element={<Home />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/configuracoes" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/graficos" element={<Dashboard />} /> {}
                <Route path="/criar-ticket" element={<CriarTicket />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;