import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ContextoTema";

export default function Sidebar() {
    const [menu, setMenu] = useState(false);
    const { theme } = useTheme();

    const toggleMenu = () => setMenu(!menu);

    const bgClass = theme === 'light' ? 'bg-light' : 'bg-dark';
    const textClass = theme === 'light' ? 'text-dark' : 'text-white';
    const borderClass = theme === 'light' ? 'border-dark' : 'border-light';
    const buttonClass = theme === 'light' ? 'btn-dark' : 'btn-light';
    const linkClass = theme === 'light' ? 'text-dark' : 'text-white';

    return (
        <div
            className={`position-fixed h-100 ${bgClass} ${textClass} ${borderClass} border p-3 ${menu ? "col-2" : "col-auto"}`}
            style={{ top: 0, left: 0, bottom: 0, overflowY: "auto", zIndex: 1000 }}
        >
            <button
                className={`btn btn-sm ${buttonClass} mb-3`}
                onClick={toggleMenu}
            >
                {menu ? "Fechar Menu" : "Menu"}
            </button>

            {menu && (
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className={`nav-link ${linkClass}`} to="/">Início</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${linkClass}`} to="/filtros">Filtros</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${linkClass}`} to="/tickets">Tickets</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${linkClass}`} to="/chat">Chat</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${linkClass}`} to="/configuracoes">Configurações</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${linkClass}`} to="/graficos">Gráficos</Link>
                    </li>
                </ul>
            )}
        </div>
    );
}
