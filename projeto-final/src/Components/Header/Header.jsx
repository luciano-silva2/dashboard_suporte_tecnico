import BotaoPerfil from '../Buttons/BotaoPerfil/BotaoPerfil';
import BotaoSair from '../Buttons/BotaoSair/BotaoSair';

export default function Header() {
    return (
        <div className="d-flex justify-content-between align-items-center bg-secondary text-white border border-dark p-3">
            <h5 className="m-0">Header</h5>

            <div className="d-flex align-items-center">
                <BotaoPerfil />
                <BotaoSair />
            </div>
        </div>
    );
}
