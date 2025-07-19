import { auth } from "../../../Chat/Chat";
export default function BotaoSair() {
        
    return (
        <button
            className="btn btn-danger"
            title="Sair"
            onClick={() => auth.signOut()}
        >
            Sair
        </button>
    );
}
