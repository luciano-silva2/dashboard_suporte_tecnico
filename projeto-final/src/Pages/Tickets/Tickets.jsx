import { useState, useEffect } from "react";
import { db } from '../../Firebase/firebase';
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';

export default function Tickets() {
    const [ticket, setTicket] = useState('')
    const [tickets, setTickets] = useState([])
    const [nome, setNome] = useState('');
    const [problema, setProblema] = useState('');
    const [prioridade, setPrioridade] = useState('');

    const salvarDados = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'tickets'), {
                nome: nome,
                problema: problema,
                prioridade: prioridade
            });

            setNome('');
            setProblema('');
            setPrioridade('');

            alert("Ticket criado com sucesso");

        } catch (erro) {
            console.log("Erro ao criar ticket:", erro);
        }
    };


    useEffect(() => {

        const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
            const dados = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()

            }))
            setTickets(dados)
        })







        // const buscarDados = async () => {
        //     try {
        //         const querySnapshot = await getDocs(collection(db, 'tickets'))
        //         const dados = querySnapshot.docs.map((doc) => ({
        //             id: doc.id,
        //             ...doc.data()

        //         }))
        //         setTickets(dados)
        //     } catch (erro) {
        //         console.log(erro)
        //     }
        // }
        // buscarDados()
        return ()=> unsubscribe()
    }, [])
    return (
        <div>
            <form onSubmit={salvarDados}>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                />

                <input
                    type="text"
                    value={problema}
                    onChange={(e) => setProblema(e.target.value)}
                    placeholder="Digite seu problema"
                />

                <input
                    type="text"
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    placeholder="Digite a prioridade do problema"
                />

                <button type="submit" id="botaoCriarTicket">Criar Ticket</button>
            </form>

            <ul>
                {tickets.map((ticket) => (
                    <li key={ticket.id}>
                        <strong>{ticket.nome}</strong>: {ticket.problema} - <em>{ticket.prioridade}</em>
                    </li>
                ))}
            </ul>
        </div>
    );
}
