export default function Tickets() {
    console.log('Tickets acessados')
    return (
        <div>
            <h2>📋 Lista de Tickets</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Prioridade</th>
                        <th>Status</th>
                        <th>Responsável</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#1021</td>
                        <td>Erro ao acessar sistema interno</td>
                        <td>Alta</td>
                        <td>Em aberto</td>
                        <td>João Martins</td>
                    </tr>
                    <tr>
                        <td>#1022</td>
                        <td>Solicitação de novo equipamento</td>
                        <td>Média</td>
                        <td>Em andamento</td>
                        <td>Carla Souza</td>
                    </tr>
                    <tr>
                        <td>#1023</td>
                        <td>Troca de senha</td>
                        <td>Baixa</td>
                        <td>Concluído</td>
                        <td>Ana Ribeiro</td>
                    </tr>
                    <tr>
                        <td>#1024</td>
                        <td>Lentidão na rede</td>
                        <td>Alta</td>
                        <td>Em aberto</td>
                        <td>Equipe de TI</td>
                    </tr>
                    <tr>
                        <td>#1025</td>
                        <td>Configuração de e-mail corporativo</td>
                        <td>Média</td>
                        <td>Em andamento</td>
                        <td>Lucas Almeida</td>
                    </tr>
                    <tr>
                        <td>#1026</td>
                        <td>Acesso negado a pasta compartilhada</td>
                        <td>Alta</td>
                        <td>Em aberto</td>
                        <td>Mariana Lopes</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
