import React, { Suspense, lazy } from "react";
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Sidebar from './Components/Sidebar/Sidebar';
import Home from "./Pages/Home/Home";
import Chat from './Chat/Chat';
import { Routes, Route } from "react-router-dom";

const Tickets = lazy(() => import("./Pages/Tickets/Tickets"));
const CriarTicket = lazy(() => import("./Pages/Tickets/CriarTicket"));

function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: '200px', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filtros" element={<Home />} />
          <Route path="/tickets" element={
            <Suspense fallback={<div>Carregando tickets...</div>}>
              <Tickets />
            </Suspense>
          } />
          <Route path="/configuracoes" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/graficos" element={<Home />} />
          <Route path="/criar-ticket" element={
            <Suspense fallback={<div>Carregando formulário...</div>}>
              <CriarTicket />
            </Suspense>
          } />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
