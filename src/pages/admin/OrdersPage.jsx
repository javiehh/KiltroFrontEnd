import { useState } from 'react';
import { ordenesRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import OrdersTable from '../../components/common/OrdersTable.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Órdenes / boletas de todas las compras, con filtro por estado. */
export default function OrdersPage() {
  const ordenes = useCollection(ordenesRepo);
  const [estado, setEstado] = useState('');
  const visibles = [...ordenes].filter((o) => !estado || o.estado === estado).sort((a, b) => b.fecha.localeCompare(a.fecha));
  return (
    <>
      <PageHeader titulo="Órdenes y boletas" subtitulo={`${ordenes.length} órdenes registradas`}>
        <select className="form-select" aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option><option value="pagada">Pagadas</option><option value="rechazada">Rechazadas</option><option value="pendiente">Pendientes</option>
        </select>
      </PageHeader>
      <OrdersTable ordenes={visibles} />
    </>
  );
}
