import { Link, useParams } from 'react-router-dom';
import { boletasDeUsuario } from '../../api/boletasApi.js';
import { obtenerUsuario } from '../../api/usuariosApi.js';
import { useApi } from '../../hooks/useApi.js';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function UserDetailPage() {
  const { id } = useParams();
  const consulta = useApi(() => Promise.all([obtenerUsuario(id), boletasDeUsuario(id)]), [id]);
  if (consulta.cargando && !consulta.datos) return <Cargando />;
  if (!consulta.datos) return <EmptyState mensaje={consulta.error || 'No encontramos ese usuario.'}><Link to="/admin/usuarios" className="btn btn-primary">Volver</Link></EmptyState>;
  const [usuario, boletas] = consulta.datos;
  return (
    <>
      <PageHeader titulo={`${usuario.nombre} ${usuario.apellidos}`} subtitulo={usuario.tipo}>
        <Link to={`/admin/usuarios/${id}/editar`} className="btn btn-primary">Editar usuario</Link>
        <Link to={`/admin/usuarios/${id}/historial`} className="btn btn-outline-primary">Historial de compras ({boletas.length})</Link>
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">← Usuarios</Link>
      </PageHeader>
      <dl className="row">
        <dt className="col-sm-3">RUN</dt><dd className="col-sm-9">{usuario.run}</dd>
        <dt className="col-sm-3">Correo</dt><dd className="col-sm-9">{usuario.correo}</dd>
        <dt className="col-sm-3">Fecha de nacimiento</dt><dd className="col-sm-9">{usuario.fechaNacimiento || '—'}</dd>
        <dt className="col-sm-3">Dirección</dt><dd className="col-sm-9">{usuario.direccion}, {usuario.comuna}, {usuario.region}</dd>
      </dl>
    </>
  );
}
