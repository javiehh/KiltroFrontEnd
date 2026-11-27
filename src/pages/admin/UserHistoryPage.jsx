import { Link, useParams } from 'react-router-dom';
import { boletasDeUsuario } from '../../api/boletasApi.js';
import { obtenerUsuario } from '../../api/usuariosApi.js';
import { useApi } from '../../hooks/useApi.js';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import OrdersTable from '../../components/common/OrdersTable.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function UserHistoryPage() {
  const { id } = useParams();
  const consulta = useApi(() => Promise.all([obtenerUsuario(id), boletasDeUsuario(id)]), [id]);
  if (consulta.cargando && !consulta.datos) return <Cargando />;
  if (!consulta.datos) return <EmptyState mensaje={consulta.error || 'No encontramos ese usuario.'}><Link to="/admin/usuarios" className="btn btn-primary">Volver</Link></EmptyState>;
  const [usuario, ordenes] = consulta.datos;
  return (
    <>
      <PageHeader titulo={`Historial de compras — ${usuario.nombre} ${usuario.apellidos}`} subtitulo={`${ordenes.length} compra(s) registradas`}>
        <Link to={`/admin/usuarios/${id}`} className="btn btn-outline-secondary">← Usuario</Link>
      </PageHeader>
      <OrdersTable ordenes={ordenes} />
    </>
  );
}
