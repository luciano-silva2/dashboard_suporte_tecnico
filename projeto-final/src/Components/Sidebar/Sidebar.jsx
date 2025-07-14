import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const [menu, setMenu] = useState(false);

    const toggleMenu = () => {
        setMenu(!menu);
    };

    return (
        <div
            className={`bg-secondary text-white border border-dark p-3 position-fixed h-100 ${menu ? "col-2" : "col-auto"}`}
            style={{ top: 0, left: 0, bottom: 0, overflowY: "auto", zIndex: 1000 }}
        >
            <button
                className="btn btn-dark btn-sm mb-3"
                onClick={toggleMenu}
            >
                {menu ? "Fechar Menu" : "Menu"}
            </button>

            {menu && (
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/">Início</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/filtros">Filtros</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/tickets">Tickets</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/configuracoes">Configurações</Link>
                    </li>
                </ul>
            )}
        </div>
    );
}
