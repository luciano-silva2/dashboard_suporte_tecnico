import BotaoPerfil from '../Buttons/BotaoPerfil/BotaoPerfil';
import BotaoSair from '../Buttons/BotaoSair/BotaoSair';
import { useTheme } from "../Context/ContextoTema";

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    const bgClass = theme === 'light' ? 'bg-light' : 'bg-dark';
    const textClass = theme === 'light' ? 'text-dark' : 'text-white';
    const borderClass = theme === 'light' ? 'border-dark' : 'border-light';
    const buttonClass = theme === 'light' ? 'btn-dark' : 'btn-light';

    return (
        <div className={`d-flex justify-content-between align-items-center ${bgClass} ${textClass} ${borderClass} border p-3`}>
            <h5 className="m-0">Header</h5>

            <div className="d-flex align-items-center gap-2">
                <button className={`btn btn-sm ${buttonClass}`} onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <BotaoPerfil />
                <BotaoSair />
            </div>
        </div>
    );
}
