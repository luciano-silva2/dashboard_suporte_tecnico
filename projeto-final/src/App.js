import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Sidebar from './Components/Sidebar/Sidebar';
import Home from "./Pages/Home/Home";


function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: '200px', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filtros" element={<Home />} />
          <Route path="/configuracoes" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
