export default function BotaoSair() {
    return (
        <button
            className="btn btn-danger"
            title="Sair"
            onClick={(e) => {console.log('Botão clicado')}}
        >
            Sair
        </button>
    );
}
