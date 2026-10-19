import { Link, useParams } from 'react-router-dom';
import { ordenesRepo, usuariosRepo } from '../../data/db.js';
import { ordenesDeUsuario } from '../../data/ordenes.js';
import { useCollection } from '../../hooks/useCollection.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import OrdersTable from '../../components/common/OrdersTable.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Historial de compras de un usuario (todas sus órdenes, pagadas o rechazadas). */
export default function UserHistoryPage() {
  const { run } = useParams();
  const usuario = useCollection(usuariosRepo).find((u) => u.run === run);
  const ordenes = ordenesDeUsuario(useCollection(ordenesRepo), run);
  if (!usuario) return <EmptyState mensaje="No encontramos ese usuario."><Link to="/admin/usuarios" className="btn btn-primary">Volver</Link></EmptyState>;
  return (
    <>
      <PageHeader titulo={`Historial de compras — ${usuario.nombre} ${usuario.apellidos}`} subtitulo={`${ordenes.length} compra(s) registradas`}>
        <Link to={`/admin/usuarios/${run}`} className="btn btn-outline-secondary">← Usuario</Link>
      </PageHeader>
      <OrdersTable ordenes={ordenes} />
    </>
  );
}
