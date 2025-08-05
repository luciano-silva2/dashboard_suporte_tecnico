import { useState, useMemo } from "react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

export default function AtenderTicketButton({ ticket, currentUser, isFuncionario, onAfter }) {
  const [loading, setLoading] = useState(false);

  // Calcula se o botão deve aparecer
  const podeAtender = useMemo(() => {
    return isFuncionario && ticket?.status === "aberto" && !ticket?.funcionarioId;
  }, [isFuncionario, ticket]);

  const handleAtender = async () => {
    if (!podeAtender) return;
    setLoading(true);

    try {
      const ref = doc(db, "tickets", ticket.id);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("Ticket não encontrado.");
        const data = snap.data();
        if (data.funcionarioId) throw new Error("Ticket já foi assumido.");
        if (data.status !== "aberto") throw new Error("Ticket não está mais aberto.");

        tx.update(ref, {
          funcionarioId: currentUser.uid,
          status: "em_andamento",
          assumidoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
        });
      });

      onAfter?.();
    } catch (e) {
      alert(e.message || "Erro ao atender ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (!podeAtender) return null;

  return (
    <button
      className="btn btn-warning btn-sm"
      onClick={handleAtender}
      disabled={loading}
      title="Assumir este ticket"
    >
      {loading ? "Assumindo..." : "Atender"}
    </button>
  );
}
