import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Sidebar from './Components/Sidebar/Sidebar';
import Home from "./Pages/Home/Home";
import Tickets from "./Pages/Tickets/Tickets";
import Chat from './Chat/Chat';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: '200px', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filtros" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/configuracoes" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/graficos" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
