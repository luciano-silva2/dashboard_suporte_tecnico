import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';


export default function TicketsTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(collection(db, 'tickets'));
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(tickets);
    })();
  }, []);

  const columns = [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'problema', header: 'Problema' },
    {
      accessorKey: 'prioridade',
      header: 'Prioridade',
      editVariant: 'select',
      selectOptions: ['baixa', 'media', 'alta', 'urgente'],
    },
    {
      accessorKey: 'status',
      header: 'Status',
      editVariant: 'select',
      selectOptions: ['aberto', 'andamento', 'resolvido', 'cancelado'],
    },
  ];

  const handleSave = async ({ row, values }) => {
    const ref = doc(db, 'tickets', row.original.id);
    await updateDoc(ref, values);
    setData(prev =>
      prev.map(item => (item.id === row.original.id ? { ...item, ...values } : item))
    );
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      editingMode="row"
      enableEditing
      onEditingRowSave={handleSave}
    />
  );
}
